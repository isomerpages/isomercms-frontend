import { ComponentMultiStyleConfig } from "@chakra-ui/theme"
import { anatomy } from "@chakra-ui/theme-tools"

export const CARD_THEME_KEY = "card"

// NOTE: variant denotes the position of the buttons
// Left means that only the top-left will be allocated space for a button
// Right means that only the bottom-right will be allocated space
// Full will have space for both
export type CardVariant = "full" | "left" | "right"

export const parts = anatomy(CARD_THEME_KEY).parts("container", "body")

export const Card: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: {
      backgroundColor: "background.action.defaultInverse",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      textAlign: "left",
      paddingInline: "2rem",
      paddingY: "1rem",
      border: "1px solid",
      borderColor: "border.action.light",
      borderRadius: "4px",
      w: "100%",
    },
    body: {
      py: "0.5rem",
      justifyContent: "flex-start",
      display: "flex",
      alignItems: "flex-start",
      textAlign: "left",
      gridArea: "body",
    },
  },
}
