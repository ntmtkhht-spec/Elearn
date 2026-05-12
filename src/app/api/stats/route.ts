import { NextResponse } from 'next/server'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  try {
    const { db } = await import('@/lib/db')
    const stats = await db.learningStats.findUnique({ where: { date: today } })
    if (stats) {
      return NextResponse.json(stats)
    }
  } catch {
    // DB not ready
  }

  return NextResponse.json({
    id: 'stats-today',
    date: today,
    vocabStudied: 24,
    readingDone: 3,
    videosWatched: 1,
    conversationMins: 15,
    streak: 7,
  })
}
