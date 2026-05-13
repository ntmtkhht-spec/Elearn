import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'
import { getUserId } from '@/lib/auth'

interface FeedbackResult {
  overallScore: number
  grammarCorrections: string[]
  vocabularySuggestions: string[]
  contentAccuracy: string
}

export async function POST(request: Request) {
  const userId = await getUserId()

  try {
    const body = await request.json()
    const { assignmentId, summary } = body

    if (!summary || !assignmentId) {
      return NextResponse.json({ error: 'Assignment ID and summary are required' }, { status: 400 })
    }

    let videoTitle = 'the video'
    try {
      const { db } = await import('@/lib/db')
      const assignment = await db.videoAssignment.findUnique({ where: { id: assignmentId } })
      if (assignment) videoTitle = assignment.title
    } catch { /* DB not ready */ }

    const saveToDb = async (feedback: FeedbackResult) => {
      try {
        const { db } = await import('@/lib/db')
        await db.videoSummary.create({
          data: {
            assignmentId,
            userId: userId ?? undefined,
            summary,
            aiFeedback: JSON.stringify(feedback),
            aiScore: feedback.overallScore,
          },
        })
        if (userId) {
          const today = new Date().toISOString().split('T')[0]
          await db.learningStats.upsert({
            where: { userId_date: { userId, date: today } },
            create: { userId, date: today, videosWatched: 1 },
            update: { videosWatched: { increment: 1 } },
          })
        }
      } catch { /* DB not ready */ }
    }

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
        const parsed = parseJSONResponse<FeedbackResult>(response)
        if (parsed && parsed.overallScore) {
          await saveToDb(parsed)
          return NextResponse.json(parsed)
        }
      }
    } catch { /* LLM not available */ }

    return NextResponse.json({ error: 'AI feedback unavailable' }, { status: 503 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
