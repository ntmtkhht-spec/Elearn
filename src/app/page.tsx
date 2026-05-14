'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppStore, type AppSection } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard, BookOpen, FileText, MessageCircle,
  Video, PenTool, Menu, Moon, Sun, Sparkles,
  ChevronDown, Trophy, Lock, CheckCircle2, Target, LogOut
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamic imports for code splitting
const DashboardSection = dynamic(() => import('@/components/dashboard-section'), { ssr: false })
const VocabSection = dynamic(() => import('@/components/vocab-section'), { ssr: false })
const ReadingSection = dynamic(() => import('@/components/reading-section'), { ssr: false })
const ConversationSection = dynamic(() => import('@/components/conversation-section'), { ssr: false })
const VideoSection = dynamic(() => import('@/components/video-section'), { ssr: false })
const GrammarSection = dynamic(() => import('@/components/grammar-section'), { ssr: false })
const AICoach = dynamic(() => import('@/components/ai-coach'), { ssr: false })
const PlacementTest = dynamic(() => import('@/components/placement-test'), { ssr: false })
const LevelUpTest = dynamic(() => import('@/components/level-up-test'), { ssr: false })

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const LEVEL_NAMES: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
}

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  A2: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  B1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  B2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  C1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  C2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

interface NavItem {
  id: AppSection
  label: string
  icon: React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'vocabulary', label: 'Vocabulary', icon: <BookOpen className="h-5 w-5" /> },
  { id: 'reading', label: 'Reading', icon: <FileText className="h-5 w-5" /> },
  { id: 'conversation', label: 'Conversation', icon: <MessageCircle className="h-5 w-5" /> },
  { id: 'video', label: 'Video', icon: <Video className="h-5 w-5" /> },
  { id: 'grammar', label: 'Grammar', icon: <PenTool className="h-5 w-5" /> },
]

function LevelBadge({ userLevel, onClick }: { userLevel: string | null; onClick: () => void }) {
  const displayLevel = userLevel || 'B2'
  const levelName = LEVEL_NAMES[displayLevel] || 'Upper Intermediate'
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
    >
      <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{displayLevel}</span>
      </div>
      <div className="text-left">
        <p className="text-xs font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          Your Level
        </p>
        <p className="text-[10px] text-muted-foreground">{levelName}</p>
      </div>
    </button>
  )
}

function SidebarNav({
  activeSection,
  onNavigate,
}: {
  activeSection: AppSection
  onNavigate: (section: AppSection) => void
}) {
  return (
    <nav className="space-y-1 px-3">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeSection === item.id
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span className={activeSection === item.id ? 'text-emerald-600 dark:text-emerald-400' : ''}>
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleToggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: next }),
    }).catch(() => {})
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-lg"
      onClick={handleToggle}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}


function LogOutButton() {
  const handleLogout = async () => {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }
  return (
    <Button
      variant='ghost'
      size='icon'
      className='h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground'
      onClick={handleLogout}
      title='Sign out'
    >
      <LogOut className='h-4 w-4' />
    </Button>
  )
}
function LevelChangeDialog({
  open,
  onOpenChange,
  userLevel,
  setUserLevel,
  onStartLevelUpTest,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  userLevel: string | null
  setUserLevel: (level: string) => void
  onStartLevelUpTest: (targetLevel: string) => void
}) {
  const currentLevel = userLevel || 'B2'
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel)
  const canGoDown = currentIndex > 0
  const canGoUp = currentIndex < LEVEL_ORDER.length - 1

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Change Your Level
          </DialogTitle>
          <DialogDescription>
            Your current level is <strong>{currentLevel} — {LEVEL_NAMES[currentLevel]}</strong>.
            Going down is instant. Going up requires passing a test.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current level indicator */}
          <div className="flex items-center justify-center gap-2 py-3">
            {LEVEL_ORDER.map((level, i) => (
              <div
                key={level}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-all ${
                  level === currentLevel
                    ? `${LEVEL_COLORS[level]} ring-2 ring-offset-2 ring-emerald-400 dark:ring-offset-gray-900`
                    : i < currentIndex
                      ? 'bg-muted/50 text-muted-foreground'
                      : 'bg-muted/30 text-muted-foreground/50'
                }`}
              >
                <span className="text-xs font-bold">{level}</span>
                {level === currentLevel && (
                  <CheckCircle2 className="h-3 w-3" />
                )}
              </div>
            ))}
          </div>

          {/* Go down */}
          {canGoDown && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Go down (instant)
              </p>
              {LEVEL_ORDER.slice(0, currentIndex).reverse().map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    setUserLevel(level)
                    onOpenChange(false)
                  }}
                >
                  <Badge className={LEVEL_COLORS[level]} variant="secondary">{level}</Badge>
                  <span className="text-sm">{LEVEL_NAMES[level]}</span>
                  <ChevronDown className="h-4 w-4 ml-auto text-muted-foreground" />
                </Button>
              ))}
            </div>
          )}

          {/* Go up */}
          {canGoUp && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Go up (requires test)
              </p>
              {LEVEL_ORDER.slice(currentIndex + 1).map((level) => (
                <Button
                  key={level}
                  variant="outline"
                  className="w-full justify-start gap-3 h-auto py-3"
                  onClick={() => {
                    onOpenChange(false)
                    onStartLevelUpTest(level)
                  }}
                >
                  <Badge className={LEVEL_COLORS[level]} variant="secondary">{level}</Badge>
                  <span className="text-sm">{LEVEL_NAMES[level]}</span>
                  <Trophy className="h-4 w-4 ml-auto text-amber-500" />
                </Button>
              ))}
            </div>
          )}

          {!canGoDown && !canGoUp && (
            <p className="text-sm text-muted-foreground text-center py-4">
              You&apos;re already at the highest level!
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SectionContent({ section }: { section: AppSection }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="h-full"
      >
        {section === 'dashboard' && <DashboardSection />}
        {section === 'vocabulary' && <VocabSection />}
        {section === 'reading' && <ReadingSection />}
        {section === 'conversation' && <ConversationSection />}
        {section === 'video' && <VideoSection />}
        {section === 'grammar' && <GrammarSection />}
      </motion.div>
    </AnimatePresence>
  )
}

export default function Home() {
  const { activeSection, setActiveSection, userLevel, setUserLevel, hasCompletedPlacement, setHasCompletedPlacement } = useAppStore()
  const { setTheme } = useTheme()

  const [levelDialogOpen, setLevelDialogOpen] = useState(false)
  const [levelUpTestTarget, setLevelUpTestTarget] = useState<string | null>(null)
  const [showLevelUpTest, setShowLevelUpTest] = useState(false)
  const profileLoaded = useRef(false)
  const [profileLoading, setProfileLoading] = useState(true)

  // Load profile from DB on mount
  useEffect(() => {
    if (profileLoaded.current) return
    profileLoaded.current = true
    fetch('/api/user/profile')
      .then(r => r.json())
      .then(data => {
        if (data.userLevel) setUserLevel(data.userLevel)
        if (data.hasCompletedPlacement !== undefined) setHasCompletedPlacement(data.hasCompletedPlacement)
        if (data.theme) setTheme(data.theme)
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false))
  }, [setUserLevel, setHasCompletedPlacement, setTheme])

  // Save level to DB when it changes
  const prevLevel = useRef(userLevel)
  useEffect(() => {
    if (!profileLoaded.current || userLevel === prevLevel.current) return
    prevLevel.current = userLevel
    if (!userLevel) return
    fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userLevel }),
    }).catch(() => {})
  }, [userLevel])

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section)
  }

  const handleStartLevelUpTest = (targetLevel: string) => {
    setLevelUpTestTarget(targetLevel)
    setShowLevelUpTest(true)
  }

  const handleLevelUpPass = () => {
    if (levelUpTestTarget) {
      setUserLevel(levelUpTestTarget)
    }
    setLevelUpTestTarget(null)
    setShowLevelUpTest(false)
  }

  const handleLevelUpFail = () => {
    setLevelUpTestTarget(null)
    setShowLevelUpTest(false)
  }

  const handleLevelUpCancel = () => {
    setLevelUpTestTarget(null)
    setShowLevelUpTest(false)
  }

  // Show spinner while loading profile
  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  // Show placement test if not completed
  if (!hasCompletedPlacement) {
    return <PlacementTest />
  }

  // Show level-up test if active
  if (showLevelUpTest && levelUpTestTarget) {
    return (
      <LevelUpTest
        targetLevel={levelUpTestTarget}
        currentLevel={userLevel || 'B2'}
        onPass={handleLevelUpPass}
        onFail={handleLevelUpFail}
        onCancel={handleLevelUpCancel}
      />
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Level Change Dialog */}
      <LevelChangeDialog
        open={levelDialogOpen}
        onOpenChange={setLevelDialogOpen}
        userLevel={userLevel}
        setUserLevel={setUserLevel}
        onStartLevelUpTest={handleStartLevelUpTest}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-border bg-card">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">FluentPath</h1>
            <p className="text-[10px] text-muted-foreground leading-none">Smart English Learning</p>
          </div>
        </div>

        <Separator />

        {/* Navigation */}
        <div className="flex-1 py-4 overflow-y-auto">
          <p className="px-6 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Learn
          </p>
          <SidebarNav activeSection={activeSection} onNavigate={handleNavigate} />
        </div>

        <Separator />

        {/* Bottom section */}
        <div className="p-4 flex items-center justify-between">
          <LevelBadge userLevel={userLevel} onClick={() => setLevelDialogOpen(true)} />
          <div className='flex items-center gap-1'>
            <ThemeToggle />
            <LogOutButton />
          </div>
        </div>
      </aside>

      {/* Mobile Header + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center gap-2.5 px-5 py-5">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold tracking-tight">FluentPath</h1>
                  <p className="text-[10px] text-muted-foreground leading-none">Smart English Learning</p>
                </div>
              </div>
              <Separator />
              <div className="py-4">
                <SidebarNav activeSection={activeSection} onNavigate={handleNavigate} />
              </div>
              <Separator />
              <div className="p-4 flex items-center justify-between">
                <LevelBadge userLevel={userLevel} onClick={() => setLevelDialogOpen(true)} />
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-sm">FluentPath</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setLevelDialogOpen(true)}
          >
            <Badge className={LEVEL_COLORS[userLevel || 'B2']} variant="secondary">
              {userLevel || 'B2'}
            </Badge>
          </Button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <SectionContent section={activeSection} />
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-bottom">
          <div className="flex items-center justify-around h-14 px-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors min-w-[3.5rem] ${
                  activeSection === item.id
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="h-5 w-5">{item.icon}</span>
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* AI Coach (always available) */}
      <AICoach />
    </div>
  )
}
