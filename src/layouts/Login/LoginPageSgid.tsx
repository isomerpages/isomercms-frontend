import {
  Box,
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
import { useEffect, useState, PropsWithChildren, useMemo } from "react"
import { useHistory, useLocation } from "react-router-dom"

import { PRIVACY_POLICY_LINK, TERMS_OF_USE_LINK } from "constants/config"

import { useGetSgidAuth, useLogin, useVerifyOtp } from "hooks/loginHooks"

import { getAxiosErrorMessage } from "utils/axios"
import { useErrorToast, useSuccessToast } from "utils/toasts"

import { IsomerLogo, LoginImage, OGPLogo } from "assets"
import { DEFAULT_RETRY_MSG } from "utils"

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
  const { search } = useLocation()

  const [statusCode, setStatusCode] = useState("200")

  useEffect(() => {
    const params = new URLSearchParams(search)
    const status = params.get("status")
    if (status) setStatusCode(status)
  }, [search])
  const errorToast = useErrorToast()
  const { mutateAsync: sendLoginOtp, error: loginError } = useLogin()

  const { mutateAsync: verifyLoginOtp, error: verifyError } = useVerifyOtp()

  const {
    mutateAsync: getSgidAuth,
    isLoading: isSgidAuthLoading,
  } = useGetSgidAuth()

  const successToast = useSuccessToast()
  const [email, setEmail] = useState<string>("")
  const history = useHistory()

  const handleSendOtp = async ({ email: emailInput }: LoginProps) => {
    const trimmedEmail = emailInput.trim()
    await sendLoginOtp({ email: trimmedEmail }) // Non-2xx responses will be caught by axios and thrown as error
    successToast({
      id: "send-otp-success",
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
      id: "resend-otp-success",
      description: `OTP sent to ${email}`,
    })
  }

  useEffect(() => {
    if (!errorToast || !statusCode || statusCode === "200") return
    let errorMessage = ""
    switch (statusCode) {
      case "401":
        errorMessage =
          "Your email has not been whitelisted to use sgID login. Please use another method of login."
        break
      default:
        errorMessage = `Something went wrong. ${DEFAULT_RETRY_MSG}`
    }
    errorToast({
      id: "sgid-login-error",
      title: "Error",
      description: errorMessage,
    })
  }, [errorToast, statusCode])

  return (
    <VStack gap="2.5rem" alignItems="start" width="65%">
      <Text fontSize="2.5rem" color="text.title.brand" textStyle="display-2">
        Rapidly build & launch informational sites
      </Text>
      <InlineMessage>
        We’re moving in phases from GitHub IDs to email addresses as the login
        method. For those currently using GitHub ID, you’ll be informed when you
        can log in using the email method.
      </InlineMessage>
      <Tabs width="100%">
        <TabList>
          <Tab>Github Login</Tab>
          <Tab>Email Login</Tab>
          <Tab>sgID Login</Tab>
        </TabList>
        <TabPanels pt="2rem" minHeight="16.5rem">
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
          <TabPanel>
            <InlineMessage mb="1rem">
              This is an experimental service currently offered to OGP officers
              only.
            </InlineMessage>
            <Button onClick={() => getSgidAuth()} isLoading={isSgidAuthLoading}>
              Log in with Singpass app
            </Button>
          </TabPanel>
          <Text color="text.helper" fontSize="0.625rem" pt="2rem">
            By clicking ‘Log in’, you are acknowledging and agreeing to Isomer’s{" "}
            <Link href={TERMS_OF_USE_LINK} isExternal>
              Terms of Use
            </Link>
            {" and our "}
            <Link href={PRIVACY_POLICY_LINK} isExternal>
              Privacy policy
            </Link>
          </Text>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}

export const LoginPageSgid = (): JSX.Element => (
  <Flex flex={1} flexDir="column" w="100%" h="100vh">
    <GovtMasthead />
    <Grid {...LOGIN_GRID_LAYOUT}>
      <GridItem area="image" bgColor="primary.500">
        <Flex h="100%" w="100%" alignItems="end" justifyContent="center">
          <LoginImage maxH="100%" />
        </Flex>
      </GridItem>
      <GridItem area="content" bgColor="white">
        <Flex h="100%" maxW="54rem" alignItems="center" justifyContent="center">
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
          <Box w="65%">
            <HStack fontSize="0.75rem" gap="1.5rem" justifyContent="end">
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
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  </Flex>
)
