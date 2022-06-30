import { ThemeProvider } from "@opengovsg/design-system-react"
import { initialize, mswDecorator } from "msw-storybook-addon"
import { QueryClient, QueryClientProvider } from "react-query"
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

// Initialize MSW
initialize()

const withThemeProvider = (Story) => (
  <ThemeProvider resetCSS theme={theme}>
    <Story />
  </ThemeProvider>
)

const withReactQuery = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  )
}

export const decorators = [withThemeProvider, withReactQuery, mswDecorator]
