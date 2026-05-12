import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

function generateFallbackExercises(category: string, _level: string) {
  const exerciseTemplates: Record<string, Array<{
    type: 'fill-blank' | 'correction'
    instruction: string
    sentence: string
    answer: string
    explanation: string
    hint: string
    options?: string[]
  }>> = {
    'tenses': [
      { type: 'fill-blank', instruction: 'Fill in the blank with the correct tense.', sentence: 'She _____ (work) here since 2018.', answer: 'has been working', explanation: 'Present Perfect Continuous for actions starting in the past and continuing.', hint: 'Think about ongoing past-to-present actions.' },
      { type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'I am knowing the answer.', answer: 'I know the answer.', explanation: '"Know" is a stative verb and is not used in the continuous form.', hint: 'Some verbs cannot be used with -ing.' },
      { type: 'fill-blank', instruction: 'Fill in the correct tense.', sentence: 'By next year, I _____ (graduate) from university.', answer: 'will have graduated', explanation: 'Future Perfect for actions completed before a future point.', hint: 'Which tense expresses completion before a future time?' },
      { type: 'correction', instruction: 'Correct the error.', sentence: 'They was going to the store.', answer: 'They were going to the store.', explanation: '"They" requires plural verb "were", not singular "was".', hint: 'Check subject-verb agreement.' },
      { type: 'fill-blank', instruction: 'Fill in the correct form.', sentence: 'If I _____ (know), I would have told you.', answer: 'had known', explanation: 'Third conditional uses past perfect in the if-clause.', hint: 'Which past tense goes with "would have"?' },
    ],
    'conditionals': [
      { type: 'fill-blank', instruction: 'Complete the conditional.', sentence: 'If I _____ (know) her number, I would call her.', answer: 'knew', explanation: 'Second Conditional uses past simple in the if-clause.', hint: 'Second conditional = past simple + would', options: ['knew', 'know', 'had known', 'would know'] },
      { type: 'fill-blank', instruction: 'Complete the conditional.', sentence: 'If it rains, we _____ (stay) home.', answer: 'will stay', explanation: 'First Conditional uses will + base verb in the main clause.', hint: 'First conditional = present + will' },
      { type: 'correction', instruction: 'Correct the conditional.', sentence: 'If I would have time, I would help you.', answer: 'If I had time, I would help you.', explanation: 'Don\'t use "would" in the if-clause of a second conditional.', hint: '"Would" goes only in the main clause.' },
      { type: 'fill-blank', instruction: 'Complete the third conditional.', sentence: 'If she had studied, she _____ (pass) the exam.', answer: 'would have passed', explanation: 'Third conditional: if + past perfect, would have + past participle.', hint: 'Third conditional = had + past participle, would have + past participle' },
    ],
    default: [
      { type: 'fill-blank', instruction: 'Fill in the correct word.', sentence: 'She is very good _____ playing piano.', answer: 'at', explanation: 'The collocation is "good at" something.', hint: 'Which preposition follows "good"?', options: ['at', 'in', 'on', 'for'] },
      { type: 'correction', instruction: 'Correct the error.', sentence: 'He don\'t like coffee.', answer: "He doesn't like coffee.", explanation: 'Third person singular uses "doesn\'t", not "don\'t".', hint: 'Check third person singular agreement.' },
      { type: 'fill-blank', instruction: 'Fill in the correct article.', sentence: '_____ sun rises in the east.', answer: 'The', explanation: '"The" is used for unique objects.', hint: 'Is there more than one sun?' },
      { type: 'correction', instruction: 'Correct the mistake.', sentence: 'I am interesting in learning English.', answer: 'I am interested in learning English.', explanation: '"Interested" describes how you feel; "interesting" describes what causes the feeling.', hint: 'Think about -ed vs -ing adjectives.' },
      { type: 'fill-blank', instruction: 'Fill in the correct preposition.', sentence: 'I\'ve been waiting _____ two hours.', answer: 'for', explanation: '"For" is used with periods of time; "since" with points in time.', hint: 'Is this a duration or a starting point?', options: ['for', 'since', 'during', 'while'] },
    ],
  }

  const template = exerciseTemplates[category] || exerciseTemplates['default']
  return template.map((ex, i) => ({
    id: `${category}-${Date.now()}-${i}`,
    ...ex,
  }))
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, level } = body

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    // Try LLM for grammar exercise generation
    try {
      const systemPrompt = `You are an English grammar exercise generator for ${level || 'B2'} level learners who speak German.
Generate 5 grammar exercises about "${category}".
Return a JSON array of exercises, each with:
- id: unique string (like "${category}-1")
- type: "fill-blank" or "correction"
- instruction: string (the instruction for the exercise)
- sentence: string (use _____ for blanks in fill-blank type)
- answer: string (the correct answer)
- explanation: string (why this answer is correct, in English)
- hint: string (a helpful hint for the learner)
- options: array of strings (optional, for multiple choice)

Return ONLY valid JSON. No other text.`

      const response = await chatCompletion(systemPrompt, `Generate ${category} exercises for ${level || 'B2'} level.`)

      if (response) {
        const exercises = parseJSONResponse<Array<{
          id: string
          type: 'fill-blank' | 'correction'
          instruction: string
          sentence: string
          answer: string
          explanation: string
          hint?: string
          options?: string[]
        }>>(response)

        if (exercises && Array.isArray(exercises) && exercises.length > 0) {
          return NextResponse.json({ exercises })
        }
      }
    } catch {
      // LLM not available
    }

    // Fallback exercises
    const exercises = generateFallbackExercises(category, level || 'B2')
    return NextResponse.json({ exercises })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
