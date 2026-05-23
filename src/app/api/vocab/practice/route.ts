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
  const mode = searchParams.get('mode')
  const userId = await getUserId()

  try {
    const { db } = await import('@/lib/db')
    
    let whereClause: any = deckId ? { deckId } : undefined
    
    if (mode === 'hard' && userId) {
      whereClause = {
        progress: {
          some: {
            userId,
            OR: [
              { status: 'learning' },
              { easeFactor: { lt: 2.5 } }
            ]
          }
        }
      }
    }

    const cards = await db.vocabCard.findMany({
      where: whereClause,
      include: {
        progress: userId
          ? { where: { userId } }
          : true,
      },
    })
    
    if (mode === 'hard') {
      // Sort hard cards by nextReviewAt
      const hardCards = cards.sort((a, b) => {
        const tA = new Date(a.progress[0]?.nextReviewAt || 0).getTime()
        const tB = new Date(b.progress[0]?.nextReviewAt || 0).getTime()
        return tA - tB
      })
      return NextResponse.json(hardCards.slice(0, 20))
    }
    
    if (deckId) {
      const now = new Date()
      let dueCards: typeof cards = []
      let newCards: typeof cards = []

      for (const card of cards) {
        const prog = card.progress[0]
        if (!prog) {
          newCards.push(card)
        } else {
          // If the card is due, or it's a learning card that is due
          if (new Date(prog.nextReviewAt) <= now) {
            dueCards.push(card)
          }
        }
      }

      // Sort due cards so learning (shorter intervals) come first
      dueCards.sort((a, b) => {
        const tA = new Date(a.progress[0].nextReviewAt).getTime()
        const tB = new Date(b.progress[0].nextReviewAt).getTime()
        return tA - tB
      })

      // Limit to 20 due cards per session, and fill up with new cards up to 20
      let sessionCards = [...dueCards].slice(0, 20)
      if (sessionCards.length < 20) {
        sessionCards = [...sessionCards, ...newCards.slice(0, 20 - sessionCards.length)]
      }
      return NextResponse.json(sessionCards)
    }
    
    if (cards.length > 0) return NextResponse.json(cards.slice(0, 20))
  } catch {
    // DB not ready
  }

  // Only use sample cards when no deckId provided and DB unavailable
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

    const { db } = await import('@/lib/db')

    const existing = await db.vocabProgress.findFirst({
      where: { cardId, ...(userId ? { userId } : {}) },
    })

    let status = existing?.status ?? 'new'
    let interval = existing?.interval ?? 0 // in days for review
    let easeFactor = existing?.easeFactor ?? 2.5
    let stepIndex = existing?.correctness ?? 0 // tracking learning step (0=1m, 1=10m)
    let attempts = (existing?.attempts ?? 0) + 1

    let nextReview = new Date()

    if (status === 'new' || status === 'learning' || status === 'relearning') {
      status = 'learning'
      if (rating === 'again') {
        stepIndex = 0
        nextReview.setMinutes(nextReview.getMinutes() + 1)
      } else if (rating === 'hard') {
        // stay on current step, but add small delay (5m or 10m)
        nextReview.setMinutes(nextReview.getMinutes() + (stepIndex === 0 ? 5 : 10))
      } else if (rating === 'good') {
        if (stepIndex === 0) {
          stepIndex = 1
          nextReview.setMinutes(nextReview.getMinutes() + 10)
        } else {
          status = 'review'
          interval = 1
          nextReview.setDate(nextReview.getDate() + interval)
        }
      } else if (rating === 'easy') {
        status = 'review'
        interval = 4
        nextReview.setDate(nextReview.getDate() + interval)
      }
    } else if (status === 'review' || status === 'mastered') {
      if (rating === 'again') {
        status = 'learning' // lapse
        stepIndex = 0
        easeFactor = Math.max(1.3, easeFactor - 0.2)
        interval = 1 // reset
        nextReview.setMinutes(nextReview.getMinutes() + 1)
      } else if (rating === 'hard') {
        easeFactor = Math.max(1.3, easeFactor - 0.15)
        interval = Math.max(1, Math.round(interval * 1.2))
        nextReview.setDate(nextReview.getDate() + interval)
      } else if (rating === 'good') {
        interval = Math.max(1, Math.round(interval * easeFactor))
        nextReview.setDate(nextReview.getDate() + interval)
      } else if (rating === 'easy') {
        easeFactor += 0.15
        interval = Math.max(1, Math.round(interval * easeFactor * 1.3))
        nextReview.setDate(nextReview.getDate() + interval)
      }
      
      // if interval > 21, mark as mastered
      if (status !== 'learning' && interval >= 21) {
        status = 'mastered'
      }
    }

    if (existing) {
      await db.vocabProgress.update({
        where: { id: existing.id },
        data: {
          attempts,
          correctness: status === 'learning' ? stepIndex : (['good', 'easy'].includes(rating) ? (existing.correctness) + 1 : 0),
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
          correctness: status === 'learning' ? stepIndex : 1,
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
