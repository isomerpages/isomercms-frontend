import {
  Divider,
  Flex,
  GridItem,
  GridProps,
  Text,
  Grid,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import {
  Button,
  GovtMasthead,
  Tab,
  InlineMessage,
  Link,
} from "@opengovsg/design-system-react"
import { useState, PropsWithChildren } from "react"
import { useHistory } from "react-router-dom"

import { useLogin, useVerifyOtp } from "hooks/loginHooks"

import { getAxiosErrorMessage } from "utils/axios"
import { useSuccessToast } from "utils/toasts"

import { IsomerLogo, LoginImage, OGPLogo } from "assets"

import { LoginForm, LoginProps, OtpForm, OtpProps } from "./components"

const LOGIN_GRID_LAYOUT: Pick<
  GridProps,
  | "gridTemplateAreas"
  | "gridTemplateColumns"
  | "gridTemplateRows"
  | "height"
  | "width"
> = {
  gridTemplateAreas: `"image content" 
                      "credits links"`,
  gridTemplateColumns: "2fr 4fr",
  gridTemplateRows: "1fr 5rem",
  height: "100%",
  width: "100%",
}

interface FooterLinkProps {
  link: string
}

const FooterLink = ({
  link,
  children,
}: PropsWithChildren<FooterLinkProps>): JSX.Element => (
  <Link
    href={link}
    isExternal
    textDecorationLine="none"
    color="text.link.dark"
    _hover={{
      color: "text.link.dark",
      textDecorationLine: "underline",
    }}
  >
    {children}
  </Link>
)

const LoginContent = (): JSX.Element => {
  const { mutateAsync: sendLoginOtp, error: loginError } = useLogin()

  const { mutateAsync: verifyLoginOtp, error: verifyError } = useVerifyOtp()

  const successToast = useSuccessToast()
  const [email, setEmail] = useState<string>("")
  const history = useHistory()

  const handleSendOtp = async ({ email: emailInput }: LoginProps) => {
    const trimmedEmail = emailInput.trim()
    await sendLoginOtp({ email: trimmedEmail }) // Non-2xx responses will be caught by axios and thrown as error
    successToast({
      description: `OTP sent to ${trimmedEmail}`,
    })
    setEmail(trimmedEmail)
  }

  const handleVerifyOtp = async ({ otp }: OtpProps) => {
    await verifyLoginOtp({ email, otp })
    history.replace("/sites")
  }

  const handleResendOtp = async () => {
    await sendLoginOtp({ email })
    successToast({
      description: `OTP sent to ${email}`,
    })
  }

  return (
    <VStack gap="2.5rem" alignItems="start" width="65%">
      <Text fontSize="2.5rem" color="text.title.brand" textStyle="display-2">
        Rapidly build & launch informational sites
      </Text>
      <InlineMessage>
        We’re moving in phases from GitHub IDs to email addresses as the login
        method. If you can’t log in with your GitHub ID, please use your email
        address.
      </InlineMessage>
      <Tabs width="100%">
        <TabList>
          <Tab>Github Login</Tab>
          <Tab>Email Login</Tab>
        </TabList>
        <TabPanels pt="2rem">
          <TabPanel>
            <Button
              as={Link}
              rel="noopener noreferrer"
              textDecoration="none"
              _hover={{
                textDecoration: "none",
                bgColor: "primary.600",
              }}
              href={`${process.env.REACT_APP_BACKEND_URL_V2}/auth/github-redirect`}
            >
              <Text color="white">Log in with GitHub</Text>
            </Button>
          </TabPanel>
          <TabPanel>
            {email ? (
              <OtpForm
                email={email}
                onSubmit={handleVerifyOtp}
                onResendOtp={handleResendOtp}
                errorMessage={
                  getAxiosErrorMessage(loginError) ||
                  getAxiosErrorMessage(verifyError)
                }
              />
            ) : (
              <LoginForm
                onSubmit={handleSendOtp}
                errorMessage={getAxiosErrorMessage(loginError)}
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Text color="text.helper" fontSize="0.625rem">
        By clicking ‘Log in’, you are acknowledging and agreeing to Isomer’s{" "}
        <Link
          href="https://guide.isomer.gov.sg/terms-and-privacy/terms-of-use"
          isExternal
        >
          Terms of Use
        </Link>
        {" and our "}
        <Link
          href="https://guide.isomer.gov.sg/terms-and-privacy/privacy-statement"
          isExternal
        >
          Privacy policy
        </Link>
      </Text>
    </VStack>
  )
}

export const LoginPage = (): JSX.Element => (
  <Flex flex={1} flexDir="column" w="100%" h="100vh">
    <GovtMasthead />
    <Grid {...LOGIN_GRID_LAYOUT}>
      <GridItem area="image" bgColor="primary.500">
        <Flex h="100%" w="100%" alignItems="end" justifyContent="center">
          <LoginImage maxH="100%" />
        </Flex>
      </GridItem>
      <GridItem area="content" bgColor="white">
        <Flex h="100%" alignItems="center" justifyContent="center">
          <LoginContent />
        </Flex>
      </GridItem>
      <GridItem area="credits" bgColor="primary.100">
        <Flex h="100%" alignItems="center" justifyContent="center">
          <HStack h="2rem" gap="2rem">
            <IsomerLogo />
            <Divider orientation="vertical" borderColor="neutral.300" />
            <OGPLogo />
          </HStack>
        </Flex>
      </GridItem>
      <GridItem area="links" bgColor="white">
        <Flex h="100%" alignItems="center" justifyContent="center">
          <HStack fontSize="0.75rem" gap="1.5rem">
            <FooterLink link="https://form.gov.sg/#!/5dc80f7c03b2790012428dc5">
              Contact Us
            </FooterLink>
            <FooterLink link="https://go.gov.sg/isomercms-guide/">
              Guide
            </FooterLink>
            <FooterLink link="https://www.tech.gov.sg/report_vulnerability/">
              Report vulnerability
            </FooterLink>
          </HStack>
        </Flex>
      </GridItem>
    </Grid>
  </Flex>
)
