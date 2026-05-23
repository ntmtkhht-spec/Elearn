import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  return handleSync(request)
}

export async function GET(request) {
  return handleSync(request)
}

async function handleSync(request) {
  try {
    // In a real app, you would check for an admin API key here
    // const authHeader = request.headers.get('authorization')
    // if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Read the aggregated content file
    const contentPath = path.join(process.cwd(), 'src', 'lib', 'data', 'generated-content.json')
    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ error: 'Content file not found' }, { status: 404 })
    }

    const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
    const { vocabDecks = [], readingExercises = [] } = content

    let syncedDecks = 0
    let syncedCards = 0
    let syncedExercises = 0

    // 1. Sync Vocab Decks
    for (const deck of vocabDecks) {
      if (!deck.id) continue
      
      const { cards, ...deckData } = deck

      await db.vocabDeck.upsert({
        where: { id: deck.id },
        update: {
          name: deckData.name,
          description: deckData.description,
          level: deckData.level,
          category: deckData.category,
          icon: deckData.icon
        },
        create: {
          id: deck.id,
          name: deckData.name,
          description: deckData.description,
          level: deckData.level,
          category: deckData.category,
          icon: deckData.icon
        }
      })
      syncedDecks++

      // Sync Cards for this deck
      if (cards && Array.isArray(cards)) {
        for (const card of cards) {
          if (!card.id) continue
          
          await db.vocabCard.upsert({
            where: { id: card.id },
            update: {
              word: card.word,
              translation: card.translation,
              pronunciation: card.pronunciation,
              partOfSpeech: card.partOfSpeech,
              exampleSentence: card.exampleSentence,
              exampleTranslation: card.exampleTranslation,
              difficulty: card.difficulty,
              notes: card.notes
            },
            create: {
              id: card.id,
              deckId: deck.id,
              word: card.word,
              translation: card.translation,
              pronunciation: card.pronunciation,
              partOfSpeech: card.partOfSpeech,
              exampleSentence: card.exampleSentence,
              exampleTranslation: card.exampleTranslation,
              difficulty: card.difficulty,
              notes: card.notes
            }
          })
          syncedCards++
        }
      }
    }

    // 2. Sync Reading Exercises
    for (const exercise of readingExercises) {
      if (!exercise.id) continue

      await db.readingExercise.upsert({
        where: { id: exercise.id },
        update: {
          title: exercise.title,
          content: exercise.content,
          level: exercise.level,
          category: exercise.category,
          questions: typeof exercise.questions === 'string' ? exercise.questions : JSON.stringify(exercise.questions),
          vocabularyHints: typeof exercise.vocabularyHints === 'string' ? exercise.vocabularyHints : JSON.stringify(exercise.vocabularyHints || [])
        },
        create: {
          id: exercise.id,
          title: exercise.title,
          content: exercise.content,
          level: exercise.level,
          category: exercise.category,
          questions: typeof exercise.questions === 'string' ? exercise.questions : JSON.stringify(exercise.questions),
          vocabularyHints: typeof exercise.vocabularyHints === 'string' ? exercise.vocabularyHints : JSON.stringify(exercise.vocabularyHints || [])
        }
      })
      syncedExercises++
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Content synced successfully',
      stats: {
        decks: syncedDecks,
        cards: syncedCards,
        exercises: syncedExercises
      }
    })
  } catch (error) {
    console.error('Sync Error:', error)
    return NextResponse.json({ error: 'Failed to sync content', details: error.message }, { status: 500 })
  }
}
