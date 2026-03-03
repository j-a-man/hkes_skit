import type { Rule } from '@/data/rules'

type RuleItemProps = Pick<Rule, 'english' | 'chinese'>

export default function RuleItem({ english, chinese }: RuleItemProps) {
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

      {/* Chinese translation */}
      <p
        className="font-noto text-white leading-[1.75] pl-5"
        style={{ fontSize: '0.75rem' }}
      >
        {chinese}
      </p>
    </div>
  )
}
