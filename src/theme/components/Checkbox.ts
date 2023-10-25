import { checkboxAnatomy } from "@chakra-ui/anatomy"
import { ComponentMultiStyleConfig } from "@chakra-ui/theme"

export const Checkbox: ComponentMultiStyleConfig = {
  parts: checkboxAnatomy.keys,
  variants: {
    transparent: {
      control: {
        bg: "transparent",
        borderColor: "interaction.main-subtle.default",
        width: "1.25rem",
        height: "1.25rem",
      },
    },
  },
}
