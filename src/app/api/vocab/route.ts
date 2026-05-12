import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

const SAMPLE_DECKS = [
  { id: '1', name: 'Business English', description: 'Essential vocabulary for professional environments', level: 'B2', category: 'Business', icon: '💼', _count: { cards: 24 } },
  { id: '2', name: 'Travel & Tourism', description: 'Words and phrases for traveling abroad', level: 'B1', category: 'Travel', icon: '✈️', _count: { cards: 18 } },
  { id: '3', name: 'Idioms & Phrasals', description: 'Common idiomatic expressions and phrasal verbs', level: 'C1', category: 'Idioms', icon: '🧠', _count: { cards: 30 } },
  { id: '4', name: 'Academic English', description: 'Formal vocabulary for academic writing and presentations', level: 'C1', category: 'Academic', icon: '🎓', _count: { cards: 22 } },
  { id: '5', name: 'Daily Life', description: 'Everyday vocabulary for common situations', level: 'B1', category: 'Daily', icon: '🏠', _count: { cards: 20 } },
  { id: '6', name: 'Technology', description: 'Tech and digital vocabulary', level: 'B2', category: 'Technology', icon: '💻', _count: { cards: 16 } },
]

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const decks = await db.vocabDeck.findMany({
      include: { _count: { select: { cards: true } } },
      orderBy: { createdAt: 'desc' },
    })
    if (decks.length > 0) {
      return NextResponse.json(decks)
    }
  } catch {
    // DB not ready, return sample data
  }
  return NextResponse.json(SAMPLE_DECKS)
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
