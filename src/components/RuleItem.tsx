import type { Furigana, JapaneseText } from '@/data/rules'

interface RuleItemProps {
  english: string
  japanese: JapaneseText
}

function RubyText({ text, furigana }: { text: string; furigana: Furigana[] }) {
  if (!furigana.length) return <span>{text}</span>

  const parts: React.ReactNode[] = []
  let remaining = text

  furigana.forEach(({ base, reading }, i) => {
    const idx = remaining.indexOf(base)
    if (idx === -1) return
    if (idx > 0) {
      parts.push(<span key={`t${i}`}>{remaining.slice(0, idx)}</span>)
    }
    parts.push(
      <ruby key={`r${i}`}>
        {base}
        <rt>{reading}</rt>
      </ruby>
    )
    remaining = remaining.slice(idx + base.length)
  })

  if (remaining) parts.push(<span key="end">{remaining}</span>)

  return <>{parts}</>
}

export default function RuleItem({ english, japanese }: RuleItemProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* English rule */}
      <div className="flex items-start gap-2">
        <span
          className="font-special text-white select-none flex-shrink-0 leading-none"
          style={{ fontSize: '1.3rem', marginTop: '2px' }}
        >
          ◦
        </span>
        <p
          className="font-special italic text-white leading-[1.45]"
          style={{ fontSize: '1.05rem' }}
        >
          {english}
        </p>
      </div>

      {/* Japanese translation with furigana */}
      <p
        className="font-noto text-white leading-[1.75] pl-5"
        style={{ fontSize: '0.62rem' }}
      >
        <RubyText text={japanese.text} furigana={japanese.furigana} />
      </p>
    </div>
  )
}
