'use client'

import { useState, useEffect, useCallback } from 'react'

const SUSPECTS = ['Leo', 'Dylan', 'Jaylin', 'Fiona'] as const
type Suspect = typeof SUSPECTS[number]

interface Vote {
  id: number
  full_name: string
  email: string
  suspect: string
  submitted_at: string
}

interface VotesData {
  votes: Vote[]
  counts: Record<string, number>
  total: number
}

// ─── Auth gate ────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (secret: string) => void }) {
  const [input, setInput] = useState('')

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <form
        onSubmit={(e) => { e.preventDefault(); if (input) onLogin(input) }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <h1 className="text-white text-2xl font-bold tracking-tight">Admin</h1>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Admin password"
          className="bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2 outline-none focus:border-zinc-400 placeholder:text-zinc-500"
        />
        <button
          type="submit"
          className="bg-white text-black font-semibold py-2 rounded hover:bg-zinc-200 transition-colors"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0'
  const barWidth = total > 0 ? (value / total) * 100 : 0

  return (
    <div className="bg-zinc-800 rounded p-4 flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <span className="text-white font-semibold text-lg">{label}</span>
        <span className="text-zinc-400 text-sm">{pct}%</span>
      </div>
      <span className="text-3xl font-bold text-white">{value}</span>
      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-500"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ secret, onLogout }: { secret: string; onLogout: () => void }) {
  const [data, setData] = useState<VotesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [correctSuspect, setCorrectSuspect] = useState<Suspect>('Leo')
  const [winner, setWinner] = useState<{ full_name: string; email: string } | null>(null)
  const [winnerLoading, setWinnerLoading] = useState(false)
  const [winnerError, setWinnerError] = useState('')

  const fetchVotes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/votes', {
        headers: { Authorization: `Bearer ${secret}` },
      })
      if (res.status === 401) { setError('Incorrect password or ADMIN_SECRET not set in Vercel env vars.'); setLoading(false); return }
      if (!res.ok) throw new Error('Failed to load')
      setData(await res.json())
    } catch {
      setError('Could not load votes. Check your connection.')
    } finally {
      setLoading(false)
    }
  }, [secret, onLogout])

  useEffect(() => { fetchVotes() }, [fetchVotes])

  async function pickWinner() {
    setWinnerLoading(true)
    setWinnerError('')
    setWinner(null)
    try {
      const res = await fetch('/api/admin/winner', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correctSuspect }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setWinner(json.winner)
    } catch (err) {
      setWinnerError(err instanceof Error ? err.message : 'Failed to pick winner')
    } finally {
      setWinnerLoading(false)
    }
  }

  async function clearSubmissions() {
    if (!confirm('Are you sure you want to delete ALL submissions? This cannot be undone.')) return
    try {
      const res = await fetch('/api/admin/clear', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${secret}` },
      })
      if (!res.ok) throw new Error('Failed to clear')
      setData(null)
      setWinner(null)
      setWinnerError('')
      await fetchVotes()
    } catch {
      setError('Failed to clear submissions.')
    }
  }

  function exportCSV() {
    const url = `/api/admin/export`
    // Fetch with auth then trigger download
    fetch(url, { headers: { Authorization: `Bearer ${secret}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = 'votes.csv'
        a.click()
        URL.revokeObjectURL(a.href)
      })
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top bar */}
      <div className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">Guess the Murderer — Admin</h1>
        <div className="flex gap-3">
          <button
            onClick={clearSubmissions}
            className="text-sm text-red-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={fetchVotes}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-10">

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {loading && !data && (
          <p className="text-zinc-500 text-sm">Loading…</p>
        )}

        {data && (
          <>
            {/* ── Totals ── */}
            <section>
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Results</h2>
                <span className="text-zinc-400 text-sm">{data.total} total votes</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SUSPECTS.map((s) => (
                  <StatCard key={s} label={s} value={data.counts[s] ?? 0} total={data.total} />
                ))}
              </div>
            </section>

            {/* ── Pick winner ── */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col gap-4">
              <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Pick Winner</h2>
              <p className="text-zinc-400 text-sm">
                Select the correct murderer, then draw a random winner from everyone who guessed right.
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={correctSuspect}
                  onChange={(e) => {
                    setCorrectSuspect(e.target.value as Suspect)
                    setWinner(null)
                    setWinnerError('')
                  }}
                  className="bg-zinc-800 border border-zinc-700 text-white rounded px-3 py-2 outline-none focus:border-zinc-400"
                >
                  {SUSPECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={pickWinner}
                  disabled={winnerLoading}
                  className="bg-white text-black font-semibold px-5 py-2 rounded hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  {winnerLoading ? 'Drawing…' : 'Draw Winner'}
                </button>
              </div>

              {winnerError && (
                <p className="text-red-400 text-sm">{winnerError}</p>
              )}

              {winner && (
                <div className="bg-zinc-800 border border-zinc-600 rounded p-4">
                  <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Winner</p>
                  <p className="text-white text-xl font-bold">{winner.full_name}</p>
                  <p className="text-zinc-300 text-sm">{winner.email}</p>
                </div>
              )}
            </section>

            {/* ── Export ── */}
            <section className="flex justify-end">
              <button
                onClick={exportCSV}
                className="border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-sm px-4 py-2 rounded transition-colors"
              >
                Export CSV
              </button>
            </section>

            {/* ── Votes table ── */}
            <section>
              <h2 className="text-zinc-400 text-xs uppercase tracking-widest font-semibold mb-4">
                All Submissions
              </h2>
              <div className="overflow-x-auto rounded border border-zinc-800">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 text-left">
                      <th className="px-4 py-3 text-zinc-400 font-medium">#</th>
                      <th className="px-4 py-3 text-zinc-400 font-medium">Name</th>
                      <th className="px-4 py-3 text-zinc-400 font-medium">Email</th>
                      <th className="px-4 py-3 text-zinc-400 font-medium">Voted for</th>
                      <th className="px-4 py-3 text-zinc-400 font-medium">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.votes.map((v, i) => (
                      <tr
                        key={v.id}
                        className={`border-b border-zinc-800/50 ${i % 2 === 0 ? 'bg-zinc-900/30' : ''}`}
                      >
                        <td className="px-4 py-3 text-zinc-500">{v.id}</td>
                        <td className="px-4 py-3 text-white">{v.full_name}</td>
                        <td className="px-4 py-3 text-zinc-300">{v.email}</td>
                        <td className="px-4 py-3 text-white font-medium">{v.suspect}</td>
                        <td className="px-4 py-3 text-zinc-400">
                          {new Date(v.submitted_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.votes.length === 0 && (
                  <p className="text-zinc-500 text-sm px-4 py-6 text-center">No submissions yet.</p>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [secret, setSecret] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('adminSecret')
    if (stored) setSecret(stored)
  }, [])

  function handleLogin(s: string) {
    localStorage.setItem('adminSecret', s)
    setSecret(s)
  }

  function handleLogout() {
    localStorage.removeItem('adminSecret')
    setSecret(null)
  }

  if (!secret) return <LoginScreen onLogin={handleLogin} />
  return <Dashboard secret={secret} onLogout={handleLogout} />
}
