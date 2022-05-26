import { VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

const Home = (): JSX.Element => {
  return (
    <VStack
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      h="100vh"
      bg="white"
    >
      <img
        src={`${process.env.PUBLIC_URL}/img/logo.svg`}
        alt="Isomer CMS logo"
      />
      <Button
        type="button"
        onClick={() => {
          window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github-redirect`
        }}
      >
        Login with GitHub
      </Button>
    </VStack>
  )
}

export default Home
