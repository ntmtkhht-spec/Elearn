import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const { db } = await import('@/lib/db')

    // Seed vocabulary decks
    const decks = await db.vocabDeck.findMany()
    if (decks.length === 0) {
      await db.vocabDeck.createMany({
        data: [
          { name: 'First Words', description: 'Essential beginner words for everyday communication', level: 'A1', category: 'Basics', icon: '🌱' },
          { name: 'Greetings & Introductions', description: 'Learn to greet, introduce yourself, and say goodbye', level: 'A1', category: 'Daily', icon: '👋' },
          { name: 'Daily Routines', description: 'Words and phrases for talking about your day', level: 'A2', category: 'Daily', icon: '🌞' },
          { name: 'Shopping & Food', description: 'Vocabulary for restaurants, shops, and groceries', level: 'A2', category: 'Food', icon: '🛒' },
          { name: 'Business English', description: 'Essential vocabulary for professional environments', level: 'B2', category: 'Business', icon: '💼' },
          { name: 'Travel & Tourism', description: 'Words and phrases for traveling abroad', level: 'B1', category: 'Travel', icon: '✈️' },
          { name: 'Idioms & Phrasals', description: 'Common idiomatic expressions and phrasal verbs', level: 'C1', category: 'Idioms', icon: '🧠' },
          { name: 'Academic English', description: 'Formal vocabulary for academic writing', level: 'C1', category: 'Academic', icon: '🎓' },
        ],
      })

      // Add some cards to the first deck
      const businessDeck = await db.vocabDeck.findFirst({ where: { name: 'Business English' } })
      if (businessDeck) {
        await db.vocabCard.createMany({
          data: [
            { deckId: businessDeck.id, word: 'Leverage', translation: 'Hebelwirkung / nutzen', pronunciation: '/ˈlevərɪdʒ/', partOfSpeech: 'verb', exampleSentence: 'We should leverage our existing network.', exampleTranslation: 'Wir sollten unser bestehendes Netzwerk nutzen.', difficulty: 2 },
            { deckId: businessDeck.id, word: 'Stakeholder', translation: 'Interessent / Beteiligter', pronunciation: '/ˈsteɪkhoʊldər/', partOfSpeech: 'noun', exampleSentence: 'All stakeholders need to be informed.', exampleTranslation: 'Alle Beteiligten müssen informiert werden.', difficulty: 2 },
            { deckId: businessDeck.id, word: 'Synergy', translation: 'Synergie', pronunciation: '/ˈsɪnərdʒi/', partOfSpeech: 'noun', exampleSentence: 'The merger will create synergy.', exampleTranslation: 'Die Fusion wird Synergie schaffen.', difficulty: 3 },
            { deckId: businessDeck.id, word: 'Scalable', translation: 'Skalierbar', pronunciation: '/ˈskeɪləbl/', partOfSpeech: 'adjective', exampleSentence: 'Our solution is scalable.', exampleTranslation: 'Unsere Lösung ist skalierbar.', difficulty: 2 },
            { deckId: businessDeck.id, word: 'Benchmark', translation: 'Maßstab', pronunciation: '/ˈbentʃmɑːrk/', partOfSpeech: 'noun', exampleSentence: 'This sets a new benchmark.', exampleTranslation: 'Das setzt einen neuen Maßstab.', difficulty: 3 },
          ],
        })
      }
    }

    // Seed reading exercises
    const exercises = await db.readingExercise.findMany()
    if (exercises.length === 0) {
      await db.readingExercise.create({
        data: {
          title: 'The Future of Remote Work',
          content: 'The landscape of work has undergone a dramatic transformation in recent years. What was once considered a rare perk—working from home—has become the norm for millions of professionals worldwide.\n\nThe COVID-19 pandemic served as an unprecedented catalyst, forcing organizations to adopt remote work practices virtually overnight.\n\nHowever, this shift has not been without its challenges. Many companies have struggled to maintain their corporate culture in a distributed environment. The hybrid model, which combines remote and in-office work, appears to be the compromise that most organizations are embracing.',
          level: 'B2',
          category: 'Business',
          questions: JSON.stringify([
            { id: 'q1', question: 'What was the main catalyst for remote work adoption?', options: ['Technology', 'COVID-19 pandemic', 'Employee demands', 'Cost reduction'], correctIndex: 1, explanation: 'The text states COVID-19 was the catalyst.' },
            { id: 'q2', question: 'What is the hybrid model?', options: ['Remote only', 'Office only', 'Combination of remote and office', 'Part-time work'], correctIndex: 2, explanation: 'It combines remote and in-office work.' },
          ]),
          vocabularyHints: JSON.stringify([
            { word: 'catalyst', meaning: 'Katalysator' },
            { word: 'unprecedented', meaning: 'Beispiellos' },
            { word: 'embracing', meaning: 'Annehmen' },
          ]),
        },
      })
    }

    // Seed video assignments
    const videos = await db.videoAssignment.findMany()
    if (videos.length === 0) {
      await db.videoAssignment.createMany({
        data: [
          { title: 'The Power of Vulnerability — Brené Brown', youtubeUrl: 'https://www.youtube.com/watch?v=iCvmsMzlF7o', youtubeId: 'iCvmsMzlF7o', description: 'A powerful TED Talk about vulnerability.', level: 'B2', prompts: JSON.stringify(['What is the main argument?', 'How does she distinguish shame and vulnerability?']) },
          { title: 'Inside the Mind of a Master Procrastinator', youtubeUrl: 'https://www.youtube.com/watch?v=arj7oStGLkU', youtubeId: 'arj7oStGLkU', description: 'Tim Urban on procrastination.', level: 'B1', prompts: JSON.stringify(['What is the "Instant Gratification Monkey"?', 'How does the "Panic Monster" help?']) },
        ],
      })
    }

    // Seed learning stats
    const today = new Date().toISOString().split('T')[0]
    const existingStats = await db.learningStats.findUnique({ where: { date: today } })
    if (!existingStats) {
      await db.learningStats.create({
        data: {
          date: today,
          vocabStudied: 24,
          readingDone: 3,
          videosWatched: 1,
          conversationMins: 15,
          streak: 7,
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Failed to seed database', details: String(error) }, { status: 500 })
  }
}
