import { create } from 'zustand'

export type AppSection = 'dashboard' | 'vocabulary' | 'reading' | 'conversation' | 'video' | 'grammar'

export interface VocabDeck {
  id: string
  name: string
  description: string | null
  level: string
  category: string | null
  icon: string | null
  cards?: VocabCard[]
  _count?: { cards: number }
}

export interface VocabCard {
  id: string
  deckId: string
  word: string
  translation: string
  pronunciation: string | null
  partOfSpeech: string | null
  exampleSentence: string | null
  exampleTranslation: string | null
  difficulty: number
  notes: string | null
  progress?: VocabProgress
}

export interface VocabProgress {
  id: string
  cardId: string
  correctness: number
  attempts: number
  lastReviewedAt: string | null
  nextReviewAt: string
  interval: number
  easeFactor: number
  status: string
}

export interface ReadingExercise {
  id: string
  title: string
  content: string
  level: string
  category: string | null
  questions: Question[]
  vocabularyHints?: VocabHint[]
}

export interface Question {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface VocabHint {
  word: string
  meaning: string
}

export interface VideoAssignment {
  id: string
  title: string
  youtubeUrl: string
  youtubeId: string
  description: string | null
  level: string
  prompts: string[]
  type?: 'video' | 'short'
  topic?: string
  duration?: 'short' | 'medium' | 'long'
}

export interface VideoSummary {
  id: string
  assignmentId: string
  summary: string
  aiFeedback: string | null
  aiScore: number | null
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface LearningStats {
  id: string
  date: string
  vocabStudied: number
  readingDone: number
  videosWatched: number
  conversationMins: number
  streak: number
}

interface AppState {
  // Navigation
  activeSection: AppSection
  setActiveSection: (section: AppSection) => void

  // AI Coach
  coachOpen: boolean
  setCoachOpen: (open: boolean) => void
  coachMessages: ChatMessage[]
  addCoachMessage: (message: ChatMessage) => void
  clearCoachMessages: () => void

  // Vocabulary
  vocabDecks: VocabDeck[]
  setVocabDecks: (decks: VocabDeck[]) => void
  currentDeck: VocabDeck | null
  setCurrentDeck: (deck: VocabDeck | null) => void
  practiceCards: VocabCard[]
  setPracticeCards: (cards: VocabCard[]) => void
  currentCardIndex: number
  setCurrentCardIndex: (index: number) => void
  showAnswer: boolean
  setShowAnswer: (show: boolean) => void

  // Reading
  readingExercises: ReadingExercise[]
  setReadingExercises: (exercises: ReadingExercise[]) => void
  currentExercise: ReadingExercise | null
  setCurrentExercise: (exercise: ReadingExercise | null) => void

  // Conversation
  conversationMessages: ChatMessage[]
  addConversationMessage: (message: ChatMessage) => void
  clearConversationMessages: () => void
  currentTopic: string
  setCurrentTopic: (topic: string) => void

  // Video
  videoAssignments: VideoAssignment[]
  setVideoAssignments: (assignments: VideoAssignment[]) => void
  currentVideo: VideoAssignment | null
  setCurrentVideo: (video: VideoAssignment | null) => void

  // Stats
  learningStats: LearningStats | null
  setLearningStats: (stats: LearningStats | null) => void

  // User level & placement
  userLevel: string | null
  setUserLevel: (level: string) => void
  hasCompletedPlacement: boolean
  setHasCompletedPlacement: (v: boolean) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  activeSection: 'dashboard',
  setActiveSection: (section) => set({ activeSection: section }),

  // AI Coach
  coachOpen: false,
  setCoachOpen: (open) => set({ coachOpen: open }),
  coachMessages: [],
  addCoachMessage: (message) =>
    set((state) => ({ coachMessages: [...state.coachMessages, message] })),
  clearCoachMessages: () => set({ coachMessages: [] }),

  // Vocabulary
  vocabDecks: [],
  setVocabDecks: (decks) => set({ vocabDecks: decks }),
  currentDeck: null,
  setCurrentDeck: (deck) => set({ currentDeck: deck }),
  practiceCards: [],
  setPracticeCards: (cards) => set({ practiceCards: cards }),
  currentCardIndex: 0,
  setCurrentCardIndex: (index) => set({ currentCardIndex: index }),
  showAnswer: false,
  setShowAnswer: (show) => set({ showAnswer: show }),

  // Reading
  readingExercises: [],
  setReadingExercises: (exercises) => set({ readingExercises: exercises }),
  currentExercise: null,
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),

  // Conversation
  conversationMessages: [],
  addConversationMessage: (message) =>
    set((state) => ({ conversationMessages: [...state.conversationMessages, message] })),
  clearConversationMessages: () => set({ conversationMessages: [] }),
  currentTopic: '',
  setCurrentTopic: (topic) => set({ currentTopic: topic }),

  // Video
  videoAssignments: [],
  setVideoAssignments: (assignments) => set({ videoAssignments: assignments }),
  currentVideo: null,
  setCurrentVideo: (video) => set({ currentVideo: video }),

  // Stats
  learningStats: null,
  setLearningStats: (stats) => set({ learningStats: stats }),

  // User level & placement
  userLevel: null,
  setUserLevel: (level) => set({ userLevel: level }),
  hasCompletedPlacement: false,
  setHasCompletedPlacement: (v) => set({ hasCompletedPlacement: v }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
