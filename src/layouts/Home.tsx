import { Text, Link, VStack } from "@chakra-ui/react"
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
      <Text color="text.helper" fontSize="0.625rem" pt="1rem">
        By clicking “Log in”, you are acknowledging and agreeing to Isomer’s{" "}
        <Link
          href="https://guide.isomer.gov.sg/terms-and-privacy/terms-of-use"
          isExternal
          fontSize="0.625rem"
        >
          Terms of Use
        </Link>
        {" and our "}
        <Link
          href="https://guide.isomer.gov.sg/terms-and-privacy/privacy-statement"
          isExternal
          fontSize="0.625rem"
        >
          Privacy policy
        </Link>
      </Text>
    </VStack>
  )
}

export default Home
