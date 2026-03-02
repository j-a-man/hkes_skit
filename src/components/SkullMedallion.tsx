import { motion } from 'framer-motion'

const CX = 80
const CY = 80
const INNER_R = 50
const SPIKE_INNER_R = 55
const SPIKE_OUTER_R = 72
const SPOKE_COUNT = 24

function generateSpokes() {
  return Array.from({ length: SPOKE_COUNT }, (_, i) => {
    const angle = (i * 2 * Math.PI) / SPOKE_COUNT - Math.PI / 2
    return {
      x1: CX + SPIKE_INNER_R * Math.cos(angle),
      y1: CY + SPIKE_INNER_R * Math.sin(angle),
      x2: CX + SPIKE_OUTER_R * Math.cos(angle),
      y2: CY + SPIKE_OUTER_R * Math.sin(angle),
    }
  })
}

export default function SkullMedallion() {
  const spokes = generateSpokes()

  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 -top-[56px] z-10"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.9, ease: 'easeOut' }}
    >
      <motion.svg
        viewBox="0 0 160 160"
        width="112"
        height="112"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      >
        {/* Sunburst spokes */}
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="white" strokeWidth="1.5" />
        ))}

        {/* Outer glow ring */}
        <circle cx={CX} cy={CY} r={INNER_R + 3} fill="none" stroke="white" strokeWidth="2" />

        {/* Black fill background */}
        <circle cx={CX} cy={CY} r={INNER_R} fill="black" />

        {/* ── Skull ── */}
        {/* Cranium */}
        <ellipse cx="80" cy="67" rx="28" ry="27" fill="white" />

        {/* Left eye socket */}
        <ellipse cx="68" cy="65" rx="8.5" ry="10.5" fill="black" />

        {/* Right eye socket */}
        <ellipse cx="92" cy="65" rx="8.5" ry="10.5" fill="black" />

        {/* Nasal cavity (inverted triangle) */}
        <path d="M77,76 L83,76 L80,84 Z" fill="black" />

        {/* Cheekbone separator line */}
        <line x1="54" y1="80" x2="106" y2="80" stroke="black" strokeWidth="1.5" />

        {/* Lower jaw */}
        <path d="M54,80 C52,102 108,102 106,80 Z" fill="white" />

        {/* Teeth dividers */}
        <line x1="65" y1="82" x2="63" y2="101" stroke="black" strokeWidth="2.5" />
        <line x1="74" y1="82" x2="74" y2="102" stroke="black" strokeWidth="2.5" />
        <line x1="86" y1="82" x2="86" y2="102" stroke="black" strokeWidth="2.5" />
        <line x1="95" y1="82" x2="97" y2="101" stroke="black" strokeWidth="2.5" />

        {/* Centre cranium crack */}
        <line x1="80" y1="42" x2="80" y2="56" stroke="black" strokeWidth="1.5" />
      </motion.svg>
    </motion.div>
  )
}
