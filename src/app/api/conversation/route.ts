import { NextResponse } from 'next/server'
import { chatWithMessages, type ChatMsg } from '@/lib/ai'

const TIPS = [
  '💡 Try using "I would argue that..." instead of "I think" for more persuasive language.',
  '💡 Consider using "Furthermore" or "Moreover" to add points to your argument.',
  '💡 "In my experience" sounds more natural than "According to my experience".',
  '💡 Try the phrase "I couldn\'t agree more" to express strong agreement.',
  '💡 Use "On the other hand" to introduce a contrasting viewpoint.',
  '💡 "I\'d like to point out that..." is a polite way to emphasize something.',
  '💡 Instead of "I don\'t know", try "I\'m not entirely sure, but..." for a more professional tone.',
  '💡 "As far as I\'m concerned" is a natural way to express your opinion.',
  '💡 Try using "nevertheless" instead of "but" in formal contexts.',
  '💡 The phrase "I\'m inclined to think" shows thoughtful consideration.',
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, topic, scenario, history } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const systemPrompt = `You are an English conversation partner helping a German speaker practice English. 
The current scenario is: ${scenario || topic || 'general conversation'}.
You should:
- Respond naturally in English ONLY
- Keep the conversation going and engaging
- Be encouraging but challenge the learner appropriately
- Use vocabulary appropriate for B2-C1 level
- If the user makes a notable grammar mistake, briefly note it in a natural way
- Don't be too verbose - keep responses conversational (2-4 sentences usually)
- After your response, on a new line, add a "💡 Tip:" section with a brief language tip related to something in the conversation (grammar, vocabulary, or expression usage). This tip should be short (1 sentence).`

    try {
      const messages: ChatMsg[] = [
        { role: 'assistant', content: systemPrompt },
        ...(history || []).map((m: { role: string; content: string }) => ({
          role: (m.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user', content: message },
      ]

      const response = await chatWithMessages(messages)
      const tip = TIPS[Math.floor(Math.random() * TIPS.length)]

      if (response) {
        // Try to extract tip from response if present
        let mainResponse = response
        let extractedTip = tip
        const tipMatch = response.match(/💡 Tip:\s*(.+)/i)
        if (tipMatch) {
          extractedTip = `💡 ${tipMatch[1].trim()}`
          mainResponse = response.replace(/💡 Tip:.*$/i, '').trim()
        }
        
        return NextResponse.json({
          message: mainResponse,
          tip: extractedTip,
        })
      }
    } catch {
      // AI not available, use fallback
    }

    // Fallback responses
    const scenarioResponses: Record<string, string[]> = {
      'job-interview': [
        "That's a great introduction! Could you tell me more about your experience with project management?",
        "Interesting! Now, can you describe a challenging situation at work and how you handled it?",
        "Very good. Where do you see yourself in five years?",
      ],
      'travel': [
        "Certainly! Let me check our availability. How many nights will you be staying?",
        "We have a standard room available. Would you like me to book that for you?",
      ],
      'small-talk': [
        "Oh nice! I work in marketing. What about you?",
        "That sounds really interesting! Have you always been in that field?",
      ],
      default: [
        "That's interesting! Could you tell me more about that?",
        "I see your point. How would you handle a situation where that doesn't work?",
        "Great response! Let me ask you something a bit more challenging.",
      ],
    }

    const scenarioKey = scenario || 'default'
    const responses = scenarioResponses[scenarioKey] || scenarioResponses['default']
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)]

    return NextResponse.json({
      message: randomResponse,
      tip: randomTip,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
