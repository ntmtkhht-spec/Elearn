'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAppStore, type VocabDeck, type VocabCard } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  BookOpen, Plus, ArrowLeft, Volume2, RotateCcw,
  Brain, Star, ChevronRight, Sparkles, Grid3X3, HelpCircle
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

const DECK_ICONS: Record<string, string> = {
  'Business English': '💼',
  'Travel & Tourism': '✈️',
  'Idioms & Phrasals': '🧠',
  'Academic English': '🎓',
  'Daily Life': '🏠',
  'Technology': '💻',
  'Health & Fitness': '🏋️',
  'Art & Culture': '🎨',
}

const SAMPLE_DECKS: VocabDeck[] = [
  { id: '1', name: 'First Words', description: 'Essential beginner words for everyday communication', level: 'A1', category: 'Basics', icon: '🌱', _count: { cards: 20 } },
  { id: '2', name: 'Greetings & Introductions', description: 'Learn to greet, introduce yourself, and say goodbye', level: 'A1', category: 'Daily', icon: '👋', _count: { cards: 16 } },
  { id: '3', name: 'Daily Routines', description: 'Words and phrases for talking about your day', level: 'A2', category: 'Daily', icon: '🌞', _count: { cards: 18 } },
  { id: '4', name: 'Shopping & Food', description: 'Vocabulary for restaurants, shops, and groceries', level: 'A2', category: 'Food', icon: '🛒', _count: { cards: 22 } },
  { id: '5', name: 'Business English', description: 'Essential vocabulary for professional environments', level: 'B2', category: 'Business', icon: '💼', _count: { cards: 24 } },
  { id: '6', name: 'Travel & Tourism', description: 'Words and phrases for traveling abroad', level: 'B1', category: 'Travel', icon: '✈️', _count: { cards: 18 } },
  { id: '7', name: 'Idioms & Phrasals', description: 'Common idiomatic expressions and phrasal verbs', level: 'C1', category: 'Idioms', icon: '🧠', _count: { cards: 30 } },
  { id: '8', name: 'Academic English', description: 'Formal vocabulary for academic writing and presentations', level: 'C1', category: 'Academic', icon: '🎓', _count: { cards: 22 } },
]

const SAMPLE_CARDS: VocabCard[] = [
  { id: 'c1', deckId: 'default', word: 'Hello', translation: 'Hallo', pronunciation: '/həˈloʊ/', partOfSpeech: 'interjection', exampleSentence: 'Hello, how are you today?', exampleTranslation: 'Hallo, wie geht es dir heute?', difficulty: 1, notes: null },
  { id: 'c2', deckId: 'default', word: 'Thank you', translation: 'Danke', pronunciation: '/θæŋk juː/', partOfSpeech: 'phrase', exampleSentence: 'Thank you for your help.', exampleTranslation: 'Danke für deine Hilfe.', difficulty: 1, notes: null },
  { id: 'c3', deckId: 'default', word: 'Please', translation: 'Bitte', pronunciation: '/pliːz/', partOfSpeech: 'adverb', exampleSentence: 'Please sit down.', exampleTranslation: 'Bitte setzen Sie sich.', difficulty: 1, notes: null },
  { id: 'c4', deckId: 'default', word: 'Goodbye', translation: 'Auf Wiedersehen', pronunciation: '/ɡʊdˈbaɪ/', partOfSpeech: 'interjection', exampleSentence: 'Goodbye, see you tomorrow!', exampleTranslation: 'Auf Wiedersehen, bis morgen!', difficulty: 1, notes: null },
  { id: 'c5', deckId: 'default', word: 'Yes', translation: 'Ja', pronunciation: '/jes/', partOfSpeech: 'adverb', exampleSentence: 'Yes, I would like some water.', exampleTranslation: 'Ja, ich hätte gerne etwas Wasser.', difficulty: 1, notes: null },
]

type ViewMode = 'decks' | 'practice' | 'quiz'

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const getIntervalLabels = (card: VocabCard | undefined) => {
  if (!card) return { again: '', hard: '', good: '', easy: '' }
  
  let status = 'new'
  let interval = 0
  let stepIndex = 0
  let easeFactor = 2.5

  if (card.progress && card.progress.length > 0) {
    status = card.progress[0].status
    interval = card.progress[0].interval
    stepIndex = status === 'learning' ? card.progress[0].correctness : 0
    easeFactor = card.progress[0].easeFactor
  }

  const formatTime = (minutes: number) => {
    return `<${minutes}m`
  }

  const formatDays = (days: number) => {
    if (days < 30) return `${days}d`
    const months = Math.round(days / 30)
    if (months < 12) return `${months}mo`
    return `${Math.round(months / 12)}y`
  }

  let again, hard, good, easy

  if (status === 'new' || status === 'learning' || status === 'relearning') {
    again = '<1m'
    hard = formatTime(stepIndex === 0 ? 5 : 10)
    good = stepIndex === 0 ? formatTime(10) : formatDays(1)
    easy = formatDays(4)
  } else {
    again = '<1m'
    hard = formatDays(Math.max(1, Math.round(interval * 1.2)))
    good = formatDays(Math.max(1, Math.round(interval * easeFactor)))
    easy = formatDays(Math.max(1, Math.round(interval * easeFactor * 1.3)))
  }

  return { again, hard, good, easy }
}

export default function VocabSection() {
  const {
    vocabDecks, setVocabDecks,
    currentDeck, setCurrentDeck,
    practiceCards, setPracticeCards,
    currentCardIndex, setCurrentCardIndex,
    showAnswer, setShowAnswer,
    userLevel,
  } = useAppStore()

  const [viewMode, setViewMode] = useState<ViewMode>('decks')
  const [loading, setLoading] = useState(vocabDecks.length === 0)
  const [flipped, setFlipped] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)
  const [quizOptions, setQuizOptions] = useState<string[]>([])
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null)
  const [cardsCompleted, setCardsCompleted] = useState(0)
  const displayLevel = userLevel || 'B2'
  const visibleLevels = [displayLevel]

  const filteredDecks = vocabDecks.filter(deck => visibleLevels.includes(deck.level))

  useEffect(() => {
    async function loadDecks() {
      if (vocabDecks.length > 0) {
        setLoading(false)
        return
      }
      try {
        const res = await fetch('/api/vocab')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setVocabDecks(data)
          } else {
            setVocabDecks(SAMPLE_DECKS)
          }
        } else {
          setVocabDecks(SAMPLE_DECKS)
        }
      } catch {
        setVocabDecks(SAMPLE_DECKS)
      }
      setLoading(false)
    }
    loadDecks()
  }, [setVocabDecks, vocabDecks.length])

  const loadPracticeCards = useCallback(async (deck: VocabDeck) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/vocab/practice?deckId=${deck.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) {
          setPracticeCards(data)
        } else {
          setPracticeCards(SAMPLE_CARDS)
        }
      } else {
        setPracticeCards(SAMPLE_CARDS)
      }
    } catch {
      setPracticeCards(SAMPLE_CARDS)
    }
    setCurrentCardIndex(0)
    setShowAnswer(false)
    setFlipped(false)
    setCardsCompleted(0)
    setLoading(false)
  }, [setPracticeCards, setCurrentCardIndex, setShowAnswer])

  const handleDeckClick = (deck: VocabDeck) => {
    setCurrentDeck(deck)
    setViewMode('practice')
    loadPracticeCards(deck)
  }



  const speakWord = (text: string) => {
    if (typeof window === 'undefined') return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  const handleRateCard = async (rating: string) => {
    const currentCard = practiceCards[currentCardIndex]
    if (!currentCard) return

    try {
      await fetch('/api/vocab/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: currentCard.id, rating }),
      })
    } catch {
      // Continue even if API fails
    }

    setCardsCompleted(prev => prev + 1)
    setFlipped(false)

    if (currentCardIndex < practiceCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    } else {
      // Completed all cards
      setViewMode('decks')
      setCurrentDeck(null)
    }
  }

  const startQuizMode = () => {
    if (practiceCards.length < 4) return
    setViewMode('quiz')
    loadQuizQuestion()
  }

  const loadQuizQuestion = () => {
    const currentCard = practiceCards[currentCardIndex]
    if (!currentCard) return

    // Generate 4 options: correct translation + 3 random wrong ones
    const wrongOptions = practiceCards
      .filter(c => c.id !== currentCard.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.translation)

    const allOptions = [currentCard.translation, ...wrongOptions].sort(() => Math.random() - 0.5)
    setQuizOptions(allOptions)
    setQuizAnswer(null)
    setQuizCorrect(null)
  }

  const handleQuizAnswer = (option: string, index: number) => {
    const currentCard = practiceCards[currentCardIndex]
    if (!currentCard || quizAnswer !== null) return

    setQuizAnswer(index)
    setQuizCorrect(option === currentCard.translation)
  }

  const handleNextQuiz = async () => {
    const currentCard = practiceCards[currentCardIndex]
    if (currentCard) {
      const rating = quizCorrect ? 'good' : 'again'
      try {
        await fetch('/api/vocab/practice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId: currentCard.id, rating }),
        })
      } catch {
        // Continue even if API fails
      }
    }

    if (currentCardIndex < practiceCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      loadQuizQuestion()
    } else {
      setViewMode('decks')
      setCurrentDeck(null)
    }
  }

  // DECK VIEW
  if (viewMode === 'decks') {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Vocabulary Trainer
            </h2>
            <p className="text-muted-foreground mt-1">Master English vocabulary with spaced repetition</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        ) : vocabDecks.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No vocabulary decks yet</h3>
            <p className="text-muted-foreground mb-4">Please sync the content via the admin panel.</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing decks for <Badge className={LEVEL_COLORS[displayLevel] || LEVEL_COLORS['B2']} variant="secondary">{displayLevel}</Badge> level
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDecks.map((deck, i) => (
              <motion.div
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group"
                  onClick={() => handleDeckClick(deck)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{deck.icon || DECK_ICONS[deck.name] || '📚'}</div>
                      <Badge className={LEVEL_COLORS[deck.level] || LEVEL_COLORS['B1']} variant="secondary">
                        {deck.level}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-base mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {deck.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {deck.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {deck._count?.cards ?? 0} cards
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <Progress value={deck._count?.cards ? Math.round(((deck.masteredCards ?? 0) / deck._count.cards) * 100) : 0} className="mt-3 h-1.5" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>


          </div>
        )}
      </div>
    )
  }

  // PRACTICE VIEW
  const currentCard = practiceCards[currentCardIndex]
  const totalCards = practiceCards.length
  const progressPercent = totalCards > 0 ? ((currentCardIndex + 1) / totalCards) * 100 : 0

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center p-12">
        <Card className="p-8 text-center max-w-md">
          <Star className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Cards Available</h3>
          <p className="text-muted-foreground mb-4">This deck doesn&apos;t have any practice cards yet.</p>
          <Button onClick={() => { setViewMode('decks'); setCurrentDeck(null) }} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Decks
          </Button>
        </Card>
      </div>
    )
  }

  if (viewMode === 'quiz') {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setViewMode('practice')} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Flashcards
          </Button>
          <Badge variant="outline" className="gap-1">
            <HelpCircle className="h-3 w-3" />
            Quiz Mode
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Card {currentCardIndex + 1} of {totalCards}</span>
            <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-2">{currentCard.word}</h2>
          <p className="text-muted-foreground italic mb-1">{currentCard.pronunciation}</p>
          <Badge variant="outline" className="mb-6">{currentCard.partOfSpeech}</Badge>

          <p className="text-sm text-muted-foreground mb-6">Choose the correct German translation:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quizOptions.map((option, i) => {
              let buttonClass = 'h-auto py-3 px-4 text-left justify-start'
              if (quizAnswer !== null) {
                if (option === currentCard.translation) {
                  buttonClass += ' bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-400 dark:text-emerald-400'
                } else if (i === quizAnswer && !quizCorrect) {
                  buttonClass += ' bg-red-100 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-400 dark:text-red-400'
                } else {
                  buttonClass += ' opacity-50'
                }
              }
              return (
                <Button
                  key={i}
                  variant="outline"
                  className={buttonClass}
                  onClick={() => handleQuizAnswer(option, i)}
                  disabled={quizAnswer !== null}
                >
                  <span className="font-medium">{option}</span>
                </Button>
              )
            })}
          </div>

          {quizAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              {quizCorrect ? (
                <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">✓ Correct!</p>
              ) : (
                <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                  ✗ The correct answer is: {currentCard.translation}
                </p>
              )}
              <Button onClick={handleNextQuiz} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Next Card <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </Card>
      </div>
    )
  }

  // FLASHCARD VIEW
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { setViewMode('decks'); setCurrentDeck(null) }} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Decks
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={startQuizMode} className="gap-1">
            <HelpCircle className="h-3.5 w-3.5" /> Quiz Mode
          </Button>
          <Badge variant="outline" className="gap-1">
            <Grid3X3 className="h-3 w-3" />
            {currentDeck?.name}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Card {currentCardIndex + 1} of {totalCards}</span>
          <span className="text-muted-foreground">{cardsCompleted} completed</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Flashcard */}
      <div
        className="perspective-1000 cursor-pointer"
        onClick={() => { setFlipped(!flipped); setShowAnswer(!showAnswer) }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showAnswer ? 'back' : 'front'}
            initial={{ rotateY: showAnswer ? -90 : 90, opacity: 0.5 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: showAnswer ? 90 : -90, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="min-h-[320px] flex flex-col items-center justify-center p-8 text-center border-2 border-emerald-200 dark:border-emerald-800">
              {!showAnswer ? (
                // FRONT
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-bold">{currentCard.word}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      onClick={(e) => { e.stopPropagation(); speakWord(currentCard.word) }}
                    >
                      <Volume2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground italic text-lg">{currentCard.pronunciation}</p>
                  <Badge variant="outline">{currentCard.partOfSpeech}</Badge>
                  <p className="text-sm text-muted-foreground mt-4">Click to reveal the answer</p>
                </div>
              ) : (
                // BACK
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {currentCard.translation}
                  </h3>
                  <div className="border-t border-border pt-4 w-full">
                    <p className="text-sm text-muted-foreground mb-2">Example:</p>
                    <div className="flex items-start justify-center gap-2">
                      <p className="text-base leading-relaxed">&ldquo;{currentCard.exampleSentence}&rdquo;</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 shrink-0 mt-0.5"
                        onClick={(e) => { e.stopPropagation(); speakWord(currentCard.exampleSentence) }}
                      >
                        <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      </Button>
                    </div>
                    {currentCard.exampleTranslation && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {currentCard.exampleTranslation}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">Difficulty: {'⭐'.repeat(currentCard.difficulty)}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">Click to flip back</p>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Rating Buttons */}
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-4 gap-2"
        >
          {[
            { label: 'Again', time: getIntervalLabels(currentCard).again, color: 'bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400', icon: <RotateCcw className="h-4 w-4" /> },
            { label: 'Hard', time: getIntervalLabels(currentCard).hard, color: 'bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 dark:text-amber-400', icon: <Brain className="h-4 w-4" /> },
            { label: 'Good', time: getIntervalLabels(currentCard).good, color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400', icon: <Star className="h-4 w-4" /> },
            { label: 'Easy', time: getIntervalLabels(currentCard).easy, color: 'bg-sky-100 hover:bg-sky-200 text-sky-700 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 dark:text-sky-400', icon: <Sparkles className="h-4 w-4" /> },
          ].map((rating) => (
            <Button
              key={rating.label}
              variant="outline"
              className={`h-auto py-3 flex flex-col items-center gap-0 ${rating.color}`}
              onClick={() => handleRateCard(rating.label.toLowerCase())}
            >
              <span className="text-[11px] opacity-70 font-semibold mb-1">{rating.time}</span>
              {rating.icon}
              <span className="text-xs font-bold mt-1">{rating.label}</span>
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
