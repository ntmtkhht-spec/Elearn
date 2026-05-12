import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

const SAMPLE_VIDEOS = [
  {
    id: 'v1',
    title: 'The Power of Vulnerability — Brené Brown',
    youtubeUrl: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
    youtubeId: 'iCvmsMzlF7o',
    description: 'A powerful TED Talk about the importance of vulnerability in human connection.',
    level: 'B2',
    prompts: JSON.stringify([
      'What is the main argument Brown makes about vulnerability?',
      'How does Brown distinguish between shame and vulnerability?',
      'What examples does she use to illustrate her points?',
      'How does this talk relate to your own experiences?',
    ]),
  },
  {
    id: 'v2',
    title: 'Inside the Mind of a Master Procrastinator',
    youtubeUrl: 'https://www.youtube.com/watch?v=arj7oStGLkU',
    youtubeId: 'arj7oStGLkU',
    description: 'Tim Urban explains why procrastinators procrastinate, with hilarious visuals.',
    level: 'B1',
    prompts: JSON.stringify([
      'What is the "Instant Gratification Monkey"?',
      'How does the "Panic Monster" help procrastinators?',
      'What are the two types of procrastination described?',
      'Can you relate to the speaker\'s experience?',
    ]),
  },
  {
    id: 'v3',
    title: 'How to Speak So That People Want to Listen',
    youtubeUrl: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
    youtubeId: 'eIho2S0ZahI',
    description: 'Julian Treasure shares vocal habits and tools to speak powerfully.',
    level: 'C1',
    prompts: JSON.stringify([
      'What are the "seven deadly sins" of speaking?',
      'What are the four foundations of powerful speaking (HAIL)?',
      'What vocal exercises does Treasure recommend?',
      'How can you apply these techniques in your daily life?',
    ]),
  },
]

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const videos = await db.videoAssignment.findMany({ orderBy: { createdAt: 'desc' } })
    if (videos.length > 0) {
      const parsed = videos.map(v => ({
        ...v,
        prompts: v.prompts ? JSON.parse(v.prompts) : [],
      }))
      return NextResponse.json(parsed)
    }
  } catch {
    // DB not ready
  }

  const parsed = SAMPLE_VIDEOS.map(v => ({
    ...v,
    prompts: JSON.parse(v.prompts),
  }))
  return NextResponse.json(parsed)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { youtubeUrl, title, level } = body

    const match = youtubeUrl?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
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
      id: `v-${Date.now()}`,
      title,
      youtubeUrl,
      youtubeId,
      description: null,
      level: level || 'B2',
      prompts,
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
