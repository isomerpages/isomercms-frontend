import { extendTheme } from "@chakra-ui/react"
import { theme as designSystemTheme } from "@opengovsg/design-system-react"

import { components } from "./components/index"
import { colours } from "./foundations/colours"

const theme = extendTheme(designSystemTheme, {
  styles: {
    global: {
      body: {
        bg: null,
      },
    },
  },
  colors: colours,
  components,
})

export default theme
