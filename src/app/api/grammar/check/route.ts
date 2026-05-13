import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { exerciseId, answer } = body

    // In a real app, we'd check against the stored exercise
    // For now, just acknowledge the submission
    return NextResponse.json({ success: true, exerciseId, answer })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
