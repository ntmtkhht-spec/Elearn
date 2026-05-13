'use client'

import { useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Sparkles, ChevronRight, CheckCircle2, XCircle,
  Trophy, ArrowLeft, RotateCcw, Target
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

// Questions organized by target level (the level you want to reach)
const LEVEL_UP_QUESTIONS: Record<string, Array<{
  id: string
  question: string
  options: string[]
  correctIndex: number
}>> = {
  A1: [
    { id: 'a1-1', question: 'She ___ a teacher.', options: ['am', 'is', 'are', 'be'], correctIndex: 1 },
    { id: 'a1-2', question: 'What is "Haus" in English?', options: ['House', 'Horse', 'Mouse', 'Hose'], correctIndex: 0 },
    { id: 'a1-3', question: 'I ___ from Germany.', options: ['is', 'are', 'am', 'be'], correctIndex: 2 },
    { id: 'a1-4', question: 'How do you say "Guten Morgen"?', options: ['Good evening', 'Good morning', 'Good night', 'Goodbye'], correctIndex: 1 },
    { id: 'a1-5', question: '"Cat" means:', options: ['Hund', 'Katze', 'Vogel', 'Fisch'], correctIndex: 1 },
  ],
  A2: [
    { id: 'a2-1', question: 'I ___ to the store yesterday.', options: ['go', 'goes', 'went', 'going'], correctIndex: 2 },
    { id: 'a2-2', question: '"Entschuldigung" means:', options: ['Excuse me', 'Thank you', 'Hello', 'Goodbye'], correctIndex: 0 },
    { id: 'a2-3', question: 'She can ___ very well.', options: ['cooking', 'cooks', 'cook', 'cooked'], correctIndex: 2 },
    { id: 'a2-4', question: 'Which is correct? "I have been waiting ___ 2 hours."', options: ['since', 'for', 'from', 'during'], correctIndex: 1 },
    { id: 'a2-5', question: '"Einkaufen" in English is:', options: ['Shopping', 'Cooking', 'Cleaning', 'Working'], correctIndex: 0 },
  ],
  B1: [
    { id: 'b1-1', question: 'If I ___ you, I would study more.', options: ['am', 'was', 'were', 'be'], correctIndex: 2 },
    { id: 'b1-2', question: '"Zuversichtlich" in English is:', options: ['Confident', 'Confused', 'Convenient', 'Conscious'], correctIndex: 0 },
    { id: 'b1-3', question: 'I have been living here ___ 2019.', options: ['for', 'since', 'from', 'during'], correctIndex: 1 },
    { id: 'b1-4', question: 'She suggested that he ___ a doctor.', options: ['sees', 'see', 'saw', 'seen'], correctIndex: 1 },
    { id: 'b1-5', question: 'The movie was so ___ that I fell asleep.', options: ['boring', 'bored', 'bore', 'boringly'], correctIndex: 0 },
    { id: 'b1-6', question: '"Obwohl" translates to:', options: ['Because', 'Although', 'However', 'Therefore'], correctIndex: 1 },
  ],
  B2: [
    { id: 'b2-1', question: 'The report _____ by the time the meeting started.', options: ['was completed', 'had been completed', 'has been completed', 'is completed'], correctIndex: 1 },
    { id: 'b2-2', question: '"Allgegenwärtig" means:', options: ['Ambiguous', 'Ubiquitous', 'Ambitious', 'Unanimous'], correctIndex: 1 },
    { id: 'b2-3', question: 'Hardly ___ the door when the phone rang.', options: ['had I opened', 'I had opened', 'did I open', 'I opened'], correctIndex: 0 },
    { id: 'b2-4', question: 'She would rather ___ at home than go out.', options: ['stay', 'staying', 'stayed', 'to stay'], correctIndex: 0 },
    { id: 'b2-5', question: 'The meeting has been postponed ___ next Monday.', options: ['on', 'at', 'to', 'until'], correctIndex: 3 },
    { id: 'b2-6', question: '"Nachhaltig" best translates to:', options: ['Sustainable', 'Suspicious', 'Substantial', 'Sufficient'], correctIndex: 0 },
  ],
  C1: [
    { id: 'c1-1', question: 'Not until he arrived ___ the truth.', options: ['did he realize', 'he realized', 'he did realize', 'realized he'], correctIndex: 0 },
    { id: 'c1-2', question: '"Unausweichlich" translates to:', options: ['Unbelievable', 'Inevitable', 'Unavoidable', 'Incredible'], correctIndex: 1 },
    { id: 'c1-3', question: '___ the economic downturn, the company thrived.', options: ['Despite', 'Although', 'However', 'Nevertheless'], correctIndex: 0 },
    { id: 'c1-4', question: 'She ___ have left already; her coat is still here.', options: ['mustn\'t', 'can\'t', 'shouldn\'t', 'won\'t'], correctIndex: 1 },
    { id: 'c1-5', question: 'The minister, ___ was recently appointed, faced criticism.', options: ['that', 'who', 'which', 'whom'], correctIndex: 1 },
    { id: 'c1-6', question: '"Querdenker" best translates to:', options: ['Critical thinker', 'Contrarian', 'Maverick', 'Skeptic'], correctIndex: 2 },
  ],
  C2: [
    { id: 'c2-1', question: 'At no time ___ the existence of the program.', options: ['did he acknowledge', 'he acknowledged', 'he did acknowledge', 'acknowledged he'], correctIndex: 0 },
    { id: 'c2-2', question: 'Were she ___ the truth, the whole case would collapse.', options: ['to reveal', 'revealing', 'revealed', 'reveal'], correctIndex: 0 },
    { id: 'c2-3', question: '"Fremdschämen" is best rendered as:', options: ['Self-pity', 'Vicarious embarrassment', 'Empathic shame', 'Second-hand pride'], correctIndex: 1 },
    { id: 'c2-4', question: 'So ___ the reaction that the entire lab was evacuated.', options: ['volatile was', 'was volatile', 'volatile', 'it was volatile'], correctIndex: 0 },
    { id: 'c2-5', question: 'The professor\'s argument, while ___ compelling, fails to account for recent data.', options: ['superficially', 'surface', 'superficial', 'superficies'], correctIndex: 0 },
    { id: 'c2-6', question: '"Verschlimmbessern" means:', options: ['To improve slightly', 'To make worse while trying to improve', 'To fix temporarily', 'To change for the better'], correctIndex: 1 },
  ],
}

const PASS_THRESHOLD = 0.7 // 70% to pass

interface LevelUpTestProps {
  targetLevel: string
  currentLevel: string
  onPass: () => void
  onFail: () => void
  onCancel: () => void
}

type TestPhase = 'intro' | 'questions' | 'results'

export default function LevelUpTest({ targetLevel, currentLevel, onPass, onFail, onCancel }: LevelUpTestProps) {
  const [phase, setPhase] = useState<TestPhase>('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const questions = LEVEL_UP_QUESTIONS[targetLevel] || LEVEL_UP_QUESTIONS['B1']
  const totalQuestions = questions.length

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl">
            <CardContent className="p-8 md:p-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Target className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Level Up Test
                </h1>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  To advance from <Badge className={LEVEL_COLORS[currentLevel]} variant="secondary">{currentLevel}</Badge> to <Badge className={LEVEL_COLORS[targetLevel]} variant="secondary">{targetLevel}</Badge>, you need to pass this test.
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-amber-500" />
                  <span>{totalQuestions} questions at {targetLevel} level</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Need {Math.ceil(totalQuestions * PASS_THRESHOLD)}/{totalQuestions} correct to pass (70%)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>No time limit — take your time</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setPhase('questions')
                    setCurrentQuestion(0)
                    setAnswers({})
                    setCorrectCount(0)
                    setSelectedOption(null)
                    setShowFeedback(false)
                  }}
                  size="lg"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white text-base py-6 shadow-lg"
                >
                  Start Level Up Test
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={onCancel}
                  className="w-full text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (phase === 'questions') {
    const question = questions[currentQuestion]
    const isCorrect = selectedOption === question.correctIndex
    const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 p-4">
        <div className="max-w-xl w-full space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>
              <Badge className={LEVEL_COLORS[targetLevel]} variant="secondary">
                {targetLevel} Test
              </Badge>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-amber-100 dark:border-amber-900/50 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl md:text-2xl leading-snug">
                    {question.question}
                  </CardTitle>
                  <CardDescription>Choose the correct answer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option, i) => {
                      let buttonClass = 'h-auto py-3 px-4 text-left justify-start text-sm font-medium transition-all border-2 '
                      if (showFeedback) {
                        if (i === question.correctIndex) {
                          buttonClass += 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-400 dark:text-emerald-400'
                        } else if (i === selectedOption && !isCorrect) {
                          buttonClass += 'bg-red-50 border-red-500 text-red-700 dark:bg-red-950/30 dark:border-red-400 dark:text-red-400'
                        } else {
                          buttonClass += 'opacity-50 border-border'
                        }
                      } else if (selectedOption === i) {
                        buttonClass += 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-950/30 dark:border-amber-500 dark:text-amber-400'
                      } else {
                        buttonClass += 'border-border hover:border-amber-300 hover:bg-amber-50/50 dark:hover:border-amber-700 dark:hover:bg-amber-950/20'
                      }

                      return (
                        <button
                          key={i}
                          className={buttonClass}
                          onClick={() => { if (!showFeedback) setSelectedOption(i) }}
                          disabled={showFeedback}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs ${
                              showFeedback && i === question.correctIndex
                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                : showFeedback && i === selectedOption && !isCorrect
                                  ? 'border-red-500 bg-red-500 text-white'
                                  : selectedOption === i && !showFeedback
                                    ? 'border-amber-400 bg-amber-400 text-white'
                                    : 'border-muted-foreground/30'
                            }`}>
                              {showFeedback && i === question.correctIndex ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : showFeedback && i === selectedOption && !isCorrect ? (
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

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                      }`}
                    >
                      {isCorrect ? (
                        <><CheckCircle2 className="h-5 w-5" /><span className="font-medium">Correct!</span></>
                      ) : (
                        <><XCircle className="h-5 w-5" /><span className="font-medium">Not quite. The answer is: {question.options[question.correctIndex]}</span></>
                      )}
                    </motion.div>
                  )}

                  <div className="flex gap-3 pt-2">
                    {!showFeedback ? (
                      <Button
                        onClick={() => {
                          if (selectedOption === null) return
                          const isRight = selectedOption === question.correctIndex
                          setAnswers(prev => ({ ...prev, [question.id]: selectedOption }))
                          if (isRight) setCorrectCount(prev => prev + 1)
                          setShowFeedback(true)
                        }}
                        disabled={selectedOption === null}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        Check Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          if (currentQuestion < totalQuestions - 1) {
                            setCurrentQuestion(prev => prev + 1)
                            setSelectedOption(null)
                            setShowFeedback(false)
                          } else {
                            setPhase('results')
                          }
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        {currentQuestion < totalQuestions - 1 ? 'Next Question' : 'See Results'}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // RESULTS
  if (phase === 'results') {
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    const passed = correctCount / totalQuestions >= PASS_THRESHOLD

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-amber-950/20 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full space-y-6"
        >
          <Card className={`border-2 shadow-xl text-center overflow-hidden ${
            passed ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800'
          }`}>
            <div className={`p-6 text-white ${
              passed
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}>
              <Trophy className="h-12 w-12 mx-auto mb-3 text-white/80" />
              <h2 className="text-2xl font-bold mb-1">
                {passed ? 'Level Up! 🎉' : 'Not Quite Yet'}
              </h2>
              <p className="text-white/80">
                {passed
                  ? `You've proven your ${LEVEL_NAMES[targetLevel]} skills!`
                  : 'Keep practicing and try again when you feel ready.'}
              </p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Your Score</span>
                  <span className={`text-2xl font-bold ${
                    passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {correctCount} out of {totalQuestions} correct (need {Math.ceil(totalQuestions * PASS_THRESHOLD)} to pass)
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Badge className={LEVEL_COLORS[currentLevel]} variant="secondary">
                  {currentLevel}
                </Badge>
                <span className="text-muted-foreground">→</span>
                <Badge className={`${LEVEL_COLORS[targetLevel]} ${passed ? 'ring-2 ring-emerald-400' : 'opacity-50'}`} variant="secondary">
                  {targetLevel}
                </Badge>
              </div>

              {passed ? (
                <Button
                  onClick={onPass}
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Continue as {targetLevel} — {LEVEL_NAMES[targetLevel]}
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground text-center">
                    You need more practice at {currentLevel} level. Keep going — you&apos;ll get there!
                  </p>
                  <Button
                    onClick={onFail}
                    size="lg"
                    variant="outline"
                    className="w-full py-6"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Stay at {currentLevel} — {LEVEL_NAMES[currentLevel]}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return null
}
