'use client'

import { useAppStore, type AppSection } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  LayoutDashboard, BookOpen, FileText, MessageCircle,
  Video, PenTool, Menu, Moon, Sun, Sparkles
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
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 rounded-lg"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
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
  const { activeSection, setActiveSection } = useAppStore()

  const handleNavigate = (section: AppSection) => {
    setActiveSection(section)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">B2</span>
            </div>
            <div>
              <p className="text-xs font-medium">Your Level</p>
              <p className="text-[10px] text-muted-foreground">Upper Intermediate</p>
            </div>
          </div>
          <ThemeToggle />
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
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">B2</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium">Your Level</p>
                    <p className="text-[10px] text-muted-foreground">Upper Intermediate</p>
                  </div>
                </div>
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

          <ThemeToggle />
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <SectionContent section={activeSection} />
        </main>
      </div>

      {/* AI Coach (always available) */}
      <AICoach />
    </div>
  )
}
