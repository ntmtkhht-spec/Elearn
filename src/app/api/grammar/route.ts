import { NextResponse } from 'next/server'


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
    'basic-sentences': [
      { type: 'fill-blank', instruction: 'Complete the sentence.', sentence: 'I _____ a student.', answer: 'am', explanation: '"I" goes with "am" in the verb "to be".', hint: 'What form of "to be" goes with "I"?', options: ['am', 'is', 'are', 'be'] },
      { type: 'fill-blank', instruction: 'Complete the sentence.', sentence: 'She _____ coffee every morning.', answer: 'drinks', explanation: 'Third person singular adds -s to the verb.', hint: 'Remember the -s for he/she/it.' },
      { type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'I has a big family.', answer: 'I have a big family.', explanation: '"I" uses "have", not "has".', hint: 'Which form of "have" goes with "I"?' },
      { type: 'fill-blank', instruction: 'Complete the sentence.', sentence: 'They _____ to school by bus.', answer: 'go', explanation: '"They" is plural, so we use the base form.', hint: 'Plural subjects use the base form of the verb.' },
    ],
    'to-be': [
      { type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'She _____ a teacher.', answer: 'is', explanation: 'We use "is" with he/she/it.', hint: 'Which form goes with "she"?', options: ['am', 'is', 'are', 'be'] },
      { type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'We _____ from Germany.', answer: 'are', explanation: 'We use "are" with we/you/they.', hint: 'Which form goes with "we"?', options: ['am', 'is', 'are', 'be'] },
      { type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'They is happy.', answer: 'They are happy.', explanation: '"They" requires "are", not "is".', hint: 'Check subject-verb agreement.' },
      { type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'I _____ hungry.', answer: 'am', explanation: '"I" always goes with "am".', hint: '"I" always pairs with one specific form.', options: ['am', 'is', 'are', 'be'] },
    ],
    'present-simple': [
      { type: 'fill-blank', instruction: 'Fill in the correct form of the verb.', sentence: 'She _____ (work) in a hospital.', answer: 'works', explanation: 'Third person singular (she) adds -s to the base verb.', hint: 'Don\'t forget the -s for he/she/it!' },
      { type: 'fill-blank', instruction: 'Fill in the correct form.', sentence: 'I _____ (not/like) spicy food.', answer: "don't like", explanation: 'For negative present simple with I/you/we/they, use "don\'t" + base verb.', hint: 'How do you make a negative sentence with "I"?' },
      { type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'He don\'t play football.', answer: "He doesn't play football.", explanation: 'Third person singular negative uses "doesn\'t".', hint: 'He/she/it use "doesn\'t", not "don\'t".' },
      { type: 'fill-blank', instruction: 'Complete the question.', sentence: '_____ you speak English?', answer: 'Do', explanation: 'Questions with I/you/we/they start with "Do".', hint: 'What auxiliary verb starts a yes/no question?' },
    ],
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

    const exercises = generateFallbackExercises(category, level || 'B2')
    return NextResponse.json({ exercises })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
