'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2,
  XCircle, Trophy, PenTool, MessageSquare, BookOpen, RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  A2: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  B1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  B2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  C1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  C2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const LEVEL_NAMES: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
}

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  A1: 'You can understand and use familiar everyday expressions and basic phrases.',
  A2: 'You can understand frequently used expressions related to areas of most immediate relevance.',
  B1: 'You can deal with most situations likely to arise while travelling or in familiar contexts.',
  B2: 'You can interact with a degree of fluency and spontaneity that makes regular interaction quite possible.',
  C1: 'You can express ideas fluently and spontaneously without much obvious searching for expressions.',
  C2: 'You can understand virtually everything heard or read with ease and express yourself spontaneously.',
}

interface PlacementQuestion {
  id: string
  type: 'grammar' | 'vocabulary' | 'sentence'
  question: string
  options: string[]
  correctIndex: number
  level: string
}

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // A1 level questions
  { id: 'q1', type: 'grammar', question: 'She ___ a teacher.', options: ['am', 'is', 'are', 'be'], correctIndex: 1, level: 'A1' },
  { id: 'q2', type: 'vocabulary', question: 'What is "Haus" in English?', options: ['House', 'Horse', 'Mouse', 'Mouth'], correctIndex: 0, level: 'A1' },
  // A2 level
  { id: 'q3', type: 'grammar', question: 'I ___ to the store yesterday.', options: ['go', 'goes', 'went', 'going'], correctIndex: 2, level: 'A2' },
  { id: 'q4', type: 'vocabulary', question: '"Entschuldigung" means:', options: ['Excuse me', 'Thank you', 'Hello', 'Goodbye'], correctIndex: 0, level: 'A2' },
  // B1 level
  { id: 'q5', type: 'grammar', question: 'If I ___ you, I would study more.', options: ['am', 'was', 'were', 'be'], correctIndex: 2, level: 'B1' },
  { id: 'q6', type: 'vocabulary', question: '"Zuversichtlich" in English is:', options: ['Confident', 'Confused', 'Convenient', 'Conscious'], correctIndex: 0, level: 'B1' },
  // B2 level
  { id: 'q7', type: 'grammar', question: 'The report _____ by the time the meeting started.', options: ['was completed', 'had been completed', 'has been completed', 'is completed'], correctIndex: 1, level: 'B2' },
  { id: 'q8', type: 'vocabulary', question: '"Allgegenwärtig" means:', options: ['Ambiguous', 'Ubiquitous', 'Ambitious', 'Unanimous'], correctIndex: 1, level: 'B2' },
  // C1 level
  { id: 'q9', type: 'grammar', question: 'Not until he arrived ___ the truth.', options: ['did he realize', 'he realized', 'he did realize', 'realized he'], correctIndex: 0, level: 'C1' },
  { id: 'q10', type: 'vocabulary', question: '"Unausweichlich" translates to:', options: ['Unbelievable', 'Inevitable', 'Unavoidable', 'Incredible'], correctIndex: 1, level: 'C1' },
  // C2 level
  { id: 'q11', type: 'grammar', question: '___ the economic downturn, the company thrived.', options: ['Despite', 'Although', 'However', 'Nevertheless'], correctIndex: 0, level: 'C2' },
  { id: 'q12', type: 'vocabulary', question: '"Querdenker" best translates to:', options: ['Critical thinker', 'Contrarian', 'Maverick', 'Skeptic'], correctIndex: 2, level: 'C2' },
  // Sentence completion
  { id: 'q13', type: 'sentence', question: 'I have been living in Berlin ___ 2019.', options: ['for', 'since', 'from', 'during'], correctIndex: 1, level: 'B1' },
  { id: 'q14', type: 'sentence', question: 'She suggested that he ___ a doctor.', options: ['sees', 'see', 'saw', 'seen'], correctIndex: 1, level: 'C1' },
  { id: 'q15', type: 'sentence', question: 'The meeting has been postponed ___ next Monday.', options: ['on', 'at', 'to', 'until'], correctIndex: 3, level: 'B2' },
]

type TestPhase = 'welcome' | 'questions' | 'writing' | 'analyzing' | 'results'

interface PlacementResult {
  level: string
  testScores: Record<string, { correct: number; total: number }>
  writingAnalysis: {
    grammarComplexity: string
    vocabularyRange: string
    sentenceStructure: string
  } | null
  strengths: string[]
  areasToImprove: string[]
  encouragement: string
}

export default function PlacementTest() {
  const { setUserLevel, setHasCompletedPlacement } = useAppStore()

  const [phase, setPhase] = useState<TestPhase>('welcome')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [writingSample, setWritingSample] = useState('')
  const [result, setResult] = useState<PlacementResult | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const totalQuestions = PLACEMENT_QUESTIONS.length
  const progressPercent = ((currentQuestion + 1) / (totalQuestions + 1)) * 100 // +1 for writing step

  const handleStart = () => {
    setPhase('questions')
    setCurrentQuestion(0)
    setAnswers({})
    setWritingSample('')
    setResult(null)
    setSelectedOption(null)
    setShowFeedback(false)
  }

  const handleSelectAnswer = (optionIndex: number) => {
    if (showFeedback) return
    setSelectedOption(optionIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return
    const question = PLACEMENT_QUESTIONS[currentQuestion]
    setAnswers(prev => ({ ...prev, [question.id]: selectedOption }))
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    setSelectedOption(null)

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setPhase('writing')
    }
  }

  const handleSubmitTest = async () => {
    setPhase('analyzing')

    // Build answers array for API
    const answersArray = PLACEMENT_QUESTIONS.map(q => ({
      id: q.id,
      level: q.level,
      type: q.type,
      selectedOption: answers[q.id] ?? -1,
      isCorrect: answers[q.id] === q.correctIndex,
    }))

    try {
      const res = await fetch('/api/placement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray, writingSample }),
      })

      if (res.ok) {
        const data = await res.json()
        setResult(data)
      } else {
        // Fallback: calculate level from answers alone
        setResult(calculateFallbackResult(answersArray))
      }
    } catch {
      setResult(calculateFallbackResult(answersArray))
    }

    setPhase('results')
  }

  const calculateFallbackResult = (answersArray: Array<{ id: string; level: string; isCorrect: boolean }>) => {
    const levelScores: Record<string, { correct: number; total: number }> = {
      A1: { correct: 0, total: 0 }, A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 }, B2: { correct: 0, total: 0 },
      C1: { correct: 0, total: 0 }, C2: { correct: 0, total: 0 },
    }
    for (const answer of answersArray) {
      if (levelScores[answer.level]) {
        levelScores[answer.level].total++
        if (answer.isCorrect) levelScores[answer.level].correct++
      }
    }

    let determinedLevel = 'A1'
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    for (const level of levelOrder) {
      const scores = levelScores[level]
      if (scores.total > 0 && scores.correct / scores.total >= 0.5) {
        determinedLevel = level
      }
    }

    return {
      level: determinedLevel,
      testScores: levelScores,
      writingAnalysis: null,
      strengths: ['You completed the placement test!'],
      areasToImprove: ['Keep practicing to improve your English'],
      encouragement: LEVEL_DESCRIPTIONS[determinedLevel] || 'Every step counts on your English learning journey!',
    }
  }

  const handleStartLearning = () => {
    if (result) {
      setUserLevel(result.level)
    }
    setHasCompletedPlacement(true)
  }

  // WELCOME PHASE
  if (phase === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full"
        >
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl">
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              {/* Logo */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Find Your English Level
                </h1>
                <p className="text-muted-foreground mt-3 text-base leading-relaxed">
                  Take a quick placement test to discover your CEFR level. 
                  We&apos;ll analyze your grammar, vocabulary, and writing to personalize your learning experience.
                </p>
              </div>

              {/* What to expect */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                  <PenTool className="h-5 w-5 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                  <p className="text-xs font-medium">15 Questions</p>
                </div>
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30">
                  <MessageSquare className="h-5 w-5 mx-auto text-teal-600 dark:text-teal-400 mb-1" />
                  <p className="text-xs font-medium">Writing Sample</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
                  <Sparkles className="h-5 w-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
                  <p className="text-xs font-medium">AI Analysis</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  Start Placement Test
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Takes about 5–10 minutes • No time limit
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // QUESTIONS PHASE
  if (phase === 'questions') {
    const question = PLACEMENT_QUESTIONS[currentQuestion]
    const isAnswered = showFeedback
    const isCorrect = selectedOption === question.correctIndex

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <div className="max-w-xl w-full space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Question {currentQuestion + 1} of {totalQuestions}</span>
              <Badge className={LEVEL_COLORS[question.level]} variant="secondary">
                {question.level}
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-emerald-100 dark:border-emerald-900/50 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {question.type === 'grammar' ? '📝 Grammar' : question.type === 'vocabulary' ? '📖 Vocabulary' : '✏️ Sentence'}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl md:text-2xl leading-snug">
                    {question.question}
                  </CardTitle>
                  <CardDescription>Choose the correct answer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, i) => {
                      let buttonClass = 'h-auto py-3 px-4 text-left justify-start text-sm font-medium transition-all border-2 '
                      if (isAnswered) {
                        if (i === question.correctIndex) {
                          buttonClass += 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-400 dark:text-emerald-400'
                        } else if (i === selectedOption && !isCorrect) {
                          buttonClass += 'bg-red-50 border-red-500 text-red-700 dark:bg-red-950/30 dark:border-red-400 dark:text-red-400'
                        } else {
                          buttonClass += 'opacity-50 border-border'
                        }
                      } else if (selectedOption === i) {
                        buttonClass += 'bg-emerald-50 border-emerald-400 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-400'
                      } else {
                        buttonClass += 'border-border hover:border-emerald-300 hover:bg-emerald-50/50 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20'
                      }

                      return (
                        <button
                          key={i}
                          className={buttonClass}
                          onClick={() => handleSelectAnswer(i)}
                          disabled={isAnswered}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs ${
                              isAnswered && i === question.correctIndex
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : isAnswered && i === selectedOption && !isCorrect
                                  ? 'border-red-500 bg-red-500 text-white'
                                  : selectedOption === i && !isAnswered
                                    ? 'border-emerald-400 bg-emerald-400 text-white'
                                    : 'border-muted-foreground/30'
                            }`}>
                              {isAnswered && i === question.correctIndex ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : isAnswered && i === selectedOption && !isCorrect ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <span>{String.fromCharCode(65 + i)}</span>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Feedback */}
                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">Correct! Well done.</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5" />
                          <span className="font-medium">Not quite. The answer is: {question.options[question.correctIndex]}</span>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 pt-2">
                    {!isAnswered ? (
                      <Button
                        onClick={handleConfirmAnswer}
                        disabled={selectedOption === null}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'Continue to Writing'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Skip option */}
          {!isAnswered && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  setSelectedOption(null)
                  setShowFeedback(false)
                  if (currentQuestion < totalQuestions - 1) {
                    setCurrentQuestion(prev => prev + 1)
                  } else {
                    setPhase('writing')
                  }
                }}
              >
                Skip this question
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // WRITING PHASE
  if (phase === 'writing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full space-y-6"
        >
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Writing Sample</span>
              <span className="text-muted-foreground">Almost done!</span>
            </div>
            <Progress value={95} className="h-2" />
          </div>

          <Card className="border-2 border-emerald-100 dark:border-emerald-900/50 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" variant="secondary">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Writing
                </Badge>
              </div>
              <CardTitle className="text-xl">Tell us about yourself</CardTitle>
              <CardDescription>
                Write 3–4 sentences about yourself in English. This helps us better assess your level.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Hi, my name is... I live in... I like... My hobbies are..."
                value={writingSample}
                onChange={(e) => setWritingSample(e.target.value)}
                className="min-h-[160px] resize-y text-base leading-relaxed"
              />
              <p className="text-xs text-muted-foreground">
                Don&apos;t worry about being perfect — just write naturally. This is optional but helps us give you a more accurate level.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPhase('questions')}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmitTest}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Submit & Get My Level
                  <Sparkles className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ANALYZING PHASE
  if (phase === 'analyzing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <div className="relative inline-flex">
            <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <RotateCcw className="h-10 w-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Analyzing Your English...</h2>
            <p className="text-muted-foreground">
              Our AI is reviewing your answers and writing sample to determine your level.
            </p>
          </div>

          <div className="space-y-3">
            {['Checking grammar accuracy', 'Evaluating vocabulary range', 'Assessing writing fluency'].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.5 }}
                className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium">{step}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // RESULTS PHASE
  if (phase === 'results' && result) {
    const levelColor = LEVEL_COLORS[result.level] || LEVEL_COLORS['B1']
    const levelName = LEVEL_NAMES[result.level] || result.level
    const levelDescription = LEVEL_DESCRIPTIONS[result.level] || ''

    // Calculate total score
    const totalCorrect = Object.values(result.testScores).reduce((sum, s) => sum + s.correct, 0)
    const totalQuestions2 = Object.values(result.testScores).reduce((sum, s) => sum + s.total, 0)
    const percentage = totalQuestions2 > 0 ? Math.round((totalCorrect / totalQuestions2) * 100) : 0

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full space-y-6"
        >
          {/* Level badge card */}
          <Card className="border-2 border-emerald-200 dark:border-emerald-800 shadow-xl text-center overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-amber-200" />
              <h2 className="text-2xl font-bold mb-1">Your English Level</h2>
              <div className="flex items-center justify-center gap-3 mt-4">
                <Badge className={`${levelColor} text-2xl px-5 py-2 font-bold`} variant="secondary">
                  {result.level}
                </Badge>
              </div>
              <p className="text-emerald-100 text-lg mt-2 font-medium">{levelName}</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {levelDescription}
              </p>

              {/* Score summary */}
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalCorrect} out of {totalQuestions2} questions correct
                </p>
              </div>

              {/* Level breakdown */}
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(result.testScores).map(([level, scores]) => (
                  <div key={level} className={`p-2 rounded-lg text-center ${LEVEL_COLORS[level]} text-xs`}>
                    <p className="font-bold">{level}</p>
                    <p>{scores.correct}/{scores.total}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <Sparkles className="h-4 w-4" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {result.areasToImprove.map((s, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Writing Analysis */}
          {result.writingAnalysis && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  Writing Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Grammar</p>
                    <p className="text-sm font-medium">{result.writingAnalysis.grammarComplexity}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Vocabulary</p>
                    <p className="text-sm font-medium">{result.writingAnalysis.vocabularyRange}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Structure</p>
                    <p className="text-sm font-medium">{result.writingAnalysis.sentenceStructure}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Encouragement */}
          <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                💚 {result.encouragement}
              </p>
            </CardContent>
          </Card>

          {/* Start Learning Button */}
          <Button
            onClick={handleStartLearning}
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-base py-6 shadow-lg hover:shadow-xl transition-all"
          >
            Start Learning at {result.level} — {levelName}
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </motion.div>
      </div>
    )
  }

  return null
}
