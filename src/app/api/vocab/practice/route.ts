import { NextResponse } from 'next/server'

const SAMPLE_CARDS = [
  { id: 'c1', deckId: '1', word: 'Leverage', translation: 'Hebelwirkung / nutzen', pronunciation: '/ˈlevərɪdʒ/', partOfSpeech: 'verb', exampleSentence: 'We should leverage our existing network to grow the business.', exampleTranslation: 'Wir sollten unser bestehendes Netzwerk nutzen, um das Geschäft zu vergrößern.', difficulty: 2, notes: null },
  { id: 'c2', deckId: '1', word: 'Stakeholder', translation: 'Interessent / Beteiligter', pronunciation: '/ˈsteɪkhoʊldər/', partOfSpeech: 'noun', exampleSentence: 'All stakeholders need to be informed about the changes.', exampleTranslation: 'Alle Beteiligten müssen über die Änderungen informiert werden.', difficulty: 2, notes: null },
  { id: 'c3', deckId: '1', word: 'Synergy', translation: 'Synergie', pronunciation: '/ˈsɪnərdʒi/', partOfSpeech: 'noun', exampleSentence: 'The merger will create synergy between the two companies.', exampleTranslation: 'Die Fusion wird Synergie zwischen den beiden Unternehmen schaffen.', difficulty: 3, notes: null },
  { id: 'c4', deckId: '1', word: 'Scalable', translation: 'Skalierbar', pronunciation: '/ˈskeɪləbl/', partOfSpeech: 'adjective', exampleSentence: 'Our solution is scalable to meet growing demand.', exampleTranslation: 'Unsere Lösung ist skalierbar, um der wachsenden Nachfrage gerecht zu werden.', difficulty: 2, notes: null },
  { id: 'c5', deckId: '1', word: 'Benchmark', translation: 'Maßstab / Benchmark', pronunciation: '/ˈbentʃmɑːrk/', partOfSpeech: 'noun', exampleSentence: 'This report sets a new benchmark for the industry.', exampleTranslation: 'Dieser Bericht setzt einen neuen Maßstab für die Branche.', difficulty: 3, notes: null },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const deckId = searchParams.get('deckId')

  try {
    const { db } = await import('@/lib/db')
    const cards = await db.vocabCard.findMany({
      where: deckId ? { deckId } : undefined,
      include: { progress: true },
      take: 20,
    })
    if (cards.length > 0) {
      return NextResponse.json(cards)
    }
  } catch {
    // DB not ready
  }

  return NextResponse.json(SAMPLE_CARDS)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cardId, rating } = body

    // Calculate next review based on SM-2 algorithm
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
      // Try to update progress
      const existing = await db.vocabProgress.findFirst({ where: { cardId } })
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
    } catch {
      // DB not ready
    }

    return NextResponse.json({ success: true, nextReview: nextReview.toISOString(), interval })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
