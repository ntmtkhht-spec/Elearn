import { NextResponse } from 'next/server'
import { chatCompletion, parseJSONResponse } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { answers, writingSample } = body

    // Calculate score by level
    const levelScores: Record<string, { correct: number; total: number }> = {
      A1: { correct: 0, total: 0 },
      A2: { correct: 0, total: 0 },
      B1: { correct: 0, total: 0 },
      B2: { correct: 0, total: 0 },
      C1: { correct: 0, total: 0 },
      C2: { correct: 0, total: 0 },
    }

    // Count correct answers per level
    for (const answer of answers) {
      const level = answer.level
      if (levelScores[level]) {
        levelScores[level].total++
        if (answer.isCorrect) {
          levelScores[level].correct++
        }
      }
    }

    // Determine level based on accuracy per bracket
    let determinedLevel = 'A1'
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    for (const level of levelOrder) {
      const scores = levelScores[level]
      if (scores.total > 0 && scores.correct / scores.total >= 0.5) {
        determinedLevel = level
      }
    }

    // If writing sample provided, use AI to refine the level
    if (writingSample && writingSample.trim()) {
      try {
        const systemPrompt = `You are an English language assessment expert. A German speaker has taken a placement test and written a sample. Based on their test results and writing, determine their CEFR level (A1, A2, B1, B2, C1, C2).

Test scores by level: ${JSON.stringify(levelScores)}
Preliminary level based on test: ${determinedLevel}

Analyze the writing sample for: grammar complexity, vocabulary range, sentence structure, and fluency.

Return ONLY valid JSON:
{
  "level": "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  "writingAnalysis": {
    "grammarComplexity": string (brief assessment),
    "vocabularyRange": string (brief assessment),
    "sentenceStructure": string (brief assessment)
  },
  "strengths": [string, string],
  "areasToImprove": [string, string],
  "encouragement": string
}`

        const response = await chatCompletion(systemPrompt, `Writing sample: "${writingSample}"`)
        if (response) {
          const parsed = parseJSONResponse<{
            level: string
            writingAnalysis: { grammarComplexity: string; vocabularyRange: string; sentenceStructure: string }
            strengths: string[]
            areasToImprove: string[]
            encouragement: string
          }>(response)
          if (parsed && parsed.level) {
            return NextResponse.json({
              level: parsed.level,
              testScores: levelScores,
              writingAnalysis: parsed.writingAnalysis,
              strengths: parsed.strengths,
              areasToImprove: parsed.areasToImprove,
              encouragement: parsed.encouragement,
            })
          }
        }
      } catch {
        // AI not available, use calculated level
      }
    }

    // Fallback without AI analysis
    const LEVEL_DESCRIPTIONS: Record<string, string> = {
      A1: 'You can understand and use familiar everyday expressions and basic phrases.',
      A2: 'You can understand frequently used expressions related to areas of most immediate relevance.',
      B1: 'You can deal with most situations likely to arise while travelling or in familiar contexts.',
      B2: 'You can interact with a degree of fluency and spontaneity that makes regular interaction quite possible.',
      C1: 'You can express ideas fluently and spontaneously without much obvious searching for expressions.',
      C2: 'You can understand virtually everything heard or read with ease and express yourself spontaneously.',
    }

    return NextResponse.json({
      level: determinedLevel,
      testScores: levelScores,
      writingAnalysis: null,
      strengths: ['You completed the placement test!'],
      areasToImprove: ['Keep practicing to improve your English'],
      encouragement: LEVEL_DESCRIPTIONS[determinedLevel] || 'Every step counts on your English learning journey!',
    })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
