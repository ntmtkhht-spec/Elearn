import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { exerciseId, answers } = body

    // In a real app, we would check the answers against the database
    // For now, just save the progress
    try {
      const { db } = await import('@/lib/db')
      await db.readingProgress.create({
        data: {
          exerciseId,
          answers: JSON.stringify(answers),
          completedAt: new Date(),
        },
      })
    } catch {
      // DB not ready
    }

    return NextResponse.json({ success: true, exerciseId, answersSubmitted: Object.keys(answers).length })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
