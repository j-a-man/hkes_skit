import { NextResponse } from 'next/server'

// Temporary diagnostic route — DELETE this file after fixing the auth issue
export async function GET() {
  return NextResponse.json({
    hasSecret: !!process.env.ADMIN_SECRET,
    secretLength: process.env.ADMIN_SECRET?.length ?? 0,
  })
}
