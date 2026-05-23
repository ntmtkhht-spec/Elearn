import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

export const dynamic = 'force-dynamic'

const SAMPLE_EXERCISES = [
  {
    id: 'r1',
    title: 'The Future of Remote Work',
    content: 'The landscape of work has undergone a dramatic transformation in recent years. What was once considered a rare perk—working from home—has become the norm for millions of professionals worldwide.\n\nThe COVID-19 pandemic served as an unprecedented catalyst, forcing organizations to adopt remote work practices virtually overnight.\n\nHowever, this shift has not been without its challenges. Many companies have struggled to maintain their corporate culture in a distributed environment. The spontaneous water-cooler conversations that once sparked innovation have been replaced by scheduled video calls, often leading to "Zoom fatigue."\n\nThe hybrid model, which combines remote and in-office work, appears to be the compromise that most organizations are embracing.',
    level: 'B2',
    category: 'Business',
    questions: JSON.stringify([
      { id: 'q1', question: 'According to the text, what was the main catalyst for the adoption of remote work?', options: ['Technological advances', 'The COVID-19 pandemic', 'Employee demands', 'Cost reduction'], correctIndex: 1, explanation: 'The text explicitly states: "The COVID-19 pandemic served as an unprecedented catalyst."' },
      { id: 'q2', question: 'What does "Zoom fatigue" refer to?', options: ['Physical exhaustion', 'Tiredness from excessive video calls', 'Boredom from slow internet', 'Frustration with technology'], correctIndex: 1, explanation: 'It refers to exhaustion from too many scheduled video calls.' },
    ]),
    vocabularyHints: JSON.stringify([
      { word: 'catalyst', meaning: 'Katalysator - etwas, das eine Veränderung beschleunigt' },
      { word: 'unprecedented', meaning: 'Beispiellos - nie zuvor dagewesen' },
      { word: 'embracing', meaning: 'Annehmen - etwas akzeptieren und nutzen' },
    ]),
  },
]

export async function GET() {
  try {
    const { db } = await import('@/lib/db')
    const exercises = await db.readingExercise.findMany({ orderBy: { createdAt: 'desc' } })
    if (exercises.length > 0) {
      const parsed = exercises.map(e => ({
        ...e,
        questions: JSON.parse(e.questions),
        vocabularyHints: e.vocabularyHints ? JSON.parse(e.vocabularyHints) : undefined,
      }))
      return NextResponse.json(parsed)
    }
  } catch {
    // DB not ready
  }

  const parsed = SAMPLE_EXERCISES.map(e => ({
    ...e,
    questions: JSON.parse(e.questions),
    vocabularyHints: e.vocabularyHints ? JSON.parse(e.vocabularyHints) : undefined,
  }))
  return NextResponse.json(parsed)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { topic, level } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const exerciseLevel = level || 'B2'

    // Try to generate with AI
    try {
      const systemPrompt = `You are an English reading comprehension exercise creator for German-speaking learners at ${exerciseLevel} level.
Create a reading exercise about "${topic}" with:
1. A title (string)
2. A 200-400 word English text about the topic, appropriate for ${exerciseLevel} level (string)
3. 4-5 comprehension questions with 4 options each (JSON array)
4. 5-8 vocabulary hints for difficult words in the text (JSON array)

Each question should have:
- id: unique string
- question: string
- options: array of 4 strings
- correctIndex: number (0-3)
- explanation: string

Each vocabulary hint should have:
- word: string (the English word)
- meaning: string (German explanation)

Return ONLY valid JSON in this format:
{
  "title": "...",
  "content": "...",
  "questions": [...],
  "vocabularyHints": [...]
}`

      const response = await chatCompletion(systemPrompt, `Create a reading exercise about "${topic}" for ${exerciseLevel} level.`)

      if (response) {
        const parsed = parseJSONResponse<{
          title: string
          content: string
          questions: Array<{
            id: string
            question: string
            options: string[]
            correctIndex: number
            explanation: string
          }>
          vocabularyHints: Array<{
            word: string
            meaning: string
          }>
        }>(response)

        if (parsed && parsed.content && parsed.questions) {
          const newExercise = {
            id: `r-${Date.now()}`,
            title: parsed.title,
            content: parsed.content,
            level: exerciseLevel,
            category: 'Custom',
            questions: parsed.questions.map((q, i) => ({
              ...q,
              id: q.id || `q-${Date.now()}-${i}`,
            })),
            vocabularyHints: parsed.vocabularyHints || [],
          }

          // Save to DB
          try {
            const { db } = await import('@/lib/db')
            await db.readingExercise.create({
              data: {
                title: newExercise.title,
                content: newExercise.content,
                level: newExercise.level,
                category: newExercise.category,
                questions: JSON.stringify(newExercise.questions),
                vocabularyHints: JSON.stringify(newExercise.vocabularyHints),
              },
            })
          } catch {
            // DB not ready
          }

          return NextResponse.json(newExercise)
        }
      }
    } catch {
      // AI not available
    }

    // Fallback exercise
    const newExercise = {
      id: `r-${Date.now()}`,
      title: `${topic} — Reading Exercise`,
      content: `This is a reading exercise about ${topic}. The content would typically be generated by AI based on the topic and level provided. For intermediate learners at ${exerciseLevel} level, the text would include appropriate vocabulary and sentence structures to challenge comprehension while remaining accessible.\n\nKey concepts related to ${topic} would be explored in depth, providing learners with both language practice and subject matter knowledge. The text would include a variety of sentence structures, from simple to complex, to test different aspects of reading comprehension.\n\nAfter reading, learners would answer questions that test their understanding of main ideas, details, inferences, and vocabulary in context.`,
      level: exerciseLevel,
      category: 'Custom',
      questions: [
        { id: `q-${Date.now()}-1`, question: `What is the main topic of this text?`, options: [topic, 'Another topic', 'Unrelated subject', 'Not specified'], correctIndex: 0, explanation: `The text is primarily about ${topic}.` },
        { id: `q-${Date.now()}-2`, question: `What level is this exercise designed for?`, options: ['A1', 'A2', exerciseLevel, 'C2'], correctIndex: 2, explanation: `The exercise is designed for ${exerciseLevel} level learners.` },
      ],
      vocabularyHints: [
        { word: 'comprehension', meaning: 'Verständnis - die Fähigkeit zu verstehen' },
        { word: 'accessible', meaning: 'Zugänglich - leicht zu verstehen oder zu erreichen' },
      ],
    }

    try {
      const { db } = await import('@/lib/db')
      await db.readingExercise.create({
        data: {
          title: newExercise.title,
          content: newExercise.content,
          level: newExercise.level,
          category: newExercise.category,
          questions: JSON.stringify(newExercise.questions),
          vocabularyHints: JSON.stringify(newExercise.vocabularyHints),
        },
      })
    } catch {
      // DB not ready
    }

    return NextResponse.json(newExercise)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
