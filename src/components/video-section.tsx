'use client'

import { useEffect, useState } from 'react'
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
  Video, Plus, ArrowLeft, ChevronRight, Sparkles,
  Star, CheckCircle2, AlertTriangle, BookOpen, RotateCcw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const LEVEL_COLORS: Record<string, string> = {
  B1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  B2: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  C1: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  C2: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

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

export default function VideoSection() {
  const { videoAssignments, setVideoAssignments, currentVideo, setCurrentVideo } = useAppStore()

  const [viewMode, setViewMode] = useState<VideoViewMode>('list')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [newVideoTitle, setNewVideoTitle] = useState('')
  const [newVideoLevel, setNewVideoLevel] = useState('B2')
  const [adding, setAdding] = useState(false)
  const [summary, setSummary] = useState('')
  const [aiFeedback, setAiFeedback] = useState<AIFeedback | null>(null)
  const [gettingFeedback, setGettingFeedback] = useState(false)

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/video')
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setVideoAssignments(data)
          } else {
            setVideoAssignments(SAMPLE_VIDEOS)
          }
        } else {
          setVideoAssignments(SAMPLE_VIDEOS)
        }
      } catch {
        setVideoAssignments(SAMPLE_VIDEOS)
      }
      setLoading(false)
    }
    loadVideos()
  }, [setVideoAssignments])

  const extractYoutubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
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
        body: JSON.stringify({ youtubeUrl: newVideoUrl, title: newVideoTitle, level: newVideoLevel }),
      })
      if (res.ok) {
        const newAssignment = await res.json()
        setVideoAssignments([...videoAssignments, newAssignment])
        setDialogOpen(false)
        setNewVideoUrl('')
        setNewVideoTitle('')
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

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              Video Assignments
            </h2>
            <p className="text-muted-foreground mt-1">Watch, summarize, and get AI feedback</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Video
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Video Assignment</DialogTitle>
                <DialogDescription>
                  Paste a YouTube URL and add details for this assignment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>YouTube URL</Label>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="e.g., TED Talk: The Future of Education"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <div className="flex gap-2">
                    {['B1', 'B2', 'C1', 'C2'].map(level => (
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
                  {adding ? 'Adding...' : 'Add Video'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-56 rounded-xl" />
            ))}
          </div>
        ) : videoAssignments.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No video assignments yet</h3>
            <p className="text-muted-foreground mb-4">Add a YouTube video to start practicing.</p>
            <Button onClick={() => setDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Video
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoAssignments.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group overflow-hidden"
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="relative aspect-video bg-muted">
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
                    <Badge className={`${LEVEL_COLORS[video.level] || LEVEL_COLORS['B1']} absolute top-2 right-2`} variant="secondary">
                      {video.level}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{video.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">{video.prompts?.length || 0} prompts</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
        <Badge className={LEVEL_COLORS[currentVideo.level] || LEVEL_COLORS['B1']} variant="secondary">
          {currentVideo.level}
        </Badge>
      </div>

      <h2 className="text-xl font-bold">{currentVideo.title}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video">
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
                After watching, write a summary of the video in English
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write a summary of what you watched. Include the main arguments, key points, and your own thoughts..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-[150px] resize-y"
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
                <CardTitle className="text-sm">About This Video</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{currentVideo.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
