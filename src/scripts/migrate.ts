/**
 * One-time migration script — run once to create the votes table.
 * Usage: npx tsx src/scripts/migrate.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { neon } from '@neondatabase/serverless'

// Load .env.local first — must happen before neon() is called
config({ path: resolve(process.cwd(), '.env.local') })

async function migrate() {
  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL not found in .env.local')
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  console.log('Running migration…')

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      id           SERIAL PRIMARY KEY,
      email        TEXT UNIQUE NOT NULL,
      full_name    TEXT NOT NULL,
      suspect      TEXT NOT NULL CHECK (suspect IN ('Leo', 'Dylan', 'Jaylin', 'Fiona')),
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  console.log('✓ votes table ready')
  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
