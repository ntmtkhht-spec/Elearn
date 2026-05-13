import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

const SAMPLE_CARDS: Record<string, Array<{ id: string; deckId: string; word: string; translation: string; pronunciation: string; partOfSpeech: string; exampleSentence: string; exampleTranslation: string; difficulty: number; notes: null }>> = {
  default: [
    { id: 'c1', deckId: 'default', word: 'Hello', translation: 'Hallo', pronunciation: '/həˈloʊ/', partOfSpeech: 'interjection', exampleSentence: 'Hello, how are you today?', exampleTranslation: 'Hallo, wie geht es dir heute?', difficulty: 1, notes: null },
    { id: 'c2', deckId: 'default', word: 'Thank you', translation: 'Danke', pronunciation: '/θæŋk juː/', partOfSpeech: 'phrase', exampleSentence: 'Thank you for your help.', exampleTranslation: 'Danke für deine Hilfe.', difficulty: 1, notes: null },
    { id: 'c3', deckId: 'default', word: 'Please', translation: 'Bitte', pronunciation: '/pliːz/', partOfSpeech: 'adverb', exampleSentence: 'Please sit down.', exampleTranslation: 'Bitte setzen Sie sich.', difficulty: 1, notes: null },
    { id: 'c4', deckId: 'default', word: 'Goodbye', translation: 'Auf Wiedersehen', pronunciation: '/ɡʊdˈbaɪ/', partOfSpeech: 'interjection', exampleSentence: 'Goodbye, see you tomorrow!', exampleTranslation: 'Auf Wiedersehen, bis morgen!', difficulty: 1, notes: null },
    { id: 'c5', deckId: 'default', word: 'Yes', translation: 'Ja', pronunciation: '/jes/', partOfSpeech: 'adverb', exampleSentence: 'Yes, I would like some water.', exampleTranslation: 'Ja, ich hätte gerne etwas Wasser.', difficulty: 1, notes: null },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deckId = searchParams.get('deckId')
  const userId = await getUserId()

  try {
    const { db } = await import('@/lib/db')
    const cards = await db.vocabCard.findMany({
      where: deckId ? { deckId } : undefined,
      include: {
        progress: userId
          ? { where: { userId } }
          : true,
      },
      take: 20,
    })
    if (cards.length > 0) return NextResponse.json(cards)
  } catch {
    // DB not ready
  }

  return NextResponse.json(SAMPLE_CARDS.default)
}

export async function POST(request: Request) {
  const userId = await getUserId()

  try {
    const body = await request.json()
    const { cardId, rating } = body

    if (!cardId || typeof cardId !== 'string') {
      return NextResponse.json({ error: 'cardId is required' }, { status: 400 })
    }

    const validRatings = ['again', 'hard', 'good', 'easy']
    if (!rating || !validRatings.includes(rating)) {
      return NextResponse.json({ error: 'rating must be one of: again, hard, good, easy' }, { status: 400 })
    }

    const ratingMap: Record<string, number> = { again: 0, hard: 2, good: 4, easy: 5 }
    const quality = ratingMap[rating]

    const { db } = await import('@/lib/db')

    const existing = await db.vocabProgress.findFirst({
      where: { cardId, ...(userId ? { userId } : {}) },
    })

    let interval = existing?.interval ?? 1
    let easeFactor = existing?.easeFactor ?? 2.5

    if (quality >= 3) {
      interval = Math.max(1, Math.round(interval * easeFactor))
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    } else {
      interval = 1
      easeFactor = Math.max(1.3, easeFactor - 0.2)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    const newAttempts = (existing?.attempts ?? 0) + 1
    const newCorrectness = (existing?.correctness ?? 0) + (quality >= 3 ? 1 : 0)

    // Determine status: mastered after 5+ correct with high ease, otherwise review/learning
    let status = 'learning'
    if (quality >= 3) {
      if (newCorrectness >= 5 && easeFactor >= 2.0 && interval >= 7) {
        status = 'mastered'
      } else {
        status = 'review'
      }
    }

    if (existing) {
      await db.vocabProgress.update({
        where: { id: existing.id },
        data: {
          attempts: newAttempts,
          correctness: newCorrectness,
          lastReviewedAt: new Date(),
          nextReviewAt: nextReview,
          interval,
          easeFactor,
          status,
        },
      })
    } else {
      await db.vocabProgress.create({
        data: {
          cardId,
          userId: userId ?? undefined,
          correctness: quality >= 3 ? 1 : 0,
          attempts: 1,
          lastReviewedAt: new Date(),
          nextReviewAt: nextReview,
          interval,
          easeFactor,
          status,
        },
      })
    }

    // Update today's stats
    if (userId) {
      const today = new Date().toISOString().split('T')[0]
      await db.learningStats.upsert({
        where: { userId_date: { userId, date: today } },
        create: { userId, date: today, vocabStudied: 1 },
        update: { vocabStudied: { increment: 1 } },
      })
    }

    return NextResponse.json({ success: true, nextReview: nextReview.toISOString(), interval, status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message, success: false }, { status: 500 })
  }
}
