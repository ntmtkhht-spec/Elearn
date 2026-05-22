'use client'

import { useState, useRef, useEffect } from 'react'
import { useAppStore, type ChatMessage } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles, Send, X, Languages, BookOpen,
  PenTool, ArrowUp, Minimize2, Mic, MicOff
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

const QUICK_ACTIONS = [
  { label: 'Translate this', icon: <Languages className="h-3.5 w-3.5" />, prompt: 'Translate the following to German: ' },
  { label: 'Explain grammar', icon: <PenTool className="h-3.5 w-3.5" />, prompt: 'Explain the grammar rule for: ' },
  { label: 'Synonym for...', icon: <BookOpen className="h-3.5 w-3.5" />, prompt: 'Give me synonyms for the English word: ' },
]

export default function AICoach() {
  const { coachOpen, setCoachOpen, coachMessages, addCoachMessage, clearCoachMessages } = useAppStore()
  const [inputMessage, setInputMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [coachMessages])

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

  const handleSendMessage = async (message?: string) => {
    // Clean up any interim text markers before sending
    const rawContent = message || inputMessage
    const content = rawContent.replace(/\[.*?\]/g, '').trim()
    if (!content || sending) return

    // Stop listening if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }

    const userMessage: ChatMessage = {
      id: `coach-user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    }
    addCoachMessage(userMessage)
    setInputMessage('')
    setSending(true)

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: coachMessages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        addCoachMessage({
          id: `coach-ai-${Date.now()}`,
          role: 'assistant',
          content: data.message || data.content || "I'd be happy to help with your English learning! What would you like to know?",
          timestamp: new Date(),
        })
      } else {
        addCoachMessage({
          id: `coach-ai-${Date.now()}`,
          role: 'assistant',
          content: getFallbackResponse(content),
          timestamp: new Date(),
        })
      }
    } catch {
      addCoachMessage({
        id: `coach-ai-${Date.now()}`,
        role: 'assistant',
        content: getFallbackResponse(content),
        timestamp: new Date(),
      })
    }
    setSending(false)
  }

  const getFallbackResponse = (message: string): string => {
    const lower = message.toLowerCase()
    if (lower.includes('translate') || lower.includes('übersetz')) {
      return "I'd be happy to help with translations! Please provide the specific word or sentence you'd like me to translate between English and German."
    }
    if (lower.includes('grammar') || lower.includes('grammatik')) {
      return "Grammar is one of my specialties! Which specific grammar topic would you like me to explain? For example: tenses, conditionals, prepositions, articles, or relative clauses?"
    }
    if (lower.includes('synonym') || lower.includes('synonym')) {
      return "I can help you find synonyms! Tell me the English word you'd like alternatives for, and I'll provide options with explanations of their nuances."
    }
    return "I'm your English learning coach! I can help with:\n• Translations (English ↔ German)\n• Grammar explanations\n• Vocabulary tips and synonyms\n• Pronunciation guidance\n• Writing corrections\n\nWhat would you like help with?"
  }

  const handleQuickAction = (prompt: string) => {
    setInputMessage(prompt)
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!coachOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50"
          >
            <Button
              onClick={() => setCoachOpen(true)}
              className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all"
              size="icon"
            >
              <Sparkles className="h-6 w-6" />
            </Button>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coach Panel */}
      <AnimatePresence>
        {coachOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] sm:max-w-[400px]"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-emerald-600 text-white">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold text-sm">AI Coach</h3>
                    <p className="text-[10px] text-emerald-100">English learning assistant</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-emerald-700"
                    onClick={() => setCoachOpen(false)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-white hover:bg-emerald-700"
                    onClick={() => { setCoachOpen(false); clearCoachMessages() }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              {coachMessages.length === 0 && (
                <div className="p-3 border-b border-border">
                  <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ACTIONS.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1 hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-950/20 dark:hover:border-emerald-700"
                        onClick={() => handleQuickAction(action.prompt)}
                      >
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              <ScrollArea className="flex-1 p-3 max-h-[40vh]">
                <div className="space-y-3">
                  {coachMessages.length === 0 && (
                    <div className="text-center py-6">
                      <Sparkles className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                      <p className="text-sm font-medium">Hello! I&apos;m your AI English Coach</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ask me anything about English — translations, grammar, vocabulary, or writing tips!
                      </p>
                    </div>
                  )}

                  {coachMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-muted rounded-bl-sm'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose-chat">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content.split('\n').map((line, i) => (
                            <span key={i}>
                              {line}
                              {i < msg.content.split('\n').length - 1 && <br />}
                            </span>
                          ))
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-xl rounded-bl-sm px-3 py-2">
                        <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
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
                    placeholder={isListening ? 'Listening...' : 'Ask about English...'}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
                    disabled={sending}
                    className="flex-1 h-9 text-sm"
                  />
                  {speechSupported && (
                    <div className="relative">
                      <Button
                        onClick={toggleListening}
                        variant="outline"
                        size="icon"
                        className={`h-9 w-9 rounded-full shrink-0 px-0 ${
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
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || sending}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 w-9 px-0"
                    size="icon"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </div>
                {speechSupported && !isListening && (
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">
                    Click the mic button to speak your message
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
