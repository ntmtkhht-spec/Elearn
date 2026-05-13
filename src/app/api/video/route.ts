import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const videos = await db.videoAssignment.findMany({ orderBy: { createdAt: 'desc' } })
    const parsed = videos.map(v => ({
      ...v,
      prompts: v.prompts ? JSON.parse(v.prompts) : [],
    }))
    return NextResponse.json(parsed)
  } catch {
    // DB not ready
  }

  return NextResponse.json([])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { youtubeUrl, title, level, type, topic, duration } = body

    const match = youtubeUrl?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    const youtubeId = match ? match[1] : null

    if (!youtubeId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 })
    }

    // Generate AI prompts based on title
    let prompts = [
      'What are the main ideas presented?',
      'What examples or evidence does the speaker provide?',
      'What is your opinion on the topic?',
      'Can you summarize the key takeaways?',
    ]

    try {
      const systemPrompt = `You are an English learning exercise creator. Generate 4 guiding questions for a student who will watch a YouTube video titled "${title}". The questions should help them focus while watching and practice their English comprehension. Return ONLY a JSON array of 4 strings, no other text.`

      const response = await chatCompletion(systemPrompt, `Generate guiding questions for the video: "${title}"`)

      if (response) {
        const parsed = parseJSONResponse<string[]>(response)
        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          prompts = parsed
        }
      }
    } catch {
      // AI not available, use default prompts
    }

    const newVideo = {
      id: `${type === 'short' ? 's' : 'v'}-${Date.now()}`,
      title,
      youtubeUrl,
      youtubeId,
      description: null,
      level: level || 'B2',
      prompts,
      type: type || 'video',
      topic: topic || null,
      duration: duration || null,
    }

    try {
      const { db } = await import('@/lib/db')
      await db.videoAssignment.create({
        data: {
          title,
          youtubeUrl,
          youtubeId,
          level: level || 'B2',
          prompts: JSON.stringify(prompts),
          type: type || 'video',
          topic: topic || null,
          duration: duration || null,
        },
      })
    } catch {
      // DB not ready
    }

    return NextResponse.json(newVideo)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
