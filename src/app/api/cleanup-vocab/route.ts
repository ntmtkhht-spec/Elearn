import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const allDecks = await db.vocabDeck.findMany({
      include: { cards: true }
    })

    const seen = new Set<string>()
    const toDelete: string[] = []

    for (const deck of allDecks) {
      if (seen.has(deck.name)) {
        toDelete.push(deck.id)
      } else {
        seen.add(deck.name)
      }
    }

    if (toDelete.length > 0) {
      await db.vocabCard.deleteMany({
        where: { deckId: { in: toDelete } }
      })
      await db.vocabDeck.deleteMany({
        where: { id: { in: toDelete } }
      })
    }
    
    return NextResponse.json({ success: true, deletedDecks: toDelete.length, totalRemaining: seen.size })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
