'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore, type ReadingExercise, type Question, type VocabHint } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FileText, Plus, ArrowLeft, ChevronRight, Sparkles, RotateCcw,
  CheckCircle2, XCircle, Trophy, BookMarked, Lightbulb
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LEVEL_COLORS: Record<string, string> = {
  B1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  B2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  C1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  C2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const CATEGORY_ICONS: Record<string, string> = {
  'News': '📰',
  'Story': '📖',
  'Academic': '🎓',
  'Business': '💼',
  'Science': '🔬',
  'Culture': '🎭',
}

const SAMPLE_EXERCISES: ReadingExercise[] = [
  {
    id: 'r1',
    title: 'The Future of Remote Work',
    content: `The landscape of work has undergone a dramatic transformation in recent years. What was once considered a rare perk—working from home—has become the norm for millions of professionals worldwide. The COVID-19 pandemic served as an unprecedented catalyst, forcing organizations to adopt remote work practices virtually overnight.

However, this shift has not been without its challenges. Many companies have struggled to maintain their corporate culture in a distributed environment. The spontaneous water-cooler conversations that once sparked innovation have been replaced by scheduled video calls, often leading to "Zoom fatigue." Moreover, the blurring of boundaries between work and personal life has raised concerns about employee burnout.

On the positive side, remote work has opened up opportunities for both employers and employees. Companies can now tap into a global talent pool without the constraints of geography, while workers enjoy greater flexibility and the elimination of commuting time. Studies have shown that, when properly managed, remote workers can be just as productive—if not more so—than their office-based counterparts.

The hybrid model, which combines remote and in-office work, appears to be the compromise that most organizations are embracing. This approach allows employees to benefit from the flexibility of working from home while still maintaining the collaborative advantages of face-to-face interaction. Nevertheless, finding the right balance remains an ongoing experiment for many companies.

Looking ahead, the future of work will likely be shaped by advances in technology, particularly in virtual reality and artificial intelligence, which could further bridge the gap between remote and in-person collaboration.`,
    level: 'B2',
    category: 'Business',
    questions: [
      { id: 'q1', question: 'According to the text, what was the main catalyst for the adoption of remote work?', options: ['Technological advances', 'The COVID-19 pandemic', 'Employee demands', 'Cost reduction'], correctIndex: 1, explanation: 'The text explicitly states: "The COVID-19 pandemic served as an unprecedented catalyst, forcing organizations to adopt remote work practices virtually overnight."' },
      { id: 'q2', question: 'What does "Zoom fatigue" refer to in this context?', options: ['Physical exhaustion from exercise', 'Tiredness from excessive video calls', 'Boredom from slow internet', 'Frustration with technology'], correctIndex: 1, explanation: '"Zoom fatigue" refers to the exhaustion caused by too many scheduled video calls replacing natural conversations.' },
      { id: 'q3', question: 'What advantage does remote work offer to employers?', options: ['Lower salaries', 'Access to a global talent pool', 'Fewer holidays', 'Reduced training needs'], correctIndex: 1, explanation: 'The text mentions: "Companies can now tap into a global talent pool without the constraints of geography."' },
      { id: 'q4', question: 'What is the hybrid model according to the text?', options: ['Working only from home', 'A mix of remote and in-office work', 'Working in multiple offices', 'Part-time employment'], correctIndex: 1, explanation: 'The text defines it as "combines remote and in-office work."' },
    ],
    vocabularyHints: [
      { word: 'catalyst', meaning: 'Katalysator - etwas, das eine Veränderung beschleunigt' },
      { word: 'unprecedented', meaning: 'Beispiellos - nie zuvor dagewesen' },
      { word: 'distributed', meaning: 'Verteilt - über verschiedene Orte hinweg' },
      { word: 'burnout', meaning: 'Burnout - völlige Erschöpfung durch Überlastung' },
      { word: 'constraints', meaning: 'Einschränkungen - Begrenzungen oder Hindernisse' },
      { word: 'counterparts', meaning: 'Entsprechungen - Personen in ähnlicher Position' },
      { word: 'embracing', meaning: 'Annehmen - etwas akzeptieren und nutzen' },
    ],
  },
  {
    id: 'r2',
    title: 'Climate Change and Urban Planning',
    content: `Cities around the world are facing an existential challenge: how to adapt to the realities of climate change while continuing to grow and thrive. Rising sea levels, extreme weather events, and increasing temperatures are forcing urban planners to rethink the very foundations of city design.

In response, many municipalities are adopting "sponge city" concepts, which prioritize natural water absorption through green spaces, permeable surfaces, and wetland restoration. These initiatives not only help manage flooding but also improve air quality and provide residents with recreational areas.

Transportation infrastructure is another critical area of focus. Cities like Copenhagen and Amsterdam have long been pioneers in cycling infrastructure, and their models are being studied and replicated worldwide. Electric vehicle adoption, improved public transit systems, and pedestrian-friendly zones are becoming standard features of modern urban planning.

The concept of "15-minute cities"—where residents can access all essential services within a 15-minute walk or bike ride—has gained significant traction. This approach reduces car dependency, lowers emissions, and fosters a stronger sense of community.

However, implementing these changes requires substantial investment and political will. Developing nations, in particular, face the dual challenge of rapid urbanization and climate adaptation, often with limited financial resources. International cooperation and knowledge sharing will be essential to ensure that all cities, regardless of their economic standing, can become more resilient in the face of climate change.`,
    level: 'C1',
    category: 'Science',
    questions: [
      { id: 'q5', question: 'What is a "sponge city" concept?', options: ['A city built on water', 'A city that prioritizes natural water absorption', 'A city that cleans oceans', 'A floating city concept'], correctIndex: 1, explanation: 'The text explains sponge cities "prioritize natural water absorption through green spaces, permeable surfaces, and wetland restoration."' },
      { id: 'q6', question: 'What does the "15-minute city" concept aim to achieve?', options: ['Faster internet speeds', 'Access to all essential services within 15 minutes', '15-minute commuting time', 'Shorter work hours'], correctIndex: 1, explanation: 'The text defines it as "where residents can access all essential services within a 15-minute walk or bike ride."' },
    ],
    vocabularyHints: [
      { word: 'existential', meaning: 'Existenziell - die Existenz betreffend' },
      { word: 'permeable', meaning: 'Durchlässig - Flüssigkeiten durchlassend' },
      { word: 'traction', meaning: 'Schwung/Zustimmung - wachsende Akzeptanz' },
      { word: 'resilient', meaning: 'Widerstandsfähig - fähig, sich zu erholen' },
    ],
  },
]

type ReadViewMode = 'list' | 'reading' | 'questions' | 'results'

export default function ReadingSection() {
  const {
    readingExercises, setReadingExercises,
    currentExercise, setCurrentExercise,
  } = useAppStore()

  const [viewMode, setViewMode] = useState<ReadViewMode>('list')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTopic, setNewTopic] = useState('')
  const [newLevel, setNewLevel] = useState('B2')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [score, setScore] = useState(0)
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({})
  const [hoveredWord, setHoveredWord] = useState<{ word: string; meaning: string } | null>(null)

  useEffect(() => {
    async function loadExercises() {
      try {
        const res = await fetch('/api/reading')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setReadingExercises(data)
          } else {
            setReadingExercises(SAMPLE_EXERCISES)
          }
        } else {
          setReadingExercises(SAMPLE_EXERCISES)
        }
      } catch {
        setReadingExercises(SAMPLE_EXERCISES)
      }
      setLoading(false)
    }
    loadExercises()
  }, [setReadingExercises])

  const handleExerciseClick = (exercise: ReadingExercise) => {
    setCurrentExercise(exercise)
    setViewMode('reading')
    setAnswers({})
    setScore(0)
    setShowExplanations({})
  }

  const handleGenerateExercise = async () => {
    if (!newTopic.trim()) return
    setGenerating(true)
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: newTopic, level: newLevel }),
      })
      if (res.ok) {
        const newExercise = await res.json()
        setReadingExercises([...readingExercises, newExercise])
        setDialogOpen(false)
        setNewTopic('')
      }
    } catch {
      // Silently fail
    }
    setGenerating(false)
  }

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmitAnswers = async () => {
    if (!currentExercise) return
    let correctCount = 0
    currentExercise.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) correctCount++
    })
    setScore(correctCount)

    try {
      await fetch('/api/reading/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: currentExercise.id, answers }),
      })
    } catch {
      // Continue even if API fails
    }

    setViewMode('results')
  }

  const getVocabHint = useCallback((word: string): VocabHint | undefined => {
    if (!currentExercise?.vocabularyHints) return undefined
    return currentExercise.vocabularyHints.find(
      h => h.word.toLowerCase() === word.toLowerCase()
    )
  }, [currentExercise])

  const renderContent = (content: string) => {
    const words = content.split(/(\s+)/)
    return words.map((part, i) => {
      const cleanWord = part.replace(/[.,!?;:'"()]/g, '')
      const hint = getVocabHint(cleanWord)
      if (hint) {
        return (
          <span
            key={i}
            className="underline decoration-dotted decoration-emerald-500 cursor-help hover:bg-emerald-50 dark:hover:bg-emerald-950/30 px-0.5 rounded transition-colors"
            onMouseEnter={() => setHoveredWord(hint)}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Reading Comprehension
            </h2>
            <p className="text-muted-foreground mt-1">Improve your reading skills with real-world texts</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Generate AI Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Reading Exercise</DialogTitle>
                <DialogDescription>
                  Choose a topic and level, and AI will create a reading comprehension exercise.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input
                    placeholder="e.g., Artificial Intelligence, Travel, Environment..."
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <div className="flex gap-2">
                    {['B1', 'B2', 'C1', 'C2'].map(level => (
                      <Button
                        key={level}
                        variant={newLevel === level ? 'default' : 'outline'}
                        size="sm"
                        className={newLevel === level ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                        onClick={() => setNewLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleGenerateExercise}
                  disabled={generating || !newTopic.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {generating ? (
                    <><RotateCcw className="h-4 w-4 mr-2 animate-spin" />Generating...</>
                  ) : (
                    <><Sparkles className="h-4 w-4 mr-2" />Generate</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : readingExercises.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No reading exercises yet</h3>
            <p className="text-muted-foreground mb-4">Generate your first AI exercise to get started.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Create Exercise
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {readingExercises.map((exercise, i) => (
              <motion.div
                key={exercise.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                  onClick={() => handleExerciseClick(exercise)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {CATEGORY_ICONS[exercise.category || ''] || '📄'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {exercise.title}
                        </h3>
                        <Badge className={LEVEL_COLORS[exercise.level] || LEVEL_COLORS['B1']} variant="secondary">
                          {exercise.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {exercise.content.substring(0, 100)}...
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>{exercise.questions.length} questions</span>
                        <span>•</span>
                        <span>{exercise.category}</span>
                        {exercise.vocabularyHints && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <BookMarked className="h-3 w-3" />
                              {exercise.vocabularyHints.length} vocab hints
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // READING VIEW
  if (viewMode === 'reading' && currentExercise) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setViewMode('list'); setCurrentExercise(null) }} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Exercises
          </Button>
          <Badge className={LEVEL_COLORS[currentExercise.level] || LEVEL_COLORS['B1']} variant="secondary">
            {currentExercise.level}
          </Badge>
        </div>

        <h2 className="text-2xl font-bold">{currentExercise.title}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Text */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <ScrollArea className="max-h-[60vh]">
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed text-base">
                    {currentExercise.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{renderContent(paragraph)}</p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Vocab Hints Sidebar */}
          <div className="space-y-4">
            {hoveredWord && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="p-3 pb-2">
                    <CardTitle className="text-sm flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Vocabulary Hint
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <p className="font-medium text-emerald-700 dark:text-emerald-400">{hoveredWord.word}</p>
                    <p className="text-sm text-muted-foreground">{hoveredWord.meaning}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {currentExercise.vocabularyHints && currentExercise.vocabularyHints.length > 0 && (
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-1">
                    <BookMarked className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    Vocabulary Hints
                  </CardTitle>
                  <CardDescription className="text-xs">Hover over dotted words in the text</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {currentExercise.vocabularyHints.map((hint, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium text-emerald-700 dark:text-emerald-400">{hint.word}</span>
                        <span className="text-muted-foreground"> — {hint.meaning}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={() => setViewMode('questions')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Start Questions
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // QUESTIONS VIEW
  if (viewMode === 'questions' && currentExercise) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode('reading')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Text
          </Button>
          <span className="text-sm text-muted-foreground">
            {Object.keys(answers).length}/{currentExercise.questions.length} answered
          </span>
        </div>

        <h2 className="text-xl font-bold">{currentExercise.title} — Questions</h2>

        <div className="space-y-6">
          {currentExercise.questions.map((q, qIndex) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: qIndex * 0.05 }}
            >
              <Card>
                <CardContent className="p-5">
                  <p className="font-medium mb-4">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          answers[q.id] === oIndex
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700'
                            : 'border-border hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-muted/50'
                        }`}
                        onClick={() => handleSelectAnswer(q.id, oIndex)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            answers[q.id] === oIndex
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : 'border-muted-foreground/30'
                          }`}>
                            {answers[q.id] === oIndex && (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button
          onClick={handleSubmitAnswers}
          disabled={Object.keys(answers).length < currentExercise.questions.length}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Submit Answers ({Object.keys(answers).length}/{currentExercise.questions.length})
        </Button>
      </div>
    )
  }

  // RESULTS VIEW
  if (viewMode === 'results' && currentExercise) {
    const percentage = Math.round((score / currentExercise.questions.length) * 100)
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setViewMode('list'); setCurrentExercise(null) }} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Exercises
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="text-center p-8 border-2 border-emerald-200 dark:border-emerald-800">
            <Trophy className="h-12 w-12 mx-auto text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exercise Complete!</h2>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              {percentage}%
            </p>
            <p className="text-muted-foreground">
              You got {score} out of {currentExercise.questions.length} questions correct
            </p>
          </Card>
        </motion.div>

        <div className="space-y-4">
          {currentExercise.questions.map((q, qIndex) => {
            const isCorrect = answers[q.id] === q.correctIndex
            const showExp = showExplanations[q.id]
            return (
              <Card key={q.id} className={isCorrect ? 'border-emerald-200 dark:border-emerald-800' : 'border-red-200 dark:border-red-800'}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium mb-1">{qIndex + 1}. {q.question}</p>
                      {!isCorrect && (
                        <p className="text-sm mb-1">
                          Your answer: <span className="text-red-600 dark:text-red-400 line-through">{q.options[answers[q.id]]}</span>
                        </p>
                      )}
                      <p className="text-sm">
                        Correct answer: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{q.options[q.correctIndex]}</span>
                      </p>
                      {q.explanation && (
                        <div className="mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs gap-1 p-0 h-auto"
                            onClick={() => setShowExplanations(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          >
                            <Lightbulb className="h-3 w-3 text-amber-500" />
                            {showExp ? 'Hide' : 'Show'} explanation
                          </Button>
                          {showExp && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
                            >
                              <p className="text-sm text-amber-700 dark:text-amber-400">{q.explanation}</p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Button
          onClick={() => { setViewMode('list'); setCurrentExercise(null) }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Back to Exercises
        </Button>
      </div>
    )
  }

  return null
}
