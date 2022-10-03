import { ComponentMultiStyleConfig } from "@chakra-ui/theme"
import { anatomy, PartsStyleObject } from "@chakra-ui/theme-tools"

export const DISPLAY_CARD_THEME_KEY = "displayCard"

// Determines whether the display card has content, or only contains the title,
// subtitle, icon and any action button, or only contains the content
export type DisplayCardVariant = "header" | "content" | "full"

export const parts = anatomy(DISPLAY_CARD_THEME_KEY).parts(
  "container",
  "header",
  "title",
  "caption",
  "content",
  "footer"
)

const variantHeader: PartsStyleObject<typeof parts> = {}

const variantContent: PartsStyleObject<typeof parts> = {
  container: {
    paddingY: "1rem",
  },
  content: {
    display: "flex",
    overflow: "auto",
  },
}

const variantFull: PartsStyleObject<typeof parts> = {
  header: {
    paddingBottom: "0.5rem",
  },
  content: {
    display: "flex",
    overflow: "auto",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    textAlign: "left",
  },
}

export const DisplayCard: ComponentMultiStyleConfig = {
  parts: parts.keys,
  baseStyle: {
    container: {
      display: "flex",
      justifyContent: "flex-start",
      boxSizing: "border-box",
      paddingInlineEnd: "2rem",
      paddingInlineStart: "2rem",
      paddingTop: "2rem",
      paddingBottom: "1.5rem",
      border: "1px solid",
      borderColor: "border.action.light",
      borderRadius: "4px",
      w: "100%",
      overflow: "auto",
      alignItems: "start",
    },
    header: {
      display: "flex",
      alignItems: "start",
      w: "100%",
    },
    title: {
      textStyle: "h3",
      marginRight: "0.625rem",
      paddingBottom: "0",
    },
    caption: {
      textStyle: "caption-2",
      paddingTop: "0.25rem",
      color: "text.helper",
    },
    content: {
      overflow: "auto",
      justifyContent: "flex-start",
      display: "flex",
      alignItems: "flex-start",
      textAlign: "left",
      marginTop: "0rem",
      w: "100%",
    },
    footer: {
      display: "flex",
      paddingTop: "1.625rem",
      paddingBottom: "0.5625rem",
      w: "100%",
    },
  },
  variants: {
    header: variantHeader,
    content: variantContent,
    full: variantFull,
  },
  defaultProps: {
    variant: "header",
  },
}
