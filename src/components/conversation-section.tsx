'use client'

import { useEffect, useState, useRef } from 'react'
import { useAppStore, type ChatMessage } from '@/lib/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  MessageCircle, Send, Plus, ArrowLeft, Lightbulb,
  Sparkles, Star, AlertCircle, RotateCcw, Mic, MicOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SCENARIOS = [
  { id: 'job-interview', name: 'Job Interview', icon: '💼', description: 'Practice common interview questions and responses' },
  { id: 'travel', name: 'Travel & Hotel', icon: '✈️', description: 'Book hotels, ask directions, handle travel situations' },
  { id: 'small-talk', name: 'Small Talk', icon: '☕', description: 'Casual conversations at social events' },
  { id: 'business-meeting', name: 'Business Meeting', icon: '📊', description: 'Present ideas, negotiate, discuss strategies' },
  { id: 'debate', name: 'Debate', icon: '🎤', description: 'Express opinions and argue a position' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍽️', description: 'Order food, make complaints, ask for the bill' },
  { id: 'doctor', name: 'Doctor Visit', icon: '🏥', description: 'Describe symptoms, understand medical advice' },
  { id: 'customer-service', name: 'Customer Service', icon: '📞', description: 'Return items, file complaints, request help' },
]

export default function ConversationSection() {
  const {
    conversationMessages, addConversationMessage, clearConversationMessages,
    currentTopic, setCurrentTopic,
  } = useAppStore()

  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [tip, setTip] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [gettingFeedback, setGettingFeedback] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversationMessages])

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSpeechSupported(true)
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognitionAPI()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          setInputMessage(prev => prev + finalTranscript)
        } else if (interimTranscript) {
          setInputMessage(prev => {
            const base = prev.replace(/\[.*?\]$/, '')
            return base + '[' + interimTranscript + ']'
          })
        }
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      // Clean up interim text markers
      setInputMessage(prev => prev.replace(/\[.*?\]$/, ''))
    } else {
      setInputMessage('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleStartConversation = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId)
    if (!scenario) return
    setSelectedScenario(scenarioId)
    setCurrentTopic(scenario.name)
    clearConversationMessages()
    setTip(null)
    setShowFeedback(false)

    // Add initial AI greeting
    const greeting = getGreetingForScenario(scenarioId)
    addConversationMessage({
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
    })
  }

  const getGreetingForScenario = (scenarioId: string): string => {
    const greetings: Record<string, string> = {
      'job-interview': 'Hello! Welcome to the interview. Please have a seat. Let me start by asking — could you tell me a little bit about yourself and why you\'re interested in this position?',
      'travel': 'Good afternoon! Welcome to the Grand Hotel. How can I help you today? Do you have a reservation?',
      'small-talk': 'Hey there! Great party, isn\'t it? I don\'t think we\'ve met before — I\'m Alex. How do you know the host?',
      'business-meeting': 'Good morning, everyone. Thank you for joining today\'s meeting. Let\'s start by reviewing the Q3 results. Who would like to begin?',
      'debate': 'I believe that remote work has significantly improved productivity for most companies. The flexibility it offers far outweighs any drawbacks. What\'s your take on this?',
      'restaurant': 'Good evening! Welcome to La Bella. Here\'s our menu. Can I start you off with something to drink while you decide?',
      'doctor': 'Good morning. What brings you in today? Can you describe your symptoms and how long you\'ve been experiencing them?',
      'customer-service': 'Thank you for calling customer support. My name is Jamie. How can I assist you today?',
    }
    return greetings[scenarioId] || 'Hello! Let\'s start our conversation. How are you doing today?'
  }

  const handleSendMessage = async () => {
    // Clean up any interim text markers before sending
    const cleanMessage = inputMessage.replace(/\[.*?\]/g, '').trim()
    if (!cleanMessage || sending) return

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: cleanMessage,
      timestamp: new Date(),
    }
    addConversationMessage(userMessage)
    setInputMessage('')
    setSending(true)
    setTip(null)

    try {
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanMessage,
          topic: currentTopic,
          scenario: selectedScenario,
          history: conversationMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        addConversationMessage({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.message || data.content || "That's interesting! Can you tell me more?",
          timestamp: new Date(),
        })
        if (data.tip) setTip(data.tip)
        else setTip(getRandomTip())
      } else {
        // Fallback responses
        const fallbacks = [
          "That's a great point! Could you elaborate on that a bit more?",
          "Interesting perspective! How would you handle a situation where that approach doesn't work?",
          "I see what you mean. Can you give me a specific example?",
          "Good answer! Now, let me ask you something a bit more challenging...",
        ]
        addConversationMessage({
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: fallbacks[Math.floor(Math.random() * fallbacks.length)],
          timestamp: new Date(),
        })
        setTip(getRandomTip())
      }
    } catch {
      addConversationMessage({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: "I'm sorry, could you repeat that? I want to make sure I understand you correctly.",
        timestamp: new Date(),
      })
      setTip(getRandomTip())
    }
    setSending(false)
  }

  const getRandomTip = (): string => {
    const tips = [
      '💡 Try using "I would argue that..." instead of "I think" for more persuasive language.',
      '💡 Consider using "Furthermore" or "Moreover" to add points to your argument.',
      '💡 "In my experience" sounds more natural than "According to my experience".',
      '💡 Try the phrase "I couldn\'t agree more" to express strong agreement.',
      '💡 Use "On the other hand" to introduce a contrasting viewpoint.',
      '💡 "I\'d like to point out that..." is a polite way to emphasize something.',
      '💡 Instead of "I don\'t know", try "I\'m not entirely sure, but..." for a more professional tone.',
      '💡 The phrase "As far as I\'m concerned" is a natural way to express your opinion.',
    ]
    return tips[Math.floor(Math.random() * tips.length)]
  }

  const handleGetFeedback = async () => {
    setGettingFeedback(true)
    try {
      // Use conversation history to generate feedback
      const lastMessages = conversationMessages.slice(-10)
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Please provide overall feedback on my English in this conversation.',
          topic: currentTopic,
          scenario: selectedScenario,
          history: lastMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setFeedback(data.message || data.content || generateFallbackFeedback())
      } else {
        setFeedback(generateFallbackFeedback())
      }
    } catch {
      setFeedback(generateFallbackFeedback())
    }
    setGettingFeedback(false)
    setShowFeedback(true)
  }

  const generateFallbackFeedback = (): string => {
    return `## Conversation Feedback

**Overall Performance:** Great effort! You maintained the conversation well and showed good comprehension.

**Grammar:** Your sentence structure was mostly correct. Watch out for article usage (a/an/the) in longer sentences.

**Vocabulary:** Good range of vocabulary! Try incorporating more transitional phrases like "nevertheless" and "consequently" to sound more fluent.

**Fluency:** Your responses were natural and appropriate for the context. Continue practicing with different scenarios to build confidence.

**Suggestions:**
- Practice using conditional sentences (If I were you, I would...)
- Try using more phrasal verbs in casual conversations
- Work on intonation when asking questions

Keep up the excellent work! 🌟`
  }

  // SCENARIO SELECTOR
  if (!selectedScenario) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            Conversation Practice
          </h2>
          <p className="text-muted-foreground mt-1">Practice real conversations with an AI partner</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {SCENARIOS.map((scenario, i) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group h-full"
                onClick={() => handleStartConversation(scenario.id)}
              >
                <CardContent className="p-5 flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-3">{scenario.icon}</div>
                  <h3 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {scenario.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {conversationMessages.length > 0 && (
          <Card className="p-6 text-center border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              You have an ongoing conversation. Would you like to continue or start fresh?
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  const lastScenario = SCENARIOS.find(s => s.name === currentTopic)
                  if (lastScenario) setSelectedScenario(lastScenario.id)
                }}
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  if (currentTopic) {
                    const scenario = SCENARIOS.find(s => s.name === currentTopic)
                    if (scenario) handleStartConversation(scenario.id)
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" /> New Conversation
              </Button>
            </div>
          </Card>
        )}
      </div>
    )
  }

  // FEEDBACK VIEW
  if (showFeedback) {
    return (
      <div className="space-y-6 p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => { setSelectedScenario(null); setShowFeedback(false) }} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> New Conversation
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Conversation Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {feedback.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>
                  if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mt-2">{line.replace(/\*\*/g, '')}</p>
                  if (line.startsWith('**')) return <p key={i} className="mt-1"><strong>{line.split('**')[1]}</strong>{line.split('**').slice(2).join('')}</p>
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 text-sm">{line.replace('- ', '')}</li>
                  if (line.trim() === '') return <br key={i} />
                  return <p key={i} className="text-sm">{line}</p>
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Button
          onClick={() => { setSelectedScenario(null); setShowFeedback(false) }}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Start New Conversation
        </Button>
      </div>
    )
  }

  // CHAT VIEW
  const scenario = SCENARIOS.find(s => s.id === selectedScenario)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedScenario(null); clearConversationMessages() }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{scenario?.icon}</span>
            <div>
              <h3 className="font-semibold text-sm">{scenario?.name}</h3>
              <p className="text-xs text-muted-foreground">Conversation Practice</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGetFeedback}
          disabled={conversationMessages.length < 2 || gettingFeedback}
          className="gap-1"
        >
          {gettingFeedback ? (
            <><RotateCcw className="h-3 w-3 animate-spin" /> Analyzing...</>
          ) : (
            <><Star className="h-3 w-3 text-amber-500" /> Get Feedback</>
          )}
        </Button>
      </div>

      {/* Messages */}
      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {conversationMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] sm:max-w-[70%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-md'
                          : 'bg-muted rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.role === 'user' ? 'You' : 'AI Partner'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {sending && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {tip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 max-w-[80%]">
                  <p className="text-xs text-amber-700 dark:text-amber-400">{tip}</p>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        {/* Input */}
        <div className="p-3">
          {isListening && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-xs text-red-500 font-medium">Listening... Speak in English</span>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder={isListening ? 'Listening...' : 'Type your message in English...'}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
              disabled={sending}
              className="flex-1"
            />
            {speechSupported && (
              <div className="relative">
                <Button
                  onClick={toggleListening}
                  variant="outline"
                  size="icon"
                  className={`h-10 w-10 rounded-full shrink-0 ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600'
                      : 'hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak in English'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                {isListening && (
                  <span className="absolute -inset-1 rounded-full border-2 border-red-400 animate-pulse" />
                )}
              </div>
            )}
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {speechSupported && !isListening && (
            <p className="text-[10px] text-muted-foreground mt-1 px-1">
              Click the mic button to speak your message
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
