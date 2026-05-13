import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

export async function GET() {
  const userId = await getUserId()
  const today = new Date().toISOString().split('T')[0]

  try {
    const { db } = await import('@/lib/db')
    const stats = await db.learningStats.findUnique({
      where: { userId_date: { userId: userId ?? '', date: today } },
    })
    if (stats) return NextResponse.json(stats)

    // Return empty stats for today
    return NextResponse.json({
      id: 'stats-today',
      date: today,
      vocabStudied: 0,
      readingDone: 0,
      videosWatched: 0,
      conversationMins: 0,
      streak: 0,
    })
  } catch {
    return NextResponse.json({
      id: 'stats-today',
      date: today,
      vocabStudied: 0,
      readingDone: 0,
      videosWatched: 0,
      conversationMins: 0,
      streak: 0,
    })
  }
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const today = new Date().toISOString().split('T')[0]
    const { db } = await import('@/lib/db')

    const stats = await db.learningStats.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, ...body },
      update: body,
    })
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
