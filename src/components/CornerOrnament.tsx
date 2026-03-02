interface CornerOrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
}

const positionClasses: Record<CornerOrnamentProps['position'], string> = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
}

// Mirror transforms: top-left = original, others are reflections
const transforms: Record<CornerOrnamentProps['position'], string> = {
  'top-left': 'none',
  'top-right': 'scaleX(-1)',
  'bottom-right': 'scale(-1, -1)',
  'bottom-left': 'scaleY(-1)',
}

export default function CornerOrnament({ position }: CornerOrnamentProps) {
  return (
    <svg
      viewBox="0 0 72 72"
      width="72"
      height="72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${positionClasses[position]}`}
      style={{ transform: transforms[position] }}
    >
      {/* ── Outer main diagonal arc ── */}
      <path
        d="M 5,66 C 5,38 14,20 40,10 L 66,5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── Inner parallel arc ── */}
      <path
        d="M 5,54 C 8,32 18,18 44,12 L 64,8"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
      />

      {/* ── End flourish — top-right tip ── */}
      <path
        d="M 66,5 C 71,3 73,8 70,13 C 67,18 60,15 61,10 C 62,5 66,5 66,5 Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />

      {/* ── End flourish — bottom-left tip ── */}
      <path
        d="M 5,66 C 3,71 8,73 13,70 C 18,67 15,60 10,61 C 5,62 5,66 5,66 Z"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
      />

      {/* ── Central leaf / petal motif ── */}
      <path
        d="M 28,40 C 20,34 24,24 31,27 C 38,30 36,40 28,40 Z"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 28,40 C 36,46 44,40 41,31 C 38,22 28,30 28,40 Z"
        stroke="white"
        strokeWidth="1"
        fill="none"
      />

      {/* ── Accent dots ── */}
      <circle cx="34" cy="16" r="2.5" fill="white" />
      <circle cx="16" cy="34" r="2.5" fill="white" />
      <circle cx="34" cy="34" r="1.5" fill="white" />
    </svg>
  )
}
