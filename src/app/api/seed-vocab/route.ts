import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { EXTRA_DECKS_A1_A2 } from '@/lib/data/vocab-a1-a2'
import { EXTRA_DECKS_B1_B2 } from '@/lib/data/vocab-b1-b2'
import { EXTRA_DECKS_C1_C2 } from '@/lib/data/vocab-c1-c2'

export async function GET() {
  try {
    const allDecks = [
      ...EXTRA_DECKS_A1_A2,
      ...EXTRA_DECKS_B1_B2,
      ...EXTRA_DECKS_C1_C2
    ]

    let addedDecks = 0

    for (const { cards, ...deckData } of allDecks) {
      // Check if this deck already exists globally
      const existing = await db.vocabDeck.findFirst({
        where: {
          name: deckData.name,
          level: deckData.level,
          userId: null
        }
      })

      if (!existing) {
        await db.vocabDeck.create({
          data: {
            ...deckData,
            userId: null,
            cards: {
              create: cards
            }
          }
        })
        addedDecks++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${addedDecks} new vocabulary decks.`,
      totalAttempted: allDecks.length
    })

  } catch (error: any) {
    console.error('Error seeding vocabulary:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
