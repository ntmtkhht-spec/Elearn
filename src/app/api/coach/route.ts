import { NextResponse } from 'next/server'
import { chatCompletion } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, history } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `You are FluentPath AI Coach, a specialized English language tutor for German speakers who already have intermediate to advanced English skills (B1-C2). Your role is to:
- Help improve their English with specific, actionable advice
- Provide German translations when helpful (but encourage English usage)
- Explain grammar rules clearly with examples
- Suggest better vocabulary/expressions
- Give pronunciation tips
- Answer questions about English usage, idioms, and culture
- Always be encouraging and constructive
- Use markdown formatting for clarity
- When providing translations, format as: English → German
- Keep responses concise and helpful
- When correcting mistakes, explain WHY the correction is needed`

    try {
      const chatHistory = (history || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }))

      const response = await chatCompletion(systemPrompt, message, chatHistory)
      
      if (response) {
        return NextResponse.json({ message: response })
      }
    } catch {
      // AI not available, use fallback
    }

    // Fallback responses
    const lower = message.toLowerCase()
    let response = ''

    if (lower.includes('translate') || lower.includes('übersetz')) {
      response = "I'd be happy to help with translations! Please provide the specific word or sentence you'd like me to translate between English and German."
    } else if (lower.includes('grammar') || lower.includes('grammatik')) {
      response = "Grammar is one of my specialties! Which specific grammar topic would you like me to explain? For example: tenses, conditionals, prepositions, articles, or relative clauses?"
    } else if (lower.includes('synonym')) {
      response = "I can help you find synonyms! Tell me the English word you'd like alternatives for, and I'll provide options with explanations of their nuances."
    } else if (lower.includes('pronunciation') || lower.includes('aussprach')) {
      response = "For pronunciation help, I can provide IPA transcriptions and tips. Which word or phrase would you like help with?"
    } else {
      response = "I'm your English learning coach! I can help with:\n\n• **Translations** (English ↔ German)\n• **Grammar explanations** with examples\n• **Vocabulary tips** and synonyms\n• **Pronunciation guidance**\n• **Writing corrections**\n\nWhat would you like help with?"
    }

    return NextResponse.json({ message: response })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
