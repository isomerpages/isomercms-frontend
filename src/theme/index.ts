import { extendTheme } from "@chakra-ui/react"
import { theme as designSystemTheme } from "@opengovsg/design-system-react"

import { components } from "./components/index"
import { colors } from "./foundations/colors"
import { shadows } from "./foundations/shadows"
import { spacing } from "./foundations/spacing"
import { typography } from "./foundations/typography"
import { layerStyles } from "./layerStyles"
import { colorOverrides } from "./overrides/colors"
import { textStyles } from "./textStyles"

const theme = extendTheme(designSystemTheme, {
  styles: {
    global: {
      body: {
        bg: null,
      },
    },
  },
  colors: {
    ...colors,
    // TODO: Delete when designer removes outdated color tokens from Isomer Figma.
    ...colorOverrides,
  },
  components,
  shadows,
  space: spacing,
  fontSizes: typography.fontSize,
  fontWeights: typography.fontWeights,
  lineHeights: typography.lineHeights,
  letterSpacings: typography.letterSpacing,
  textStyles,
  layerStyles,
})

export default theme
