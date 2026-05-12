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
    type: 'video',
    topic: 'Psychology',
    duration: 'long',
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
    type: 'video',
    topic: 'Humor',
    duration: 'medium',
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
    type: 'video',
    topic: 'Communication',
    duration: 'medium',
  },
]

const SAMPLE_SHORTS = [
  {
    id: 's1',
    title: 'When someone says "I literally died" 😂',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz1',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Meme about literal vs figurative language',
    level: 'A2',
    prompts: JSON.stringify(['What does "literally" actually mean?', 'Why is this funny?']),
    type: 'short',
    topic: 'Humor',
    duration: 'short',
  },
  {
    id: 's2',
    title: 'British vs American English in 60 seconds',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz2',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Quick comparison of British and American words',
    level: 'B1',
    prompts: JSON.stringify(['Name 3 differences mentioned', 'Which version do you prefer?']),
    type: 'short',
    topic: 'Culture',
    duration: 'short',
  },
  {
    id: 's3',
    title: 'Pronunciation: Words Germans always say wrong',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz3',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Common pronunciation mistakes by German speakers',
    level: 'B1',
    prompts: JSON.stringify(['Which words do you mispronounce?', 'Practice the correct pronunciation']),
    type: 'short',
    topic: 'Pronunciation',
    duration: 'short',
  },
  {
    id: 's4',
    title: 'Slang words that make you sound native 🗣️',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz4',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Essential slang for everyday conversation',
    level: 'B2',
    prompts: JSON.stringify(['Use 2 of these words in a sentence', 'Which slang word is your favorite?']),
    type: 'short',
    topic: 'Slang',
    duration: 'short',
  },
  {
    id: 's5',
    title: 'How to order coffee like a native ☕',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz5',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Real-life English for coffee shops',
    level: 'A2',
    prompts: JSON.stringify(['What would you order?', 'Practice ordering out loud']),
    type: 'short',
    topic: 'Daily Life',
    duration: 'short',
  },
  {
    id: 's6',
    title: 'Idiom: "Break a leg" — what it really means 🎭',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz6',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Fun explanation of common English idioms',
    level: 'B1',
    prompts: JSON.stringify(['When would you use this idiom?', 'Can you think of a German equivalent?']),
    type: 'short',
    topic: 'Idioms',
    duration: 'short',
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

  const allSample = [...SAMPLE_VIDEOS, ...SAMPLE_SHORTS]
  const parsed = allSample.map(v => ({
    ...v,
    prompts: JSON.parse(v.prompts),
  }))
  return NextResponse.json(parsed)
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
