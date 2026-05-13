import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

export async function POST(request: Request) {
  const userId = await getUserId()

  try {
    const body = await request.json()
    const { exerciseId, answers, score } = body

    try {
      const { db } = await import('@/lib/db')
      await db.readingProgress.create({
        data: {
          exerciseId,
          userId: userId ?? undefined,
          answers: JSON.stringify(answers),
          score: score ?? null,
          completedAt: new Date(),
        },
      })

      // Update today's stats
      if (userId) {
        const today = new Date().toISOString().split('T')[0]
        await db.learningStats.upsert({
          where: { userId_date: { userId, date: today } },
          create: { userId, date: today, readingDone: 1 },
          update: { readingDone: { increment: 1 } },
        })
      }
    } catch {
      // DB not ready
    }

    return NextResponse.json({ success: true, exerciseId, answersSubmitted: Object.keys(answers).length })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
