import { ThemeProvider } from "@opengovsg/design-system-react"
import theme from "theme"
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
  (Story) => (
    <ThemeProvider resetCSS theme={theme}>
      <Story />
    </ThemeProvider>
  ),
]
