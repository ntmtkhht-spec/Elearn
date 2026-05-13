import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

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
    return NextResponse.json(cards)
  } catch {
    // DB not ready
  }

  return NextResponse.json([])
}

export async function POST(request: Request) {
  const userId = await getUserId()

  try {
    const body = await request.json()
    const { cardId, rating } = body

    const ratingMap: Record<string, number> = { again: 0, hard: 2, good: 4, easy: 5 }
    const quality = ratingMap[rating] || 3

    let interval = 1
    let easeFactor = 2.5

    if (quality >= 3) {
      interval = Math.max(1, Math.round(interval * easeFactor))
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    } else {
      interval = 1
      easeFactor = Math.max(1.3, easeFactor - 0.2)
    }

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    try {
      const { db } = await import('@/lib/db')
      const existing = await db.vocabProgress.findFirst({
        where: { cardId, ...(userId ? { userId } : {}) },
      })

      if (existing) {
        await db.vocabProgress.update({
          where: { id: existing.id },
          data: {
            attempts: { increment: 1 },
            correctness: quality >= 3 ? { increment: 1 } : undefined,
            lastReviewedAt: new Date(),
            nextReviewAt: nextReview,
            interval,
            easeFactor,
            status: quality >= 3 ? 'review' : 'learning',
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
            status: quality >= 3 ? 'review' : 'learning',
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
    } catch {
      // DB not ready
    }

    return NextResponse.json({ success: true, nextReview: nextReview.toISOString(), interval })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
