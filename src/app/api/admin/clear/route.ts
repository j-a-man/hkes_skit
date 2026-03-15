import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

function isAuthorized(req: NextRequest) {
  const header = req.headers.get('authorization') ?? ''
  const token = header.replace('Bearer ', '').trim()
  return token === process.env.ADMIN_SECRET
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await sql`DELETE FROM votes`
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('DELETE /api/admin/clear error:', err)
    return NextResponse.json({ error: 'Failed to clear submissions.' }, { status: 500 })
  }
}
