import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthorized(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.replace('Bearer ', '').trim()
  return token === process.env.ADMIN_SECRET
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const votes = await sql`
      SELECT id, full_name, email, suspect, submitted_at
      FROM votes
      ORDER BY submitted_at ASC
    `

    // Count per suspect
    const counts: Record<string, number> = { Leo: 0, Dylan: 0, Jaylin: 0, Fiona: 0 }
    for (const row of votes) {
      if (row.suspect in counts) counts[row.suspect]++
    }

    return NextResponse.json({ votes, counts, total: votes.length }, { status: 200 })
  } catch (err) {
    console.error('GET /api/admin/votes error:', err)
    return NextResponse.json({ error: 'Failed to fetch votes.' }, { status: 500 })
  }
}
