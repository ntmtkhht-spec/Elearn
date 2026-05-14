import { NextResponse } from 'next/server'
import { getUserId } from '@/lib/auth'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { db } = await import('@/lib/db')
    const profile = await db.userProfile.findUnique({ where: { userId } })
    if (profile) return NextResponse.json(profile)

    // Create default profile on first access
    const created = await db.userProfile.create({
      data: { userId, userLevel: 'B1', hasCompletedPlacement: false },
    })
    return NextResponse.json(created)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json()
    const { userLevel, hasCompletedPlacement, theme } = body

    const { db } = await import('@/lib/db')
    const profile = await db.userProfile.upsert({
      where: { userId },
      create: { userId, userLevel: userLevel ?? 'B1', hasCompletedPlacement: hasCompletedPlacement ?? false, theme: theme ?? 'system' },
      update: {
        ...(userLevel !== undefined && { userLevel }),
        ...(hasCompletedPlacement !== undefined && { hasCompletedPlacement }),
        ...(theme !== undefined && { theme }),
      },
    })
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
