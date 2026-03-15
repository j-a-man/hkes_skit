import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthorized(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.replace('Bearer ', '').trim()
  return token === process.env.ADMIN_SECRET
}

function escapeCSV(value: string | number | null): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
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

    const header = ['id', 'full_name', 'email', 'suspect', 'submitted_at'].join(',')
    const rows = votes.map((v) =>
      [
        escapeCSV(v.id),
        escapeCSV(v.full_name),
        escapeCSV(v.email),
        escapeCSV(v.suspect),
        escapeCSV(v.submitted_at),
      ].join(',')
    )

    const csv = [header, ...rows].join('\n')

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="votes.csv"',
      },
    })
  } catch (err) {
    console.error('GET /api/admin/export error:', err)
    return NextResponse.json({ error: 'Failed to export votes.' }, { status: 500 })
  }
}
