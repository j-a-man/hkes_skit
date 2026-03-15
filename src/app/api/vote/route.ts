import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

const VALID_SUSPECTS = ['Leo', 'Dylan', 'Jaylin', 'Fiona'] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, fullName, suspect } = body

    // Validate fields
    if (!email || !fullName || !suspect) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!VALID_SUSPECTS.includes(suspect)) {
      return NextResponse.json({ error: 'Invalid suspect.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    // Insert — unique constraint on email catches duplicates
    await sql`
      INSERT INTO votes (email, full_name, suspect)
      VALUES (${email.toLowerCase().trim()}, ${fullName.trim()}, ${suspect})
    `

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    // Postgres unique violation = duplicate email
    // Neon driver attaches `code` directly on the error object
    const pgCode = (err as Record<string, unknown>)?.code
    if (pgCode === '23505' || String(err).includes('23505')) {
      return NextResponse.json(
        { error: 'duplicate' },
        { status: 409 }
      )
    }

    console.error('POST /api/vote error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
