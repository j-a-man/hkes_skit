'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import SkullMedallion from '@/components/SkullMedallion'
import CornerOrnament from '@/components/CornerOrnament'
import RuleItem from '@/components/RuleItem'
import { rules } from '@/data/rules'

// ─── Animation variants ────────────────────────────────────────────────────

const titleContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.045, delayChildren: 0.85 },
  },
}

const letterVariant = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const rulesContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 1.5 },
  },
}

const ruleVariant = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' },
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────

const METHODS = ['Heart Attack', 'Suicide', 'Accident'] as const
type Method = typeof METHODS[number]

export default function DeathNotePage() {
  const titleChars = 'DEATH\u00A0NOTE'.split('')
  const [name, setName] = useState('')
  const [method, setMethod] = useState<Method | null>(null)

  return (
    <motion.main
      className="min-h-screen bg-black flex items-center justify-center py-24 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      {/* Outer wrapper — provides relative context for skull */}
      <div className="relative w-full max-w-[680px]">

        {/* ── Skull medallion (straddling the top border) ── */}
        <SkullMedallion />

        {/* ── Main framed panel ── */}
        <motion.div
          className="border-2 border-white relative pt-16 pb-10 px-10 mt-14"
          style={{ outline: '1px solid white', outlineOffset: '-10px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.9 }}
        >
          {/* Corner baroque ornaments */}
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-right" />
          <CornerOrnament position="bottom-left" />

          {/* ── Header ── */}
          <header className="text-center mb-8">

            {/* "DEATH NOTE" — staggered letter entrance */}
            <motion.h1
              className="font-pirata text-white leading-none tracking-widest uppercase"
              style={{ fontSize: 'clamp(2.6rem, 7.5vw, 4.6rem)' }}
              variants={titleContainer}
              initial="hidden"
              animate="visible"
            >
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariant}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>

            {/* "How to use it" */}
            <motion.p
              className="font-special text-white mt-1"
              style={{ fontSize: 'clamp(1.1rem, 3vw, 1.45rem)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              How to use it
            </motion.p>

            {/* Roman numeral "I" */}
            <motion.p
              className="font-uncial text-white mt-0.5 text-base"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              I
            </motion.p>
          </header>

          {/* ── Entry form ── */}
          <motion.div
            className="mb-8 flex flex-col gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {/* Name field */}
            <div className="flex items-baseline gap-3">
              <span className="font-special italic text-white text-base flex-shrink-0">Name:</span>
              <div className="flex-1 border-b border-white">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-white font-special italic text-base outline-none pb-0.5 placeholder:text-white/30"
                  placeholder="___"
                />
              </div>
            </div>

            {/* Method checkboxes */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="font-special italic text-white text-base flex-shrink-0">Method:</span>
              {METHODS.map((m) => (
                <label key={m} className="flex items-center gap-2 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setMethod(method === m ? null : m)}
                    className="w-4 h-4 border border-white flex items-center justify-center flex-shrink-0 text-white text-xs leading-none"
                    aria-pressed={method === m}
                  >
                    {method === m ? '✕' : ''}
                  </button>
                  <span className="font-special italic text-white text-base">{m}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* ── Rules list ── */}
          <motion.ul
            className="list-none p-0 m-0 flex flex-col gap-6"
            variants={rulesContainer}
            initial="hidden"
            animate="visible"
          >
            {rules.map((rule) => (
              <motion.li key={rule.id} variants={ruleVariant}>
                <RuleItem english={rule.english} chinese={rule.chinese} />
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.main>
  )
}
