import { extendTheme } from "@chakra-ui/react"

import { colours } from "./foundations/colours"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: null,
      },
    },
  },
  colors: colours,
})

export default theme
