import { ThemeProvider, useToast } from "@opengovsg/design-system-react"
import { initialize, mswDecorator } from "msw-storybook-addon"
import { QueryClient, QueryClientProvider } from "react-query"
import { LoginContext } from "contexts/LoginContext"
import theme from "theme"
import { MOCK_USER } from "mocks/constants"

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

const withLoginContext = (Story) => {
  const toast = useToast()
  return (
    <LoginContext.Provider
      value={{
        logout: async () => {
          toast({
            title: "User is logged out",
            status: "success",
            duration: 9000,
            isClosable: true,
          })
        },
        ...MOCK_USER,
        verifyLoginAndSetLocalStorage: async () => {
          return undefined
        },
      }}
    >
      <Story />
    </LoginContext.Provider>
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
