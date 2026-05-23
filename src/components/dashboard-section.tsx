'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/lib/store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen, Flame, Dumbbell, Target,
  ArrowRight, Volume2, Sparkles, MessageSquare, Clock,
  CheckCircle2, BookmarkPlus
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

// Mock Activity Data
const MOCK_ACTIVITY = [
  { id: 1, title: 'Completed: Common Adjectives', reward: '+10 words', time: '2:14 PM', date: 'TODAY' },
  { id: 2, title: 'Streak extended', reward: 'Day 12', time: '9:01 AM', date: 'TODAY' },
  { id: 3, title: 'Completed: Numbers 1-20', reward: '+15 words', time: '8:45 PM', date: 'YESTERDAY' },
]

export default function DashboardSection() {
  const { 
    setActiveSection, userLevel,
    dashboardStats, setDashboardStats, dashboardTodayWord, setDashboardTodayWord 
  } = useAppStore()
  const displayLevel = userLevel || 'B2'
  
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
          if (cards.length > 0 && !dashboardTodayWord) {
            setDashboardTodayWord(cards[Math.floor(Math.random() * cards.length)])
          }
        }
      } catch {}
      setLoading(false)
    }
    loadData()
  }, [dashboardTodayWord, setDashboardStats, setDashboardTodayWord])

  const dailyGoal = 10
  const vocabStudied = stats?.vocabStudied ?? 0
  const dailyProgress = Math.min(vocabStudied, dailyGoal)
  
  const streak = stats?.streak ?? 0
  const isNewUser = !stats || (stats.vocabStudied === 0 && stats.readingDone === 0 && stats.streak === 0)

  const speakWord = (text: string) => {
    if (typeof window === 'undefined') return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-xl lg:col-span-2" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto">
      {/* SECTION A: Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {getGreeting()} 👋
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            {isNewUser 
              ? "Welcome! Let's start your English journey." 
              : dailyProgress >= dailyGoal 
                ? "You hit today's goal — keep the streak alive!"
                : `You're on day ${streak} · Level ${displayLevel} — ${LEVEL_NAMES[displayLevel] || 'Upper Intermediate'}`}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1.5 text-sm font-medium border-amber-200">
            <Flame className="h-4 w-4 mr-1.5 text-amber-500" />
            {streak} day streak
          </Badge>
          <Badge className={`${LEVEL_COLORS[displayLevel] || LEVEL_COLORS['B2']} px-3 py-1.5 text-sm font-medium border-0`}>
            Level: {displayLevel} — {LEVEL_NAMES[displayLevel] || 'Upper Intermediate'}
          </Badge>
        </div>
      </motion.div>

      {/* SECTION B: HERO "Today's Lesson" */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row min-h-[140px]">
            {/* Left 2/3 */}
            <div className="flex-1 p-6 flex flex-col justify-center bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              {isNewUser ? (
                <>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mb-2 block uppercase">
                    Getting Started
                  </span>
                  <h2 className="text-2xl font-bold mb-2">Start with the basics</h2>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" /> Take a 2-min placement quiz to personalize your path
                  </p>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider mb-2 block uppercase">
                    Today's Lesson
                  </span>
                  <h2 className="text-2xl font-bold mb-2">Common Adjectives</h2>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> 10 new words</span>
                    <span className="text-emerald-300">•</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> ~5 min</span>
                    <span className="text-emerald-300">•</span>
                    <span className="flex items-center gap-1.5"><Target className="h-4 w-4" /> Vocabulary</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs h-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">3 of 10 words</span>
                  </div>
                </>
              )}
            </div>
            {/* Right 1/3 */}
            <div className="md:w-1/3 p-6 flex flex-col justify-center items-start md:items-center bg-emerald-50/30 dark:bg-emerald-950/10 border-t md:border-t-0 md:border-l border-emerald-100 dark:border-emerald-900/30">
              <Button 
                size="lg" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-base py-6"
                onClick={() => setActiveSection('vocabulary')}
              >
                {isNewUser ? "Start placement" : "Start lesson"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="ghost" className="w-full mt-2 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 hover:bg-emerald-100/50">
                Browse all lessons
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* SECTION C: Daily Goal + Word of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Goal (2/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    Daily Goal
                  </h3>
                  <p className="text-muted-foreground mt-1">Learn {dailyGoal} words per day</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    {dailyProgress} <span className="text-lg text-muted-foreground">/ {dailyGoal}</span>
                  </div>
                </div>
              </div>

              {/* 10 Segments Progress */}
              <div className="flex gap-1.5 mb-6">
                {[...Array(dailyGoal)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-3 flex-1 rounded-sm ${i < dailyProgress ? 'bg-emerald-500' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  {/* Mini Calendar */}
                  <div className="flex items-center gap-1.5">
                    {['M','T','W','T','F','S','S'].map((day, i) => {
                      const isToday = i === 5; // Mock Saturday as today
                      const isFilled = i < 5 && streak > 0; // Mock past days based on streak
                      return (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold
                            ${isFilled ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}
                            ${isToday ? 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-background' : ''}
                          `}>
                            {isFilled && <CheckCircle2 className="h-3.5 w-3.5" />}
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium">{day}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-border" />
                  <div className="text-sm">
                    <p className="text-muted-foreground">Best streak: <span className="font-semibold text-foreground">{Math.max(streak, 12)} days</span></p>
                    <p className="text-muted-foreground">Current: <span className="font-semibold text-amber-600 dark:text-amber-400">{streak} days</span></p>
                  </div>
                </div>
                
                <Button variant="secondary" className="w-full sm:w-auto shrink-0" onClick={() => setActiveSection('vocabulary')}>
                  Practice now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Word of the Day (1/3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="h-full border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50/30 to-orange-50/30 dark:from-amber-950/10 dark:to-orange-950/10">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center gap-2 text-amber-700 dark:text-amber-500">
                  <Sparkles className="h-4 w-4" /> Word of the Day
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/40">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </div>

              {todayWord ? (
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-end gap-2 mb-1">
                    <h4 className="text-2xl font-bold">{todayWord.word}</h4>
                    <span className="text-sm text-muted-foreground mb-1 italic">{todayWord.pronunciation}</span>
                  </div>
                  <Badge variant="outline" className="w-fit text-[10px] px-1.5 h-4 mb-3 border-amber-200 dark:border-amber-800/50">{todayWord.partOfSpeech}</Badge>
                  <p className="text-base text-emerald-700 dark:text-emerald-400 font-medium mb-3">
                    {todayWord.translation}
                  </p>
                  <div className="flex items-start gap-2 bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                    <p className="text-sm text-muted-foreground leading-snug">
                      &ldquo;{todayWord.exampleSentence}&rdquo;
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 shrink-0 -mt-1"
                      onClick={() => speakWord(todayWord.exampleSentence)}
                    >
                      <Volume2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                  No word available today.
                </div>
              )}
              
              <div className="pt-4 mt-2 border-t border-amber-200/50 dark:border-amber-800/50 text-center">
                <Button variant="link" className="h-auto p-0 text-amber-700 dark:text-amber-500 text-xs">
                  See all saved words <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* SECTION D: Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight">Your Skills</h2>
          <Button variant="link" className="text-muted-foreground hover:text-foreground h-auto p-0">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'vocabulary', title: 'Vocabulary', level: 'Level 1', progress: 45, next: 'Greetings & introductions', icon: BookOpen, tint: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
            { id: 'reading', title: 'Reading', level: 'Level 2', progress: 60, next: 'A day at the office', icon: Target, tint: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
            { id: 'conversation', title: 'Conversation', level: 'Level 1', progress: 15, next: 'Ordering in a restaurant', icon: MessageSquare, tint: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
            { id: 'grammar', title: 'Grammar', level: 'Level 3', progress: 80, next: 'Present Perfect tense', icon: Dumbbell, tint: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
          ].map((skill) => (
            <Card 
              key={skill.id} 
              className="hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all cursor-pointer group"
              onClick={() => setActiveSection(skill.id as any)}
            >
              <CardContent className="p-5 flex flex-col h-full">
                <div className={`${skill.tint} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <skill.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{skill.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{skill.level}</p>
                
                <div className="mt-auto space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span>Progress</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <Progress value={skill.progress} className="h-1" />
                  </div>
                  
                  <div className="flex items-end justify-between pt-3 border-t border-border">
                    <div className="flex-1 pr-2">
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Next up</p>
                      <p className="text-xs font-medium line-clamp-1">{skill.next}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors shrink-0">
                      <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* SECTION E: Your Journey / Getting Started */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        {isNewUser ? (
          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight mb-4">Get started in 3 steps</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: 1, title: 'Take the placement quiz', meta: '3 min', done: true },
                { step: 2, title: 'Set your daily goal', meta: '1 min', done: false },
                { step: 3, title: 'Complete your first lesson', meta: '5 min', done: false },
              ].map((item) => (
                <Card key={item.step} className={`hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer ${item.done ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''}`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground/30 text-transparent'}`}>
                      {item.done && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${item.done ? 'line-through text-muted-foreground' : ''}`}>{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.meta}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">Your Journey</h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                This week <ArrowRight className="ml-1 w-3 h-3 rotate-90" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                { label: 'Words Learned', value: stats?.vocabStudied ?? 0 },
                { label: 'Day Streak', value: stats?.streak ?? 0 },
                { label: 'Exercises Done', value: stats?.readingDone ?? 0 },
                { label: 'Minutes Practiced', value: Math.round((stats?.vocabStudied ?? 0) * 1.5) },
              ].map((stat, i) => (
                <div key={i} className="px-4 py-2 first:pl-0 last:pr-0">
                  <p className="text-3xl font-bold tracking-tight mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* SECTION F: Recent Activity */}
      {!isNewUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-8 pt-8 border-t border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
            <Button variant="link" className="text-muted-foreground hover:text-foreground h-auto p-0">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <div className="max-w-3xl">
            {['TODAY', 'YESTERDAY'].map(dateGroup => (
              <div key={dateGroup} className="mb-6 last:mb-0">
                <h3 className="text-xs font-bold text-muted-foreground tracking-wider mb-3 uppercase">{dateGroup}</h3>
                <div className="space-y-4">
                  {MOCK_ACTIVITY.filter(a => a.date === dateGroup).map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-1.5 rounded-full shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">{activity.title}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:w-48 sm:justify-end">
                        <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-0 font-medium">
                          {activity.reward}
                        </Badge>
                        <span className="text-xs text-muted-foreground w-16 text-right">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
