'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SkullMedallion from '@/components/SkullMedallion'
import CornerOrnament from '@/components/CornerOrnament'

// ─── Suspects ─────────────────────────────────────────────────────────────────

const SUSPECTS = [
  { name: 'Leo',    image: '/suspects/leo.jpg' },
  { name: 'Dylan',  image: '/suspects/dylan.jpg' },
  { name: 'Jaylin', image: '/suspects/jaylin.jpg' },
  { name: 'Fiona',  image: '/suspects/fiona.jpg' },
] as const

type Suspect = typeof SUSPECTS[number]['name']
type Status = 'idle' | 'submitting' | 'success' | 'duplicate' | 'error'

// ─── Animation variants ────────────────────────────────────────────────────────

const titleContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.85 } },
}

const letterVariant = {
  hidden: { opacity: 0, y: -24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

// ─── Suspect card ─────────────────────────────────────────────────────────────

function SuspectCard({
  suspect,
  selected,
  onSelect,
}: {
  suspect: typeof SUSPECTS[number]
  selected: boolean
  onSelect: () => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-center gap-2 p-3 border transition-all cursor-pointer ${
        selected ? 'border-white bg-white/10' : 'border-white/30 hover:border-white/60'
      }`}
    >
      {/* Photo */}
      <div className="w-full aspect-square relative overflow-hidden bg-white/5 flex items-center justify-center">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={suspect.image}
            alt={suspect.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-white/20 text-5xl select-none">?</span>
        )}
      </div>

      {/* Name + checkbox */}
      <div className="flex items-center gap-2">
        <div
          className={`w-3.5 h-3.5 border border-white flex items-center justify-center text-white leading-none flex-shrink-0 ${
            selected ? 'bg-white/20' : ''
          }`}
          style={{ fontSize: '0.5rem' }}
        >
          {selected ? '✕' : ''}
        </div>
        <span className="font-special italic text-white text-sm">{suspect.name}</span>
      </div>
    </button>
  )
}

// ─── Already voted screen ─────────────────────────────────────────────────────

function AlreadyVotedScreen() {
  return (
    <motion.main
      className="min-h-screen bg-black flex items-center justify-center py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <div className="relative w-full max-w-[680px]">
        <SkullMedallion />
        <motion.div
          className="border-2 border-white relative pt-16 pb-10 px-10 mt-14 text-center"
          style={{ outline: '1px solid white', outlineOffset: '-10px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-right" />
          <CornerOrnament position="bottom-left" />

          <p className="font-pirata text-white text-4xl mb-4 tracking-wide">
            Already voted.
          </p>
          <p className="font-special italic text-white/70 text-sm leading-relaxed">
            This email has already been used to submit a vote.
            <br />
            Only one vote is allowed per person.
          </p>
        </motion.div>
      </div>
    </motion.main>
  )
}

// ─── Success screen ────────────────────────────────────────────────────────────

function SuccessScreen({ suspect }: { suspect: Suspect }) {
  return (
    <motion.main
      className="min-h-screen bg-black flex items-center justify-center py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <div className="relative w-full max-w-[680px]">
        <SkullMedallion />
        <motion.div
          className="border-2 border-white relative pt-16 pb-10 px-10 mt-14 text-center"
          style={{ outline: '1px solid white', outlineOffset: '-10px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.9 }}
        >
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-right" />
          <CornerOrnament position="bottom-left" />

          <p className="font-pirata text-white text-4xl mb-4 tracking-wide">
            Your vote has been cast.
          </p>
          <p className="font-special italic text-white/70 text-sm leading-relaxed">
            You voted for <span className="text-white not-italic">{suspect}</span>.
            <br />
            If your guess is correct, you will be entered into the raffle.
          </p>
        </motion.div>
      </div>
    </motion.main>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuessTheMurdererPage() {
  const titleChars = 'DEATH\u00A0NOTE'.split('')

  const [email, setEmail]       = useState('')
  const [fullName, setFullName] = useState('')
  const [suspect, setSuspect]   = useState<Suspect | null>(null)
  const [status, setStatus]     = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [touched, setTouched]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!email || !fullName || !suspect) return

    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, suspect }),
      })
      const data = await res.json()
      if (res.status === 409) { setStatus('duplicate'); return }
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setStatus('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'duplicate') return <AlreadyVotedScreen />
  if (status === 'success') return <SuccessScreen suspect={suspect!} />

  return (
    <motion.main
      className="min-h-screen bg-black flex items-center justify-center py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <div className="relative w-full max-w-[680px]">
        <SkullMedallion />

        <motion.div
          className="border-2 border-white relative pt-16 pb-10 px-10 mt-14"
          style={{ outline: '1px solid white', outlineOffset: '-10px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.9 }}
        >
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-right" />
          <CornerOrnament position="bottom-left" />

          {/* ── Header ── */}
          <header className="text-center mb-5">
            <motion.h1
              className="font-pirata text-white leading-none tracking-widest uppercase"
              style={{ fontSize: 'clamp(2.6rem, 7.5vw, 4.6rem)' }}
              variants={titleContainer}
              initial="hidden"
              animate="visible"
            >
              {titleChars.map((char, i) => (
                <motion.span key={i} variants={letterVariant} className="inline-block">
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              className="font-special text-white mt-1"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 1.45rem)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              Guess the Murderer
            </motion.p>
          </header>

          {/* ── Description ── */}
          <motion.p
            className="font-special italic text-white/70 text-center text-sm leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            One victim, four suspects and just one murderer.
            <br />
            Who do you think did it? Submit your guess before the reveal.
            <br />
            If your guess is right, you will be entered in our next raffle.
          </motion.p>

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label className="font-special italic text-white/55 text-xs uppercase tracking-widest">
                Email *
              </label>
              <div className="border-b border-white">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-white font-special italic text-base outline-none pb-0.5 placeholder:text-white/25"
                  placeholder="your@email.com"
                />
              </div>
              {touched && !email && (
                <span className="text-red-400 font-special text-xs">Email is required</span>
              )}
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <label className="font-special italic text-white/55 text-xs uppercase tracking-widest">
                Full Name *
              </label>
              <div className="border-b border-white">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-transparent text-white font-special italic text-base outline-none pb-0.5 placeholder:text-white/25"
                  placeholder="Your full name"
                />
              </div>
              {touched && !fullName && (
                <span className="text-red-400 font-special text-xs">Full name is required</span>
              )}
            </div>

            {/* Suspect grid */}
            <div className="flex flex-col gap-3">
              <span className="font-special italic text-white/55 text-xs uppercase tracking-widest">
                Who do you think is the murderer? *
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SUSPECTS.map((s) => (
                  <SuspectCard
                    key={s.name}
                    suspect={s}
                    selected={suspect === s.name}
                    onSelect={() => setSuspect(s.name)}
                  />
                ))}
              </div>
              {touched && !suspect && (
                <span className="text-red-400 font-special text-xs">Please select a suspect</span>
              )}
            </div>

            {/* Server error */}
            {status === 'error' && (
              <p className="text-red-400 font-special text-sm text-center">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-1 border border-white text-white font-special italic py-2.5 px-10 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-center tracking-wider"
            >
              {status === 'submitting' ? 'Submitting…' : 'Submit Vote'}
            </button>
          </motion.form>
        </motion.div>
      </div>
    </motion.main>
  )
}
