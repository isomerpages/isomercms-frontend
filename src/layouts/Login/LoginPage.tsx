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
  RestrictedGovtMasthead,
  Tab,
  Infobox,
  Link,
} from "@opengovsg/design-system-react"
import { useEffect, useState, PropsWithChildren } from "react"
import { useHistory, useLocation } from "react-router-dom"

import { PRIVACY_POLICY_LINK, TERMS_OF_USE_LINK } from "constants/config"

import { useGetSgidAuth, useLogin, useVerifyOtp } from "hooks/loginHooks"

import { getAxiosErrorMessage } from "utils/axios"
import { useErrorToast, useSuccessToast } from "utils/toasts"

import {
  IsomerLogoInverted,
  LoginImage,
  OGPLogoInverted,
  SingpassLogo,
} from "assets"
import { DEFAULT_RETRY_MSG } from "utils"

import { LoginForm, LoginProps, OtpForm, OtpProps } from "./components"

const SGID_AGENCY_FAQ_LINK =
  "https://docs.id.gov.sg/faq-users#as-a-government-officer-why-am-i-not-able-to-login-to-my-work-tool-using-sgid"

const LOGIN_GRID_LAYOUT: Pick<
  GridProps,
  | "gridTemplateAreas"
  | "gridTemplateColumns"
  | "gridTemplateRows"
  | "height"
  | "width"
  | "backgroundColor"
> = {
  gridTemplateAreas: `"image . content ." 
                      "credits . links ."`,
  gridTemplateColumns: "5fr 1fr 5fr 1fr",
  gridTemplateRows: "1fr 5rem",
  height: "100%",
  width: "100%",
  backgroundColor: "base.content.inverse",
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

  const params = new URLSearchParams(search)
  const statusCode = params.get("status")

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
    try {
      await sendLoginOtp({ email: trimmedEmail }) // Non-2xx responses will be caught by axios and thrown as error
    } catch (e) {
      // Needed for react-hook-form to reset isSubmitting
      return
    }
    successToast({
      id: "send-otp-success",
      description: `OTP sent to ${trimmedEmail}`,
    })
    setEmail(trimmedEmail)
  }

  const handleVerifyOtp = async ({ otp }: OtpProps) => {
    try {
      await verifyLoginOtp({ email, otp })
    } catch (e) {
      // Needed for react-hook-form to reset isSubmitting
      return
    }
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
    <VStack gap="2.5rem" alignItems="start" width="100%">
      <Infobox>
        We’re moving in phases from GitHub IDs to email addresses as the login
        method. For those currently using GitHub ID, you’ll be informed when you
        can log in using the email method.
      </Infobox>
      <Tabs width="100%">
        <TabList>
          <Tab>Email Login</Tab>
          <Tab>Github Login</Tab>
        </TabList>
        <TabPanels pt="2rem" minHeight="16.5rem">
          <TabPanel>
            <Button
              onClick={() => getSgidAuth()}
              isLoading={isSgidAuthLoading}
              w="full"
            >
              Log in with <SingpassLogo mb="-0.2rem" /> app
            </Button>
            <Text
              mt="1rem"
              color="interaction.links.neutral-default"
              fontSize="0.75rem"
            >
              Public officers in{" "}
              <Link
                href={SGID_AGENCY_FAQ_LINK}
                isExternal
                color="interaction.links.neutral-default"
              >
                select organisations
              </Link>{" "}
              can use this option.
            </Text>
            <Flex align="center" py="3rem">
              <Divider />
              <Text px="1.5rem">or</Text>
              <Divider />
            </Flex>
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
            <Button
              as={Link}
              rel="noopener noreferrer"
              textDecoration="none"
              w="full"
              _hover={{
                textDecoration: "none",
                bgColor: "primary.600",
              }}
              href={`${process.env.REACT_APP_BACKEND_URL_V2}/auth/github-redirect`}
            >
              <Text color="white">Log in with GitHub</Text>
            </Button>
          </TabPanel>
          <Text color="text.helper" fontSize="0.625rem" pt="2rem">
            {
              "By logging into the IsomerCMS, you are acknowledging and agreeing to Isomer's "
            }
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

export const LoginPage = (): JSX.Element => (
  <Flex flex={1} flexDir="column" w="100%" h="100vh">
    <RestrictedGovtMasthead />
    <Grid {...LOGIN_GRID_LAYOUT}>
      <GridItem area="image" bgColor="primary.500">
        <VStack
          h="100%"
          w="100%"
          alignItems="center"
          justifyContent="center"
          px="10%"
          py="2rem"
        >
          <Text
            fontSize="2.25rem"
            color="base.content.inverse"
            textStyle="h2"
            maxW="90%"
            pb="3.5rem"
          >
            Rapidly build & launch informational sites
          </Text>
          <LoginImage maxH="100%" />
        </VStack>
      </GridItem>
      <GridItem area="content" bgColor="white">
        <Flex
          h="100%"
          alignItems="start"
          justifyContent="base.content.inverse"
          pt="5vh"
        >
          <LoginContent />
        </Flex>
      </GridItem>
      {/* Custom colour to match stairs */}
      <GridItem area="credits" bgColor="primary.500" borderColor="primary.500">
        <Flex h="100%" alignItems="center" justifyContent="center">
          <HStack h="2rem" gap="2rem">
            <IsomerLogoInverted />
            <Divider orientation="vertical" borderColor="text.inverse" />
            <OGPLogoInverted />
          </HStack>
        </Flex>
      </GridItem>
      <GridItem area="links" bgColor="base.content.inverse">
        <Flex h="100%" alignItems="center" justifyContent="center">
          <Box w="100%">
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
