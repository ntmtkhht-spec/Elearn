import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'
import { getUserId } from '@/lib/auth'

const STARTER_DECKS = [
  { name: 'First Words', description: 'Essential beginner words for everyday communication', level: 'A1', category: 'Basics', icon: '🌱' },
  { name: 'Greetings & Introductions', description: 'Learn to greet, introduce yourself, and say goodbye', level: 'A1', category: 'Daily', icon: '👋' },
  { name: 'Daily Routines', description: 'Words and phrases for talking about your day', level: 'A2', category: 'Daily', icon: '🌞' },
  { name: 'Shopping & Food', description: 'Vocabulary for restaurants, shops, and groceries', level: 'A2', category: 'Food', icon: '🛒' },
  { name: 'Business English', description: 'Essential vocabulary for professional environments', level: 'B2', category: 'Business', icon: '💼' },
  { name: 'Travel & Tourism', description: 'Words and phrases for traveling abroad', level: 'B1', category: 'Travel', icon: '✈️' },
  { name: 'Idioms & Phrasals', description: 'Common idiomatic expressions and phrasal verbs', level: 'C1', category: 'Idioms', icon: '🧠' },
  { name: 'Academic English', description: 'Formal vocabulary for academic writing and presentations', level: 'C1', category: 'Academic', icon: '🎓' },
]

async function seedStarterDecks(userId: string) {
  const { db } = await import('@/lib/db')
  const existing = await db.vocabDeck.count({ where: { userId } })
  if (existing > 0) return

  for (const deck of STARTER_DECKS) {
    await db.vocabDeck.create({
      data: { ...deck, userId },
    })
  }
}

export async function GET() {
  const userId = await getUserId()

  try {
    const { db } = await import('@/lib/db')

    if (userId) {
      await seedStarterDecks(userId)
    }

    const decks = await db.vocabDeck.findMany({
      where: userId ? { userId } : undefined,
      include: { _count: { select: { cards: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(decks)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  const userId = await getUserId()

  try {
    const body = await request.json()
    const { topic, level, count } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const cardCount = count || 10
    const deckLevel = level || 'B2'

    let generatedCards: Array<{
      word: string
      germanTranslation: string
      pronunciation: string
      partOfSpeech: string
      exampleSentence: string
      exampleTranslation: string
    }> = []

    try {
      const systemPrompt = `You are an English vocabulary teacher for German-speaking learners at ${deckLevel} level.
Generate ${cardCount} English vocabulary words about "${topic}".
For each word provide:
- word: the English word
- germanTranslation: the German translation
- pronunciation: IPA pronunciation
- partOfSpeech: noun, verb, adjective, adverb, etc.
- exampleSentence: an example sentence using the word
- exampleTranslation: German translation of the example sentence

Return ONLY a valid JSON array. No other text.`

      const response = await chatCompletion(systemPrompt, `Generate ${cardCount} vocabulary words about "${topic}" for ${deckLevel} level.`)

      if (response) {
        const parsed = parseJSONResponse<Array<{
          word: string
          germanTranslation: string
          pronunciation: string
          partOfSpeech: string
          exampleSentence: string
          exampleTranslation: string
        }>>(response)

        if (parsed && Array.isArray(parsed) && parsed.length > 0) {
          generatedCards = parsed
        }
      }
    } catch {
      // AI not available
    }

    try {
      const { db } = await import('@/lib/db')
      const deck = await db.vocabDeck.create({
        data: {
          name: topic,
          userId: userId ?? undefined,
          description: `AI-generated deck about ${topic}`,
          level: deckLevel,
          category: 'Custom',
          icon: '📚',
          cards: {
            create: generatedCards.length > 0
              ? generatedCards.map((card, i) => ({
                  word: card.word,
                  translation: card.germanTranslation,
                  pronunciation: card.pronunciation || null,
                  partOfSpeech: card.partOfSpeech || null,
                  exampleSentence: card.exampleSentence || null,
                  exampleTranslation: card.exampleTranslation || null,
                  difficulty: Math.min(Math.ceil(i / 3) + 1, 5),
                }))
              : Array.from({ length: cardCount }, (_, i) => ({
                  word: `${topic} word ${i + 1}`,
                  translation: `${topic} Wort ${i + 1}`,
                  difficulty: 2,
                })),
          },
        },
        include: { _count: { select: { cards: true } } },
      })
      return NextResponse.json(deck)
    } catch {
      // DB not ready
    }

    const newDeck = {
      id: `deck-${Date.now()}`,
      name: topic,
      description: `AI-generated deck about ${topic}`,
      level: deckLevel,
      category: 'Custom',
      icon: '📚',
      _count: { cards: generatedCards.length || cardCount },
    }
    return NextResponse.json(newDeck)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
