'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PenTool, Sparkles, RotateCcw, ArrowLeft,
  CheckCircle2, XCircle, Lightbulb, Trophy, ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const CATEGORIES = [
  { id: 'basic-sentences', name: 'Basic Sentences', icon: '📝', description: 'Simple subject-verb-object' },
  { id: 'to-be', name: 'Verb "to be"', icon: '✨', description: 'Am, is, are — the basics' },
  { id: 'present-simple', name: 'Present Simple', icon: '📅', description: 'Daily routines and habits' },
  { id: 'tenses', name: 'Tenses', icon: '⏰', description: 'Present, Past, Future tenses' },
  { id: 'conditionals', name: 'Conditionals', icon: '🔀', description: 'If-clauses and conditional sentences' },
  { id: 'prepositions', name: 'Prepositions', icon: '📍', description: 'In, on, at, by, with, etc.' },
  { id: 'articles', name: 'Articles', icon: '📰', description: 'A, an, the — when to use them' },
  { id: 'relative-clauses', name: 'Relative Clauses', icon: '🔗', description: 'Who, which, that, whose' },
  { id: 'passive-voice', name: 'Passive Voice', icon: '🔄', description: 'Active vs. passive constructions' },
  { id: 'reported-speech', name: 'Reported Speech', icon: '💬', description: 'Indirect speech and backshifting' },
  { id: 'modal-verbs', name: 'Modal Verbs', icon: '💪', description: 'Can, could, should, must, might' },
]

interface GrammarExercise {
  id: string
  type: 'fill-blank' | 'correction'
  instruction: string
  sentence: string
  answer: string
  explanation: string
  hint?: string
  options?: string[]
}

const SAMPLE_EXERCISES: Record<string, GrammarExercise[]> = {
  'basic-sentences': [
    { id: 'bs1', type: 'fill-blank', instruction: 'Complete the sentence with the correct word.', sentence: 'I _____ a student.', answer: 'am', explanation: '"I" goes with "am". This is the basic subject-verb pattern.', hint: 'What form of "to be" goes with "I"?', options: ['am', 'is', 'are', 'be'] },
    { id: 'bs2', type: 'fill-blank', instruction: 'Complete the sentence.', sentence: 'She _____ coffee every morning.', answer: 'drinks', explanation: 'With "she" (third person singular), we add -s to the verb in Present Simple.', hint: 'Third person singular needs an -s ending.' },
    { id: 'bs3', type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'I has a big family.', answer: 'I have a big family.', explanation: '"I" uses "have", not "has". "Has" is for third person (he/she/it).', hint: 'Which form of "have" goes with "I"?' },
    { id: 'bs4', type: 'fill-blank', instruction: 'Complete the sentence.', sentence: 'They _____ to school by bus.', answer: 'go', explanation: '"They" is plural, so we use the base form "go" without -s.', hint: 'Plural subjects use the base form of the verb.' },
  ],
  'to-be': [
    { id: 'tb1', type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'She _____ a teacher.', answer: 'is', explanation: 'We use "is" with he/she/it (third person singular).', hint: 'Which form of "to be" goes with "she"?', options: ['am', 'is', 'are', 'be'] },
    { id: 'tb2', type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'We _____ from Germany.', answer: 'are', explanation: 'We use "are" with we/you/they.', hint: 'Which form goes with "we"?', options: ['am', 'is', 'are', 'be'] },
    { id: 'tb3', type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'They is happy.', answer: 'They are happy.', explanation: '"They" requires "are", not "is".', hint: 'Check subject-verb agreement.' },
    { id: 'tb4', type: 'fill-blank', instruction: 'Fill in the correct form of "to be".', sentence: 'I _____ hungry.', answer: 'am', explanation: '"I" always goes with "am".', hint: '"I" always pairs with one specific form.', options: ['am', 'is', 'are', 'be'] },
  ],
  'present-simple': [
    { id: 'ps1', type: 'fill-blank', instruction: 'Fill in the correct form of the verb.', sentence: 'She _____ (work) in a hospital.', answer: 'works', explanation: 'Third person singular (she) adds -s to the base verb in Present Simple.', hint: 'Don\'t forget the -s for he/she/it!' },
    { id: 'ps2', type: 'fill-blank', instruction: 'Fill in the correct form.', sentence: 'I _____ (not/like) spicy food.', answer: "don't like", explanation: 'For negative present simple with I/you/we/they, use "don\'t" + base verb.', hint: 'How do you make a negative sentence with "I"?' },
    { id: 'ps3', type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'He don\'t play football.', answer: "He doesn't play football.", explanation: 'Third person singular negative uses "doesn\'t" + base verb, not "don\'t".', hint: 'He/she/it use "doesn\'t", not "don\'t".' },
    { id: 'ps4', type: 'fill-blank', instruction: 'Complete the question.', sentence: '_____ you speak English?', answer: 'Do', explanation: 'Questions with I/you/we/they start with "Do" + base verb.', hint: 'What auxiliary verb starts a yes/no question?' },
  ],
  'tenses': [
    { id: 't1', type: 'fill-blank', instruction: 'Fill in the blank with the correct form of the verb in parentheses.', sentence: 'She _____ (work) at this company since 2018.', answer: 'has been working', explanation: 'We use the Present Perfect Continuous (has been + -ing) for actions that started in the past and continue to the present. "Since 2018" indicates an ongoing action.', hint: 'Think about which tense expresses an action that started in the past and continues now.' },
    { id: 't2', type: 'fill-blank', instruction: 'Fill in the blank with the correct form of the verb.', sentence: 'By the time we arrived, the movie _____ already _____ (start).', answer: 'had already started', explanation: 'The Past Perfect (had + past participle) is used for an action completed before another past action. "Arrived" is in simple past, so the earlier action needs past perfect.', hint: 'Which tense shows that something happened before another past event?' },
    { id: 't3', type: 'correction', instruction: 'Find and correct the grammar mistake in this sentence.', sentence: 'I am knowing the answer to this question.', answer: 'I know the answer to this question.', explanation: '"Know" is a stative verb and is not normally used in the continuous form. We say "I know" not "I am knowing".', hint: 'Some verbs are not typically used in the -ing form.' },
    { id: 't4', type: 'fill-blank', instruction: 'Fill in the blank with the correct form of the verb.', sentence: 'Next year, I _____ (study) abroad for the first time.', answer: 'will be studying', explanation: 'The Future Continuous (will be + -ing) describes an action that will be in progress at a specific time in the future. However, "will study" is also acceptable here.', hint: 'Which future tense describes an ongoing action?' },
    { id: 't5', type: 'correction', instruction: 'Find and correct the grammar mistake.', sentence: 'They was going to the store when it started raining.', answer: 'They were going to the store when it started raining.', explanation: '"They" requires the plural form "were", not "was". The past continuous "were going" correctly describes an ongoing action in the past.', hint: 'Check subject-verb agreement with plural subjects.' },
  ],
  'conditionals': [
    { id: 'c1', type: 'fill-blank', instruction: 'Complete the conditional sentence.', sentence: 'If I _____ (know) her number, I would call her.', answer: 'knew', explanation: 'This is a Second Conditional sentence (unreal/hypothetical present). We use past simple in the if-clause and would + base verb in the main clause.', hint: 'Second conditional uses past simple in the if-clause.' },
    { id: 'c2', type: 'fill-blank', instruction: 'Complete the conditional sentence.', sentence: 'If it rains tomorrow, we _____ (stay) at home.', answer: 'will stay', explanation: 'This is a First Conditional (real/possible future). We use present simple in the if-clause and will + base verb in the main clause.', hint: 'First conditional uses "will" in the main clause for real possibilities.' },
    { id: 'c3', type: 'correction', instruction: 'Find and correct the mistake in this conditional sentence.', sentence: 'If I would have more time, I would learn another language.', answer: 'If I had more time, I would learn another language.', explanation: 'In the if-clause of a Second Conditional, we use past simple, not "would + verb". "Would" appears only in the main clause.', hint: '"Would" should not appear in the if-clause.' },
    { id: 'c4', type: 'fill-blank', instruction: 'Complete the third conditional sentence.', sentence: 'If she had studied harder, she _____ (pass) the exam.', answer: 'would have passed', explanation: 'Third Conditional (unreal past): if + past perfect, would have + past participle. This talks about a hypothetical past result.', hint: 'Third conditional uses "would have + past participle" in the main clause.' },
  ],
  'prepositions': [
    { id: 'p1', type: 'fill-blank', instruction: 'Fill in the correct preposition.', sentence: 'I\'ve been waiting _____ the bus for 20 minutes.', answer: 'for', explanation: 'We use "for" with a period of time (20 minutes) and "since" with a specific point in time (since 3 PM).', hint: 'Think about whether you need a preposition for duration or a point in time.', options: ['for', 'since', 'during', 'while'] },
    { id: 'p2', type: 'fill-blank', instruction: 'Fill in the correct preposition.', sentence: 'She\'s really good _____ playing the piano.', answer: 'at', explanation: 'The adjective "good" is followed by the preposition "at" when describing a skill or ability.', hint: 'The collocation is "good at" something.', options: ['in', 'on', 'at', 'for'] },
    { id: 'p3', type: 'correction', instruction: 'Find and correct the preposition error.', sentence: 'I\'m interested on learning new languages.', answer: 'I\'m interested in learning new languages.', explanation: 'The adjective "interested" is followed by the preposition "in", not "on". The correct collocation is "interested in".', hint: 'The collocation is "interested in" something.' },
    { id: 'p4', type: 'fill-blank', instruction: 'Fill in the correct preposition.', sentence: 'The meeting depends _____ whether the boss is available.', answer: 'on', explanation: '"Depend" is always followed by the preposition "on" (or "upon" in formal contexts). The correct form is "depends on".', hint: 'The verb "depend" takes a specific preposition.', options: ['on', 'of', 'from', 'with'] },
  ],
  'articles': [
    { id: 'a1', type: 'fill-blank', instruction: 'Fill in the correct article (a, an, the, or — for no article).', sentence: '_____ sun rises in the east.', answer: 'The', explanation: 'We use "the" when referring to something unique or specific. There is only one sun, so we use "the sun".', hint: 'Is there more than one sun?' },
    { id: 'a2', type: 'correction', instruction: 'Find and correct the article mistake.', sentence: 'She is a engineer at a tech company.', answer: 'She is an engineer at a tech company.', explanation: 'We use "an" before words that start with a vowel sound. "Engineer" starts with a vowel sound /e/, so we use "an", not "a".', hint: 'Listen to the sound, not the letter.' },
    { id: 'a3', type: 'fill-blank', instruction: 'Fill in the correct article or leave blank for no article.', sentence: 'I love listening to _____ music in the evening.', answer: '', explanation: 'We use no article with uncountable nouns when speaking about them in general. "Music" in general doesn\'t need an article.', hint: 'Is this referring to music in general or specific music?' },
    { id: 'a4', type: 'fill-blank', instruction: 'Fill in the correct article.', sentence: 'Could you pass me _____ salt, please?', answer: 'the', explanation: 'We use "the" when both the speaker and listener know which specific thing is being referred to. In this context, it\'s the salt on the table.', hint: 'Is this a specific salt that both people know about?' },
  ],
  'relative-clauses': [
    { id: 'rc1', type: 'fill-blank', instruction: 'Fill in the correct relative pronoun.', sentence: 'The woman _____ lives next door is a doctor.', answer: 'who', explanation: 'We use "who" for people as the subject of a relative clause.', hint: 'Which relative pronoun do we use for people?', options: ['who', 'which', 'that', 'whose'] },
    { id: 'rc2', type: 'fill-blank', instruction: 'Fill in the correct relative pronoun.', sentence: 'The book _____ I borrowed from the library was fascinating.', answer: 'which', explanation: 'We use "which" for things as the object of a relative clause. "That" would also be acceptable here.', hint: 'Which relative pronoun is used for things?', options: ['who', 'which', 'whose', 'whom'] },
    { id: 'rc3', type: 'correction', instruction: 'Find and correct the mistake.', sentence: 'The man which car was stolen called the police.', answer: 'The man whose car was stolen called the police.', explanation: '"Whose" shows possession (the car belongs to the man). "Which" is used for things, not for possession.', hint: 'Which relative pronoun shows possession?' },
  ],
  'passive-voice': [
    { id: 'pv1', type: 'fill-blank', instruction: 'Convert to passive voice.', sentence: 'They _____ (build) this bridge in 1890.', answer: 'built', explanation: 'Wait — in passive voice: "This bridge was built in 1890." The passive uses "was built" because it happened in the past and the subject is singular.', hint: 'Use the correct form of "to be" + past participle.' },
    { id: 'pv2', type: 'correction', instruction: 'Correct the passive voice error.', sentence: 'The cake was bake by my grandmother.', answer: 'The cake was baked by my grandmother.', explanation: 'In passive voice, we need the past participle form after "was". The past participle of "bake" is "baked", not "bake".', hint: 'Check the form of the main verb after "was".' },
    { id: 'pv3', type: 'fill-blank', instruction: 'Complete the passive sentence.', sentence: 'The new hospital _____ (open) next year by the mayor.', answer: 'will be opened', explanation: 'Future passive: will be + past participle. "Will be opened" is correct for a future event in passive voice.', hint: 'What is the future passive form?' },
  ],
  'reported-speech': [
    { id: 'rs1', type: 'correction', instruction: 'Correct the reported speech.', sentence: 'She said that she will come tomorrow.', answer: 'She said that she would come the next day.', explanation: 'When reporting speech, we typically backshift tenses. "Will" becomes "would" and "tomorrow" becomes "the next day" or "the following day".', hint: 'Remember to backshift tenses in reported speech.' },
    { id: 'rs2', type: 'fill-blank', instruction: 'Complete the reported speech.', sentence: 'He asked me where I _____. (live)', answer: 'lived', explanation: 'In reported questions, we backshift the tense. Present simple "do you live" becomes past simple "I lived".', hint: 'Backshift the tense by one step.' },
  ],
  'modal-verbs': [
    { id: 'mv1', type: 'fill-blank', instruction: 'Choose the correct modal verb.', sentence: 'You _____ smoke in a hospital. It\'s strictly prohibited.', answer: 'mustn\'t', explanation: '"Mustn\'t" expresses prohibition — something that is not allowed. "Shouldn\'t" would be advice, but prohibition requires "mustn\'t".', hint: 'Which modal verb expresses strong prohibition?', options: ['mustn\'t', 'shouldn\'t', 'couldn\'t', 'needn\'t'] },
    { id: 'mv2', type: 'fill-blank', instruction: 'Choose the correct modal verb.', sentence: 'She _____ be at home — I just saw her car in the driveway.', answer: 'must', explanation: '"Must" in this context expresses a logical deduction. If her car is there, we logically conclude she is at home.', hint: 'Which modal expresses strong logical deduction?', options: ['must', 'should', 'could', 'might'] },
    { id: 'mv3', type: 'correction', instruction: 'Correct the modal verb usage.', sentence: 'You must to see this movie — it\'s amazing!', answer: 'You must see this movie — it\'s amazing!', explanation: 'Modal verbs are followed by the base form of the verb without "to". We say "must see", not "must to see".', hint: 'Modal verbs take the bare infinitive.' },
  ],
}

type GrammarViewMode = 'categories' | 'exercise' | 'results'

export default function GrammarSection() {
  const [viewMode, setViewMode] = useState<GrammarViewMode>('categories')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [exercises, setExercises] = useState<GrammarExercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId)
    setGenerating(true)

    try {
      const res = await fetch('/api/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryId, level: 'B2' }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.exercises && data.exercises.length > 0) {
          setExercises(data.exercises)
        } else {
          setExercises(SAMPLE_EXERCISES[categoryId] || SAMPLE_EXERCISES['tenses'])
        }
      } else {
        setExercises(SAMPLE_EXERCISES[categoryId] || SAMPLE_EXERCISES['tenses'])
      }
    } catch {
      setExercises(SAMPLE_EXERCISES[categoryId] || SAMPLE_EXERCISES['tenses'])
    }

    setCurrentExerciseIndex(0)
    setUserAnswer('')
    setShowResult(false)
    setShowExplanation(false)
    setScore(0)
    setGenerating(false)
    setViewMode('exercise')
  }

  const checkAnswer = async () => {
    const currentExercise = exercises[currentExerciseIndex]
    if (!currentExercise) return

    const answerToCheck = selectedOption || userAnswer
    const correct = answerToCheck.toLowerCase().trim() === currentExercise.answer.toLowerCase().trim()
    setIsCorrect(correct)
    if (correct) setScore(prev => prev + 1)
    setShowResult(true)

    try {
      await fetch('/api/grammar/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: currentExercise.id, answer: answerToCheck }),
      })
    } catch {
      // Continue
    }
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
      setUserAnswer('')
      setShowResult(false)
      setShowExplanation(false)
      setSelectedOption(null)
    } else {
      setViewMode('results')
    }
  }

  // CATEGORIES VIEW
  if (viewMode === 'categories') {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <PenTool className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Grammar Exercises
          </h2>
          <p className="text-muted-foreground mt-1">Practice and master English grammar rules</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group h-full"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-5 flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-2 group-hover:text-emerald-500 transition-colors" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  // EXERCISE VIEW
  if (viewMode === 'exercise' && exercises.length > 0) {
    const currentExercise = exercises[currentExerciseIndex]
    const progressPercent = ((currentExerciseIndex + 1) / exercises.length) * 100

    return (
      <div className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode('categories')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Categories
          </Button>
          <Badge variant="outline">
            {CATEGORIES.find(c => c.id === selectedCategory)?.icon}{' '}
            {CATEGORIES.find(c => c.id === selectedCategory)?.name}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Question {currentExerciseIndex + 1} of {exercises.length}</span>
            <span className="text-muted-foreground">Score: {score}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {generating ? (
          <div className="flex items-center justify-center py-12">
            <RotateCcw className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExerciseIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="min-h-[300px]">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={currentExercise.type === 'fill-blank' ? 'default' : 'secondary'}
                      className={currentExercise.type === 'fill-blank' ? 'bg-emerald-600 text-white' : ''}>
                      {currentExercise.type === 'fill-blank' ? 'Fill in the Blank' : 'Find the Error'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{currentExercise.instruction}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-lg leading-relaxed font-medium">
                      {currentExercise.sentence}
                    </p>
                  </div>

                  {!showResult && currentExercise.options ? (
                    <div className="grid grid-cols-2 gap-2">
                      {currentExercise.options.map((option) => (
                        <Button
                          key={option}
                          variant={selectedOption === option ? 'default' : 'outline'}
                          className={`h-auto py-2.5 ${selectedOption === option ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
                          onClick={() => setSelectedOption(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  ) : !showResult ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your answer..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') checkAnswer() }}
                        className="flex-1"
                      />
                      <Button
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim() && !selectedOption}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Check
                      </Button>
                    </div>
                  ) : null}

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                      }`}>
                        {isCorrect ? (
                          <><CheckCircle2 className="h-5 w-5" /> Correct! Well done!</>
                        ) : (
                          <><XCircle className="h-5 w-5" /> Not quite right.</>
                        )}
                      </div>

                      {!isCorrect && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium text-emerald-700 dark:text-emerald-400">Correct answer: </span>
                            {currentExercise.answer}
                          </p>
                        </div>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => setShowExplanation(!showExplanation)}
                      >
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                        {showExplanation ? 'Hide' : 'Show'} Explanation
                      </Button>

                      {showExplanation && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
                        >
                          <p className="text-sm text-amber-700 dark:text-amber-400">{currentExercise.explanation}</p>
                        </motion.div>
                      )}

                      <Button onClick={nextExercise} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        {currentExerciseIndex < exercises.length - 1 ? 'Next Question' : 'See Results'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </motion.div>
                  )}

                  {!showResult && currentExercise.hint && (
                    <details className="mt-2">
                      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                        💡 Need a hint?
                      </summary>
                      <p className="text-sm text-muted-foreground mt-1 p-2 bg-muted/30 rounded">
                        {currentExercise.hint}
                      </p>
                    </details>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    )
  }

  // RESULTS VIEW
  const percentage = exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 0
  const categoryInfo = CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="text-center p-8 border-2 border-emerald-200 dark:border-emerald-800">
          <Trophy className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Exercise Complete!</h2>
          <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">{percentage}%</div>
          <p className="text-muted-foreground">
            You got {score} out of {exercises.length} correct
          </p>
          {categoryInfo && (
            <Badge variant="outline" className="mt-3">
              {categoryInfo.icon} {categoryInfo.name}
            </Badge>
          )}
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => handleCategoryClick(selectedCategory || 'tenses')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
        <Button variant="outline" onClick={() => setViewMode('categories')}>
          <PenTool className="h-4 w-4 mr-2" /> Other Categories
        </Button>
      </div>
    </div>
  )
}
