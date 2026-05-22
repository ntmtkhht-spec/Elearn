import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readingA1A2 } from '@/lib/data/reading-a1-a2'
import { readingB1B2 } from '@/lib/data/reading-b1-b2'
import { readingC1C2 } from '@/lib/data/reading-c1-c2'

export async function POST() {
  try {
    const allReadings = [...readingA1A2, ...readingB1B2, ...readingC1C2]

    // Create the readings in the database
    let count = 0
    for (const item of allReadings) {
      await db.readingExercise.create({
        data: {
          title: item.title,
          content: item.content,
          level: item.level,
          category: item.category,
          questions: item.questions,
          vocabularyHints: item.vocabularyHints
        }
      })
      count++
    }

    return NextResponse.json({ success: true, count, message: `Successfully seeded ${count} reading exercises.` })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed reading exercises' }, { status: 500 })
  }
}
