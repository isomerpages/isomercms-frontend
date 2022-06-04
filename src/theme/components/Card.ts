import { ComponentMultiStyleConfig } from "@chakra-ui/theme"
import { anatomy, PartsStyleObject } from "@chakra-ui/theme-tools"

import { colours } from "theme/foundations/colours"

export const CARD_THEME_KEY = "card"

// Determines whether the card is single-line or
// is multi-line (has a bottom action drawer)
export type CardVariant = "single" | "multi"

export const parts = anatomy(CARD_THEME_KEY).parts("container", "content")

const borderColour = (colours.border.action as Record<string, string>).default

const variantSingle: PartsStyleObject<typeof parts> = {
  content: {
    gridTemplateColumns: "1fr 2.5rem",
    gridTemplateAreas: "'body button'",
  },
}

const variantMulti: PartsStyleObject<typeof parts> = {
  content: {
    gridTemplateColumns: "1fr 2.5rem",
    // This is a 2x2 grid
    gridTemplateAreas: "'body body' 'caption button'",
  },
}

export const Card: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: {},
    content: {
      display: "grid",
      backgroundColor: "background.action.defaultInverse",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      paddingInlineEnd: "2rem",
      paddingInlineStart: "1.5rem",
      paddingY: "1.5rem",
      borderRadius: "4px",
      w: "100%",
      _hover: {
        backgroundColor: "background.action.altInverse",
      },
      _focus: {
        boxShadow: `0 0 0 2px ${borderColour}`,
      },
    },
  },
  variants: {
    single: variantSingle,
    multi: variantMulti,
  },
  defaultProps: {
    variant: "single",
  },
}
