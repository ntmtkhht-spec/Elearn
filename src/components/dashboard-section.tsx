'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore, type LearningStats, type VocabCard } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BookOpen, Flame, Dumbbell, TrendingUp,
  ArrowRight, Volume2, Sparkles, Target, Clock, Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

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

// Daily Challenge definitions
interface DailyChallenge {
  type: string
  title: string
  description: string
  prompt: string
}

const CHALLENGE_WORDS = ['resilient', 'eloquent', 'meticulous', 'ambiguous', 'tenacious', 'profound', 'versatile', 'pragmatic', 'innovative', 'perseverance']
const CHALLENGE_IDIOMS = [
  { partial: 'Every cloud has a ___', answer: 'silver lining', hint: 'something positive in a negative situation' },
  { partial: 'Break the ___', answer: 'ice', hint: 'start a conversation in an awkward situation' },
  { partial: 'Hit the nail on the ___', answer: 'head', hint: 'describe exactly what is causing a problem' },
  { partial: 'A penny for your ___', answer: 'thoughts', hint: 'ask what someone is thinking' },
  { partial: 'Bite the ___', answer: 'bullet', hint: 'endure a painful situation' },
  { partial: 'The ball is in your ___', answer: 'court', hint: 'it\'s your decision now' },
  { partial: 'Burn the midnight ___', answer: 'oil', hint: 'work late into the night' },
  { partial: 'Let the cat out of the ___', answer: 'bag', hint: 'reveal a secret' },
  { partial: 'Piece of ___', answer: 'cake', hint: 'something very easy' },
  { partial: 'Spill the ___', answer: 'beans', hint: 'reveal secret information' },
]
const CHALLENGE_TOPICS = [
  'the impact of technology on daily life',
  'your favorite travel destination and why',
  'the importance of learning a second language',
  'how hobbies shape our personality',
  'the role of art in modern society',
  'a skill you would like to learn and why',
  'the benefits of reading books regularly',
  'how to maintain a healthy work-life balance',
]
const CHALLENGE_GERMAN = [
  'Ich lerne jeden Tag etwas Neues.',
  'Die Musik ist die Sprache der Seele.',
  'Reisen bildet den Geist und öffnet das Herz.',
  'Übung macht den Meister.',
  'Wissen ist Macht, aber Weisheit ist wichtiger.',
  'Jede Reise beginnt mit dem ersten Schritt.',
  'Das Leben ist zu kurz für schlechten Kaffee.',
  'Wer nicht wagt, der nicht gewinnt.',
]
const SYNONYM_WORDS = ['happy', 'important', 'beautiful', 'difficult', 'interesting', 'brave', 'calm', 'clever', 'generous', 'humble']

function getDayOfYear(): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

function seededIndex(seed: number, length: number): number {
  // Simple deterministic hash from day-of-year
  const hash = ((seed * 2654435761) >>> 0) % length
  return hash
}

function getDailyChallenge(): DailyChallenge {
  const day = getDayOfYear()
  const challengeTypeIndex = day % 5

  switch (challengeTypeIndex) {
    case 0: {
      const word = CHALLENGE_WORDS[seededIndex(day, CHALLENGE_WORDS.length)]
      return {
        type: 'sentences',
        title: 'Sentence Builder',
        description: 'Write 3 sentences using a given word',
        prompt: `Write 3 different sentences using the word "${word}". Make each sentence at least 8 words long and show different contexts where the word can be used. After writing, ask me if I want feedback on my sentences.`,
      }
    }
    case 1: {
      const sentence = CHALLENGE_GERMAN[seededIndex(day, CHALLENGE_GERMAN.length)]
      return {
        type: 'translate',
        title: 'Translation Challenge',
        description: 'Translate a German sentence to English',
        prompt: `Translate the following German sentence to English: "${sentence}" \n\nPlease wait for my translation, then give me feedback on accuracy, grammar, and suggest improvements. The original German: "${sentence}"`,
      }
    }
    case 2: {
      const idiom = CHALLENGE_IDIOMS[seededIndex(day, CHALLENGE_IDIOMS.length)]
      return {
        type: 'idiom',
        title: 'Idiom Completer',
        description: 'Complete a common English idiom',
        prompt: `Complete this English idiom: "${idiom.partial}". Hint: it means ${idiom.hint}. Please wait for my answer, then tell me if I got it right and explain the idiom's origin and usage.`,
      }
    }
    case 3: {
      const topic = CHALLENGE_TOPICS[seededIndex(day, CHALLENGE_TOPICS.length)]
      return {
        type: 'paragraph',
        title: 'Free Writing',
        description: 'Write a short paragraph about a topic',
        prompt: `Write a short paragraph (5-8 sentences) about ${topic}. After I write my paragraph, please review it for grammar, vocabulary usage, and style. Suggest advanced vocabulary alternatives where appropriate.`,
      }
    }
    case 4:
    default: {
      const word = SYNONYM_WORDS[seededIndex(day, SYNONYM_WORDS.length)]
      return {
        type: 'synonyms',
        title: 'Synonym Hunter',
        description: 'Find 3 synonyms for a given word',
        prompt: `Find 3 synonyms for the word "${word}". After I provide my synonyms, tell me if they're correct and share additional synonyms I might not know. Explain the subtle differences in meaning between each synonym.`,
      }
    }
  }
}

export default function DashboardSection() {
  const { 
    setActiveSection, setCoachOpen, addCoachMessage, userLevel,
    dashboardStats, setDashboardStats, dashboardTodayWord, setDashboardTodayWord 
  } = useAppStore()
  const displayLevel = userLevel || 'B2'
  const dailyChallenge = useMemo(() => getDailyChallenge(), [])
  
  const stats = dashboardStats
  const todayWord = dashboardTodayWord
  const [loading, setLoading] = useState(dashboardStats === null)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setDashboardStats(data)
        }
      } catch {
        // Keep old
      }

      try {
        const vocabRes = await fetch('/api/vocab/practice')
        if (vocabRes.ok) {
          const cards = await vocabRes.json()
          if (cards.length > 0) {
            // Only update if we don't have one, or just update it
            if (!dashboardTodayWord) {
              setDashboardTodayWord(cards[Math.floor(Math.random() * cards.length)])
            }
          }
        }
      } catch {}
      setLoading(false)
    }
    loadData()
  }, [dashboardTodayWord, setDashboardStats, setDashboardTodayWord])

  const dailyGoal = 50
  const dailyProgress = stats ? Math.min(((stats.vocabStudied || 0) / dailyGoal) * 100, 100) : 0

  const speakWord = (text: string) => {
    if (typeof window === 'undefined') return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {getGreeting()} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Keep up the great work on your English journey!</p>
        </div>
        <Badge className={`${LEVEL_COLORS[displayLevel] || LEVEL_COLORS['B2']} text-sm px-3 py-1 self-start`} variant="secondary">
          Level: {displayLevel} — {LEVEL_NAMES[displayLevel] || 'Upper Intermediate'}
        </Badge>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Words Learned', value: stats?.vocabStudied ?? 0, icon: <BookOpen className="h-5 w-5" />, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Day Streak', value: stats?.streak ?? 0, icon: <Flame className="h-5 w-5" />, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Exercises Done', value: stats?.readingDone ?? 0, icon: <Dumbbell className="h-5 w-5" />, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30' },

        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Goal + Today's Word */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Daily Goal
              </CardTitle>
              <CardDescription>Learn {dailyGoal} words per day</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{stats?.vocabStudied ?? 0}/{dailyGoal} words</span>
                </div>
                <Progress value={dailyProgress} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                {dailyProgress >= 100
                  ? '🎉 You\'ve reached your daily goal!'
                  : `Keep going! ${dailyGoal - (stats?.vocabStudied ?? 0)} more words to reach your goal.`}
              </p>
              <Button
                onClick={() => setActiveSection('vocabulary')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Practice Vocabulary
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Word */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="h-full border-amber-200 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Word of the Day
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayWord && (
                <>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold">{todayWord.word}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                      onClick={() => speakWord(todayWord.word)}
                    >
                      <Volume2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground italic">{todayWord.pronunciation}</p>
                  <Badge variant="outline" className="text-xs">{todayWord.partOfSpeech}</Badge>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    {todayWord.translation}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    &ldquo;{todayWord.exampleSentence}&rdquo;
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground text-center py-4">
                  No activity yet. Start learning to see your progress here!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
      >
        <Card className="border-amber-300 dark:border-amber-700/60 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40">
                  <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                Daily Challenge
              </CardTitle>
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {dailyChallenge.title}
              </Badge>
            </div>
            <CardDescription className="text-amber-700/70 dark:text-amber-400/60">
              A new challenge every day — keep your streak alive!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl bg-white/60 dark:bg-black/20 p-4 border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 leading-relaxed">
                {dailyChallenge.description}
              </p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/50 mt-1">
                Complete this challenge with your AI Coach to earn progress!
              </p>
            </div>
            <Button
              onClick={() => {
                addCoachMessage({
                  id: crypto.randomUUID(),
                  role: 'user',
                  content: `🎯 Daily Challenge: ${dailyChallenge.prompt}`,
                  timestamp: new Date(),
                })
                setCoachOpen(true)
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              <Flame className="h-4 w-4 mr-2" />
              Start Challenge
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.8 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: 'Vocabulary Practice', section: 'vocabulary' as const, icon: <BookOpen className="h-5 w-5" /> },
                { label: 'Reading Exercise', section: 'reading' as const, icon: <Target className="h-5 w-5" /> },
                { label: 'Conversation', section: 'conversation' as const, icon: <Sparkles className="h-5 w-5" /> },

                { label: 'Grammar Drill', section: 'grammar' as const, icon: <Dumbbell className="h-5 w-5" /> },
              ].map((action) => (
                <Button
                  key={action.section}
                  variant="outline"
                  className="h-auto py-4 px-3 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-700 transition-colors"
                  onClick={() => setActiveSection(action.section)}
                >
                  <div className="text-emerald-600 dark:text-emerald-400">{action.icon}</div>
                  <span className="text-xs font-medium">{action.label}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
