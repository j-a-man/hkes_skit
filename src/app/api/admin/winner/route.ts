import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthorized(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.replace('Bearer ', '').trim()
  return token === process.env.ADMIN_SECRET
}

const VALID_SUSPECTS = ['Leo', 'Dylan', 'Jaylin', 'Fiona']

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { correctSuspect } = await req.json()

    if (!correctSuspect || !VALID_SUSPECTS.includes(correctSuspect)) {
      return NextResponse.json({ error: 'Invalid suspect.' }, { status: 400 })
    }

    const rows = await sql`
      SELECT full_name, email
      FROM votes
      WHERE suspect = ${correctSuspect}
      ORDER BY RANDOM()
      LIMIT 1
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: `Nobody voted for ${correctSuspect}.` },
        { status: 404 }
      )
    }

    return NextResponse.json({ winner: rows[0] }, { status: 200 })
  } catch (err) {
    console.error('POST /api/admin/winner error:', err)
    return NextResponse.json({ error: 'Failed to pick winner.' }, { status: 500 })
  }
}
