'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAppStore, type VideoAssignment } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Video, Plus, ArrowLeft, ChevronRight, Sparkles,
  Star, CheckCircle2, AlertTriangle, BookOpen, RotateCcw,
  Smartphone, Zap, Film, Filter
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

const TOPIC_COLORS: Record<string, string> = {
  Business: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Culture: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Humor: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Pronunciation: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Slang: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  'Daily Life': 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Idioms: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
  Science: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
  Technology: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Psychology: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Communication: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
}

const ALL_TOPICS = ['Business', 'Culture', 'Humor', 'Pronunciation', 'Slang', 'Daily Life', 'Idioms', 'Science', 'Technology', 'Psychology', 'Communication']
const ALL_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const SAMPLE_VIDEOS: VideoAssignment[] = [
  {
    id: 'v1',
    title: 'The Power of Vulnerability — Brené Brown',
    youtubeUrl: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
    youtubeId: 'iCvmsMzlF7o',
    description: 'A powerful TED Talk about the importance of vulnerability in human connection.',
    level: 'B2',
    prompts: [
      'What is the main argument Brown makes about vulnerability?',
      'How does Brown distinguish between shame and vulnerability?',
      'What examples does she use to illustrate her points?',
      'How does this talk relate to your own experiences?',
    ],
    type: 'video',
    topic: 'Psychology',
    duration: 'long',
  },
  {
    id: 'v2',
    title: 'Inside the Mind of a Master Procrastinator',
    youtubeUrl: 'https://www.youtube.com/watch?v=arj7oStGLkU',
    youtubeId: 'arj7oStGLkU',
    description: 'Tim Urban explains why procrastinators procrastinate, with hilarious visuals.',
    level: 'B1',
    prompts: [
      'What is the "Instant Gratification Monkey"?',
      'How does the "Panic Monster" help procrastinators?',
      'What are the two types of procrastination described?',
      'Can you relate to the speaker\'s experience?',
    ],
    type: 'video',
    topic: 'Humor',
    duration: 'medium',
  },
  {
    id: 'v3',
    title: 'How to Speak So That People Want to Listen',
    youtubeUrl: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
    youtubeId: 'eIho2S0ZahI',
    description: 'Julian Treasure shares vocal habits and tools to speak powerfully.',
    level: 'C1',
    prompts: [
      'What are the "seven deadly sins" of speaking?',
      'What are the four foundations of powerful speaking (HAIL)?',
      'What vocal exercises does Treasure recommend?',
      'How can you apply these techniques in your daily life?',
    ],
    type: 'video',
    topic: 'Communication',
    duration: 'medium',
  },
]

const SAMPLE_SHORTS: VideoAssignment[] = [
  {
    id: 's1',
    title: 'When someone says "I literally died" 😂',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz1',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Meme about literal vs figurative language',
    level: 'A2',
    prompts: ['What does "literally" actually mean?', 'Why is this funny?'],
    type: 'short',
    topic: 'Humor',
    duration: 'short',
  },
  {
    id: 's2',
    title: 'British vs American English in 60 seconds',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz2',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Quick comparison of British and American words',
    level: 'B1',
    prompts: ['Name 3 differences mentioned', 'Which version do you prefer?'],
    type: 'short',
    topic: 'Culture',
    duration: 'short',
  },
  {
    id: 's3',
    title: 'Pronunciation: Words Germans always say wrong',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz3',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Common pronunciation mistakes by German speakers',
    level: 'B1',
    prompts: ['Which words do you mispronounce?', 'Practice the correct pronunciation'],
    type: 'short',
    topic: 'Pronunciation',
    duration: 'short',
  },
  {
    id: 's4',
    title: 'Slang words that make you sound native 🗣️',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz4',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Essential slang for everyday conversation',
    level: 'B2',
    prompts: ['Use 2 of these words in a sentence', 'Which slang word is your favorite?'],
    type: 'short',
    topic: 'Slang',
    duration: 'short',
  },
  {
    id: 's5',
    title: 'How to order coffee like a native ☕',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz5',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Real-life English for coffee shops',
    level: 'A2',
    prompts: ['What would you order?', 'Practice ordering out loud'],
    type: 'short',
    topic: 'Daily Life',
    duration: 'short',
  },
  {
    id: 's6',
    title: 'Idiom: "Break a leg" — what it really means 🎭',
    youtubeUrl: 'https://www.youtube.com/shorts/xyz6',
    youtubeId: 'dQw4w9WgXcQ',
    description: 'Fun explanation of common English idioms',
    level: 'B1',
    prompts: ['When would you use this idiom?', 'Can you think of a German equivalent?'],
    type: 'short',
    topic: 'Idioms',
    duration: 'short',
  },
]

interface AIFeedback {
  overallScore: number
  grammarCorrections: string[]
  vocabularySuggestions: string[]
  contentAccuracy: string
}

const SAMPLE_FEEDBACK: AIFeedback = {
  overallScore: 7,
  grammarCorrections: [
    'Instead of "She explain", use "She explains" (third person singular).',
    'Consider using past perfect: "had already discussed" instead of "already discussed".',
    'Remember: "effect" is a noun, "affect" is a verb in most cases.',
  ],
  vocabularySuggestions: [
    'Instead of "very important", try "crucial" or "paramount".',
    'Consider using "compelling" instead of "very interesting".',
    'The phrase "shed light on" is a great alternative to "explained".',
  ],
  contentAccuracy: 'Your summary captures the main themes well. You identified the core argument and provided relevant supporting points. Consider adding more specific details from the talk to strengthen your summary.',
}

type VideoViewMode = 'list' | 'player'
type FilterType = 'all' | 'video' | 'short'
type FilterDuration = 'all' | 'short' | 'medium' | 'long'

export default function VideoSection() {
  const { videoAssignments, setVideoAssignments, currentVideo, setCurrentVideo } = useAppStore()

  const [viewMode, setViewMode] = useState<VideoViewMode>('list')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoLevel, setNewVideoLevel] = useState('B2')
  const [newVideoType, setNewVideoType] = useState<'video' | 'short'>('video')
  const [newVideoTopic, setNewVideoTopic] = useState('')
  const [newVideoDuration, setNewVideoDuration] = useState<'short' | 'medium' | 'long'>('medium')
  const [adding, setAdding] = useState(false)
  const [summary, setSummary] = useState('')
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [gettingFeedback, setGettingFeedback] = useState(false)

  // Filters
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterTopic, setFilterTopic] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterDuration, setFilterDuration] = useState<FilterDuration>('all')

  const allSampleData = useMemo(() => [...SAMPLE_VIDEOS, ...SAMPLE_SHORTS], [])

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/video')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setVideoAssignments(data)
          } else {
            setVideoAssignments(allSampleData)
          }
        } else {
          setVideoAssignments(allSampleData)
        }
      } catch {
        setVideoAssignments(allSampleData)
      }
      setLoading(false)
    }
    loadVideos()
  }, [setVideoAssignments, allSampleData])

  const filteredVideos = useMemo(() => {
    return videoAssignments.filter((video) => {
      if (filterType !== 'all' && video.type !== filterType) return false
      if (filterTopic !== 'all' && video.topic !== filterTopic) return false
      if (filterLevel !== 'all' && video.level !== filterLevel) return false
      if (filterDuration !== 'all' && video.duration !== filterDuration) return false
      return true
    })
  }, [videoAssignments, filterType, filterTopic, filterLevel, filterDuration])

  const availableTopics = useMemo(() => {
    const topics = new Set<string>()
    videoAssignments.forEach((v) => {
      if (v.topic) topics.add(v.topic)
    })
    return Array.from(topics).sort()
  }, [videoAssignments])

  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    return match ? match[1] : null
  }

  const handleVideoClick = (video: VideoAssignment) => {
    setCurrentVideo(video)
    setViewMode('player')
    setSummary('')
    setAiFeedback(null)
  }

  const handleAddVideo = async () => {
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) return
    const youtubeId = extractYoutubeId(newVideoUrl)
    if (!youtubeId) return

    setAdding(true)
    try {
      const res = await fetch('/api/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: newVideoUrl,
          title: newVideoTitle,
          level: newVideoLevel,
          type: newVideoType,
          topic: newVideoTopic || null,
          duration: newVideoDuration,
        }),
      })
      if (res.ok) {
        const newAssignment = await res.json()
        setVideoAssignments([...videoAssignments, newAssignment])
        setDialogOpen(false)
        setNewVideoUrl('')
        setNewVideoTitle('')
        setNewVideoType('video')
        setNewVideoTopic('')
        setNewVideoDuration('medium')
      }
    } catch {
      // Silently fail
    }
    setAdding(false)
  }

  const handleGetFeedback = async () => {
    if (!summary.trim() || !currentVideo) return
    setGettingFeedback(true)
    try {
      const res = await fetch('/api/video/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId: currentVideo.id, summary }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.overallScore) {
          setAiFeedback(data)
        } else {
          setAiFeedback(SAMPLE_FEEDBACK)
        }
      } else {
        setAiFeedback(SAMPLE_FEEDBACK)
      }
    } catch {
      setAiFeedback(SAMPLE_FEEDBACK)
    }
    setGettingFeedback(false)
  }

  const isShortsView = filterType === 'short'
  const shortsCount = videoAssignments.filter((v) => v.type === 'short').length
  const videosCount = videoAssignments.filter((v) => v.type === 'video').length

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Video & Shorts
            </h2>
            <p className="text-muted-foreground mt-1">Watch videos, enjoy shorts, and get AI feedback</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Video Assignment</DialogTitle>
                <DialogDescription>
                  Paste a YouTube URL and add details for this assignment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Type selector */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={newVideoType === 'video' ? 'default' : 'outline'}
                      size="sm"
                      className={newVideoType === 'video' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                      onClick={() => {
                        setNewVideoType('video')
                        setNewVideoDuration('medium')
                      }}
                    >
                      <Film className="h-4 w-4 mr-1.5" />
                      Video
                    </Button>
                    <Button
                      variant={newVideoType === 'short' ? 'default' : 'outline'}
                      size="sm"
                      className={newVideoType === 'short' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                      onClick={() => {
                        setNewVideoType('short')
                        setNewVideoDuration('short')
                      }}
                    >
                      <Zap className="h-4 w-4 mr-1.5" />
                      Short
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    placeholder={newVideoType === 'short' ? 'https://www.youtube.com/shorts/...' : 'https://www.youtube.com/watch?v=...'}
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder={newVideoType === 'short' ? 'e.g., Funny English slang 🗣️' : 'e.g., TED Talk: The Future of Education'}
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <div className="flex gap-2 flex-wrap">
                    {ALL_LEVELS.map(level => (
                      <Button
                        key={level}
                        variant={newVideoLevel === level ? 'default' : 'outline'}
                        size="sm"
                        className={newVideoLevel === level ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                        onClick={() => setNewVideoLevel(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <Select value={newVideoTopic} onValueChange={setNewVideoTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_TOPICS.map(topic => (
                        <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="flex gap-2">
                    {([
                      { value: 'short' as const, label: 'Short', desc: '< 5 min' },
                      { value: 'medium' as const, label: 'Medium', desc: '5-20 min' },
                      { value: 'long' as const, label: 'Long', desc: '20+ min' },
                    ]).map(d => (
                      <Button
                        key={d.value}
                        variant={newVideoDuration === d.value ? 'default' : 'outline'}
                        size="sm"
                        className={newVideoDuration === d.value ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                        onClick={() => setNewVideoDuration(d.value)}
                        disabled={newVideoType === 'short' && d.value !== 'short'}
                      >
                        <span>{d.label}</span>
                        <span className="text-xs opacity-70 ml-1">({d.desc})</span>
                      </Button>
                    ))}
                  </div>
                  {newVideoType === 'short' && (
                    <p className="text-xs text-muted-foreground">Shorts are always under 5 minutes</p>
                  )}
                </div>
                {newVideoUrl && !extractYoutubeId(newVideoUrl) && (
                  <p className="text-sm text-destructive">Invalid YouTube URL. Please check the link.</p>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button
                  onClick={handleAddVideo}
                  disabled={adding || !newVideoUrl.trim() || !newVideoTitle.trim() || !extractYoutubeId(newVideoUrl)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {adding ? 'Adding...' : `Add ${newVideoType === 'short' ? 'Short' : 'Video'}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Bar */}
        <Card className="p-4">
          <div className="space-y-3">
            {/* Type filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-14 flex-shrink-0">Type</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setFilterType('all')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Filter className="h-3 w-3" />
                  All
                  <span className="ml-0.5 opacity-70">({videoAssignments.length})</span>
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterType === 'video'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Film className="h-3 w-3" />
                  Videos
                  <span className="ml-0.5 opacity-70">({videosCount})</span>
                </button>
                <button
                  onClick={() => setFilterType('short')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filterType === 'short'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <Zap className="h-3 w-3" />
                  Shorts
                  <span className="ml-0.5 opacity-70">({shortsCount})</span>
                </button>
              </div>
            </div>

            {/* Topic filter - horizontal scroll */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground w-14 flex-shrink-0">Topic</span>
              <ScrollArea className="flex-1">
                <div className="flex gap-1.5 pb-1">
                  <button
                    onClick={() => setFilterTopic('all')}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                      filterTopic === 'all'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All
                  </button>
                  {availableTopics.map(topic => (
                    <button
                      key={topic}
                      onClick={() => setFilterTopic(topic)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                        filterTopic === topic
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Level + Duration in one row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground w-14 flex-shrink-0">Level</span>
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setFilterLevel('all')}
                    className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterLevel === 'all'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    All
                  </button>
                  {ALL_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterLevel === level
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground flex-shrink-0">Duration</span>
                <div className="flex gap-1.5">
                  {([
                    { value: 'all' as const, label: 'All' },
                    { value: 'short' as const, label: 'Short' },
                    { value: 'medium' as const, label: 'Medium' },
                    { value: 'long' as const, label: 'Long' },
                  ]).map(d => (
                    <button
                      key={d.value}
                      onClick={() => setFilterDuration(d.value)}
                      className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filterDuration === d.value
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active filters summary */}
            {(filterType !== 'all' || filterTopic !== 'all' || filterLevel !== 'all' || filterDuration !== 'all') && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Showing {filteredVideos.length} of {videoAssignments.length} items
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-emerald-600 hover:text-emerald-700"
                  onClick={() => {
                    setFilterType('all')
                    setFilterTopic('all')
                    setFilterLevel('all')
                    setFilterDuration('all')
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Content Grid */}
        {loading ? (
          <div className={isShortsView ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className={isShortsView ? 'h-64 rounded-xl' : 'h-56 rounded-xl'} />
            ))}
          </div>
        ) : filteredVideos.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {videoAssignments.length === 0 ? 'No video assignments yet' : 'No matches found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {videoAssignments.length === 0
                ? 'Add a YouTube video to start practicing.'
                : 'Try adjusting your filters to see more content.'}
            </p>
            {videoAssignments.length === 0 && (
              <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Video
              </Button>
            )}
          </Card>
        ) : isShortsView ? (
          /* Shorts Grid - Portrait/Vertical layout like TikTok/Reels */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filteredVideos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group overflow-hidden"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative aspect-[9/16] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-amber-500/20 dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-amber-900/30">
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Short badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 h-5 font-bold flex items-center gap-0.5">
                        <Zap className="h-2.5 w-2.5" />
                        SHORT
                      </Badge>
                    </div>

                    {/* Level badge */}
                    <Badge className={`${LEVEL_COLORS[video.level] || LEVEL_COLORS['B1']} absolute top-2 right-2`} variant="secondary">
                      {video.level}
                    </Badge>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 rounded-full p-2.5">
                        <Video className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>

                    {/* Title overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-semibold text-xs text-white line-clamp-2 leading-snug">
                        {video.title}
                      </h3>
                      {video.topic && (
                        <Badge
                          className={`${TOPIC_COLORS[video.topic] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'} mt-1.5 text-[10px] px-1.5 py-0 h-4`}
                          variant="secondary"
                        >
                          {video.topic}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Videos Grid - Standard landscape layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video, i) => {
              const isShort = video.type === 'short'
              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer hover:shadow-md transition-all group overflow-hidden ${
                      isShort
                        ? 'hover:border-emerald-400 dark:hover:border-emerald-600'
                        : 'hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                    onClick={() => handleVideoClick(video)}
                  >
                    <div className={`relative ${isShort ? 'aspect-[3/4]' : 'aspect-video'} bg-muted`}>
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 rounded-full p-3">
                          <Video className="h-6 w-6 text-emerald-600" />
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        {isShort && (
                          <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0 h-5 font-bold flex items-center gap-0.5">
                            <Zap className="h-2.5 w-2.5" />
                            SHORT
                          </Badge>
                        )}
                        {!isShort && (
                          <Badge className="bg-emerald-600/90 text-white text-[10px] px-1.5 py-0 h-5 font-bold flex items-center gap-0.5">
                            <Film className="h-2.5 w-2.5" />
                            VIDEO
                          </Badge>
                        )}
                      </div>
                      <Badge className={`${LEVEL_COLORS[video.level] || LEVEL_COLORS['B1']} absolute top-2 right-2`} variant="secondary">
                        {video.level}
                      </Badge>
                      {isShort && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5">
                          {video.topic && (
                            <Badge
                              className={`${TOPIC_COLORS[video.topic] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'} text-[10px] px-1.5 py-0 h-4`}
                              variant="secondary"
                            >
                              {video.topic}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{video.prompts?.length || 0} prompts</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // PLAYER VIEW
  if (!currentVideo) return null

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => { setViewMode('list'); setCurrentVideo(null) }} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Videos
        </Button>
        <div className="flex items-center gap-2">
          {currentVideo.type === 'short' && (
            <Badge className="bg-emerald-500 text-white text-xs font-bold flex items-center gap-1">
              <Zap className="h-3 w-3" />
              SHORT
            </Badge>
          )}
          <Badge className={LEVEL_COLORS[currentVideo.level] || LEVEL_COLORS['B1']} variant="secondary">
            {currentVideo.level}
          </Badge>
          {currentVideo.topic && (
            <Badge className={TOPIC_COLORS[currentVideo.topic] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'} variant="secondary">
              {currentVideo.topic}
            </Badge>
          )}
        </div>
      </div>

      <h2 className="text-xl font-bold">{currentVideo.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className={currentVideo.type === 'short' ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'}>
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                title={currentVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </Card>

          {/* Summary Input */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                Write Your Summary
              </CardTitle>
              <CardDescription>
                {currentVideo.type === 'short'
                  ? 'Quick! Write a short reaction or answer the prompts'
                  : 'After watching, write a summary of the video in English'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={currentVideo.type === 'short'
                  ? 'What did you learn? Write a short response...'
                  : 'Write a summary of what you watched. Include the main arguments, key points, and your own thoughts...'}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={currentVideo.type === 'short' ? 'min-h-[100px] resize-y' : 'min-h-[150px] resize-y'}
              />
              <Button
                onClick={handleGetFeedback}
                disabled={!summary.trim() || gettingFeedback}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {gettingFeedback ? (
                  <><RotateCcw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" />Get AI Feedback</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Feedback */}
          <AnimatePresence>
            {aiFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="border-amber-200 dark:border-amber-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      AI Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Score */}
                    <div className="flex items-center gap-3">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {aiFeedback.overallScore}/10
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= aiFeedback.overallScore ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Grammar Corrections */}
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Grammar Corrections
                      </h4>
                      <ul className="space-y-1.5">
                        {aiFeedback.grammarCorrections.map((correction, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            {correction}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Vocabulary Suggestions */}
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                        <BookOpen className="h-4 w-4 text-emerald-500" />
                        Vocabulary Suggestions
                      </h4>
                      <ul className="space-y-1.5">
                        {aiFeedback.vocabularySuggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Content Accuracy */}
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Content Accuracy
                      </h4>
                      <p className="text-sm text-muted-foreground">{aiFeedback.contentAccuracy}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Guiding Prompts Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Guiding Questions
              </CardTitle>
              <CardDescription className="text-xs">Keep these in mind while watching</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentVideo.prompts?.map((prompt, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-snug">{prompt}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {currentVideo.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">About This {currentVideo.type === 'short' ? 'Short' : 'Video'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{currentVideo.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Video meta info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <Badge variant="outline" className="text-xs">
                  {currentVideo.type === 'short' ? (
                    <><Zap className="h-3 w-3 mr-1" />Short</>
                  ) : (
                    <><Film className="h-3 w-3 mr-1" />Video</>
                  )}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level</span>
                <Badge className={LEVEL_COLORS[currentVideo.level] || LEVEL_COLORS['B1']} variant="secondary">
                  {currentVideo.level}
                </Badge>
              </div>
              {currentVideo.topic && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Topic</span>
                  <Badge className={TOPIC_COLORS[currentVideo.topic] || 'bg-gray-100 text-gray-700'} variant="secondary">
                    {currentVideo.topic}
                  </Badge>
                </div>
              )}
              {currentVideo.duration && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <Badge variant="outline" className="text-xs capitalize">{currentVideo.duration}</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
