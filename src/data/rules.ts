export interface Rule {
  id: number
  english: string
  chinese: string
}

export const rules: Rule[] = [
  {
    id: 1,
    english: 'The human whose name is written in this note shall die.',
    chinese: '凡将名字写入此本子的人类，必将死亡。',
  },
  {
    id: 2,
    english:
      "This note will not take effect unless the writer has the person's face in their mind when writing his/her name. Therefore, people sharing the same name will not be affected.",
    chinese: '书写时若脑中未浮现对方面孔，则此本子不产生效力。因此，同名同姓者不会同时受到影响。',
  },
  {
    id: 3,
    english:
      "If the cause of death is written within 40 seconds of writing the person's name, it will happen.",
    chinese: '在写下名字后的40秒内（以人类世界时间为准）写明死因，则死亡将按所写方式发生。',
  },
  {
    id: 4,
    english:
      'If the cause of death is not specified, the person will simply die of a heart attack.',
    chinese: '若未写明死因，则当事人将死于心脏麻痹。',
  },
  {
    id: 5,
    english:
      'After writing the cause of death, details of the death should be written in the next 6 minutes and 40 seconds.',
    chinese: '写明死因后，还有6分40秒的时间可以补充死亡的具体经过。',
  },
]
