import { NextResponse } from 'next/server'


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

