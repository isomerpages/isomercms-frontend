import { ComponentMultiStyleConfig } from "@chakra-ui/theme"
import { anatomy, PartsStyleObject } from "@chakra-ui/theme-tools"

import { layerStyles } from "theme/layerStyles"

export const CARD_THEME_KEY = "card"

// Determines whether the card is single-line or
// is multi-line (has a bottom action drawer)
export type CardVariant = "single" | "multi"

export const parts = anatomy(CARD_THEME_KEY).parts(
  "container",
  "body",
  "footer"
)

const variantSingle: PartsStyleObject<typeof parts> = {
  container: {
    gridTemplateColumns: "1fr 2.5rem",
    gridTemplateAreas: "'body button'",
  },
}

const variantMulti: PartsStyleObject<typeof parts> = {
  container: {
    gridTemplateColumns: "1fr 2.5rem",
    gridTemplateRows: "4.5rem 1fr",
    // This is a 2x2 grid
    gridTemplateAreas: "'body button' 'footer button'",
    gap: "1rem 0rem",
  },
  footer: {
    gridArea: "footer",
  },
}

export const Card: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: {
      display: "grid",
      backgroundColor: "background.action.defaultInverse",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      paddingInlineEnd: "2rem",
      paddingInlineStart: "2rem",
      paddingY: "1.5rem",
      border: "1px solid",
      borderColor: "border.action.light",
      borderRadius: "4px",
      w: "100%",
      _hover: {
        bg: "interaction.muted.main.hover",
      },
      _focusVisible: {
        boxShadow: "0 0 0 1px var(--chakra-colors-utility-focus-default)",
        borderColor: "utility.focus-default",
        outline: "none",
      },
      overflow: "auto",
    },
    body: {
      height: "full",
      overflow: "auto",
      justifyContent: "flex-start",
      display: "flex",
      alignItems: "flex-start",
      textAlign: "left",
      gridArea: "body",
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
