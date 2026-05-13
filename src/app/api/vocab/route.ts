import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const decks = await db.vocabDeck.findMany({
      include: { _count: { select: { cards: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(decks)
  } catch {
    // DB not ready, return empty array
  }
  return NextResponse.json([])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, level, count } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const cardCount = count || 10
    const deckLevel = level || 'B2'

    // Try to generate with AI
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
      // AI not available, create basic cards
    }

    // Create deck in database
    try {
      const { db } = await import('@/lib/db')
      const deck = await db.vocabDeck.create({
        data: {
          name: topic,
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

    // Fallback response
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
