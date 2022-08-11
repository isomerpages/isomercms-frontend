import { ThemeProvider, useToast } from "@opengovsg/design-system-react"
import { initialize, mswDecorator } from "msw-storybook-addon"
import { QueryClient, QueryClientProvider } from "react-query"
import { LoginProvider } from "contexts/LoginContext"
import theme from "theme"
import { MINIMAL_VIEWPORTS } from "@storybook/addon-viewport"
import { handlers } from "../src/mocks/handlers"

const isomerViewports = {
  GSIB: {
    name: "GSIB Laptop",
    styles: {
      width: "1920px",
      height: "1080px",
    },
  },
}

export const parameters = {
  msw: {
    handlers: {
      default: handlers,
    },
  },
  viewport: {
    viewports: {
      ...MINIMAL_VIEWPORTS,
      ...isomerViewports,
    },
  },
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

const withLoginContext = (Story) => {
  const toast = useToast()
  return (
    <LoginProvider>
      <Story />
    </LoginProvider>
  )
}

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

export const decorators = [
  withLoginContext,
  withThemeProvider,
  withReactQuery,
  mswDecorator,
]
