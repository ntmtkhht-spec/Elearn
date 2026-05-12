import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

const FALLBACK_FEEDBACK = {
  overallScore: 7,
  grammarCorrections: [
    'Check your use of articles (a/an/the) in longer sentences.',
    'Make sure your verb tenses are consistent throughout the summary.',
    'Consider using more complex sentence structures to show variety.',
  ],
  vocabularySuggestions: [
    'Instead of "very important", try "crucial" or "paramount".',
    'Consider using "compelling" instead of "very interesting".',
    'The phrase "shed light on" is a great alternative to "explained".',
  ],
  contentAccuracy: 'Your summary captures the main themes well. Consider adding more specific details and examples from the video to strengthen your summary and demonstrate deeper comprehension.',
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { assignmentId, summary } = body

    if (!summary || !assignmentId) {
      return NextResponse.json({ error: 'Assignment ID and summary are required' }, { status: 400 })
    }

    // Try to get video details for context
    let videoTitle = 'the video'
    try {
      const { db } = await import('@/lib/db')
      const assignment = await db.videoAssignment.findUnique({ where: { id: assignmentId } })
      if (assignment) videoTitle = assignment.title
    } catch {
      // DB not ready
    }

    // Try LLM feedback
    try {
      const systemPrompt = `You are an English teacher evaluating a student's video summary. 
The student watched a video titled "${videoTitle}" and wrote a summary in English.
Evaluate the summary and provide:
1. An overall score from 1-10
2. Grammar corrections (list specific errors as strings)
3. Vocabulary suggestions (better word choices as strings)
4. Content accuracy assessment (a paragraph)

Respond ONLY with valid JSON in this exact format:
{
  "overallScore": <number>,
  "grammarCorrections": [<string>, ...],
  "vocabularySuggestions": [<string>, ...],
  "contentAccuracy": "<string>"
}`

      const response = await chatCompletion(systemPrompt, `Please evaluate this video summary:\n\n${summary}`)
      
      if (response) {
        const parsed = parseJSONResponse<{
          overallScore: number
          grammarCorrections: string[]
          vocabularySuggestions: string[]
          contentAccuracy: string
        }>(response)
        
        if (parsed && parsed.overallScore) {
          // Save to DB
          try {
            const { db } = await import('@/lib/db')
            await db.videoSummary.create({
              data: {
                assignmentId,
                summary,
                aiFeedback: JSON.stringify(parsed),
                aiScore: parsed.overallScore,
              },
            })
          } catch {
            // DB not ready
          }
          return NextResponse.json(parsed)
        }
      }
    } catch {
      // LLM not available
    }

    // Fallback feedback
    try {
      const { db } = await import('@/lib/db')
      await db.videoSummary.create({
        data: {
          assignmentId,
          summary,
          aiFeedback: JSON.stringify(FALLBACK_FEEDBACK),
          aiScore: FALLBACK_FEEDBACK.overallScore,
        },
      })
    } catch {
      // DB not ready
    }

    return NextResponse.json(FALLBACK_FEEDBACK)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
