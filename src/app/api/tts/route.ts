import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, speed } = body

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Try using z-ai-web-dev-sdk TTS
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default
      const zai = await ZAI.create()

      const inputText = text.trim().substring(0, 1024) // API limit

      const response = await zai.audio.tts.create({
        input: inputText,
        voice: 'jam', // English voice - "英音绅士"
        speed: speed || 0.9,
        response_format: 'mp3',
        stream: false,
      })

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(new Uint8Array(arrayBuffer))

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'no-cache',
        },
      })
    } catch (ttsError) {
      console.error('TTS SDK error:', ttsError)
      // Fall back to indicating browser TTS should be used
    }

    // Fallback: tell client to use browser TTS
    return NextResponse.json({
      text,
      useBrowserTTS: true,
      lang: 'en-US',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
