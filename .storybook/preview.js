import { ThemeProvider } from "@opengovsg/design-system-react"
import theme from "../src/theme"
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  docs: {
    inlineStories: true,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  (storyFn) => (
    <ThemeProvider resetCSS theme={theme}>
      {storyFn()}
    </ThemeProvider>
  ),
]
