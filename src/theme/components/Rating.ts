import { createMultiStyleConfigHelpers } from "@chakra-ui/react"
import { anatomy } from "@chakra-ui/theme-tools"

import { textStyles } from "theme/textStyles"

const parts = anatomy("rating").parts("button", "container")

const {
  definePartsStyle,
  defineMultiStyleConfig,
} = createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  container: {
    display: "flex",
    flexFlow: "row nowrap",
    listStyleType: "none",
    alignItems: "flex-start",
    gap: "1.5rem",
    w: "full",
    alignSelf: "center",
    px: "1.16rem",
    py: "0.5rem",
  },
  button: {
    ...textStyles["subhead-2"],
    minH: "auto",
    minW: "auto",
    _active: {
      bg: "interaction.support.selected",
      color: "base.content.inverse",
      _hover: {
        bg: "interaction.support.selected",
      },
      _disabled: {
        bg: "interaction.support.disabled",
        color: "interaction.support.disabled-content",
      },
    },
  },
})

export const Rating = defineMultiStyleConfig({
  baseStyle,
})
