export const RTE_BLOCKS = {
  ACCORDION: "accordion",
  CARDGRID: "cardgrid",
  DIVIDER: "divider",
} as const

export type RTEBlockValues = typeof RTE_BLOCKS[keyof typeof RTE_BLOCKS]
