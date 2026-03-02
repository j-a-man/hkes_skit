export interface Furigana {
  base: string
  reading: string
}

export interface JapaneseText {
  text: string
  furigana: Furigana[]
}

export interface Rule {
  id: number
  english: string
  japanese: JapaneseText
}

export const rules: Rule[] = [
  {
    id: 1,
    english: 'The human whose name is written in this note shall die.',
    japanese: {
      text: 'このノートに名前を書かれた人間は死ぬ。',
      furigana: [
        { base: '名前', reading: 'なまえ' },
        { base: '書', reading: 'か' },
        { base: '人間', reading: 'にんげん' },
        { base: '死', reading: 'し' },
      ],
    },
  },
  {
    id: 2,
    english:
      "This note will not take effect unless the writer has the person's face in their mind when writing his/her name. Therefore, people sharing the same name will not be affected.",
    japanese: {
      text: '書く人物の顔が頭に入っていないと効果はない。ゆえに同姓同名の人物に一遍に効果は得られない。',
      furigana: [
        { base: '書', reading: 'か' },
        { base: '人物', reading: 'じんぶつ' },
        { base: '顔', reading: 'かお' },
        { base: '頭', reading: 'あたま' },
        { base: '効果', reading: 'こうか' },
        { base: '同姓同名', reading: 'どうせいどうめい' },
        { base: '一遍', reading: 'いっぺん' },
      ],
    },
  },
  {
    id: 3,
    english:
      "If the cause of death is written within 40 seconds of writing the person's name, it will happen.",
    japanese: {
      text: '名前の後に人間界単位で40秒以内に死因を書くと、その通りになる。',
      furigana: [
        { base: '名前', reading: 'なまえ' },
        { base: '後', reading: 'あと' },
        { base: '人間界', reading: 'にんげんかい' },
        { base: '単位', reading: 'たんい' },
        { base: '以内', reading: 'いない' },
        { base: '死因', reading: 'しいん' },
        { base: '書', reading: 'か' },
        { base: '通り', reading: 'とお' },
      ],
    },
  },
  {
    id: 4,
    english:
      'If the cause of death is not specified, the person will simply die of a heart attack.',
    japanese: {
      text: '死因を書かなければ全てが心臓麻痺となる。',
      furigana: [
        { base: '死因', reading: 'しいん' },
        { base: '書', reading: 'か' },
        { base: '全て', reading: 'すべ' },
        { base: '心臓麻痺', reading: 'しんぞうまひ' },
      ],
    },
  },
  {
    id: 5,
    english:
      'After writing the cause of death, details of the death should be written in the next 6 minutes and 40 seconds.',
    japanese: {
      text: '死因を書くと更に6分40秒、詳しい死の状況を記載する時間が与えられる。',
      furigana: [
        { base: '死因', reading: 'しいん' },
        { base: '書', reading: 'か' },
        { base: '更', reading: 'さら' },
        { base: '詳', reading: 'くわ' },
        { base: '死', reading: 'し' },
        { base: '状況', reading: 'じょうきょう' },
        { base: '記載', reading: 'きさい' },
        { base: '時間', reading: 'じかん' },
        { base: '与', reading: 'あた' },
      ],
    },
  },
]
