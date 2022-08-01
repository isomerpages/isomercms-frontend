import {
  Box,
  Divider,
  Flex,
  GridItem,
  GridProps,
  Text,
  Link,
  Grid,
  HStack,
  VStack,
  Icon,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react"
import { Button, GovtMasthead, Tab } from "@opengovsg/design-system-react"
import { useState } from "react"
import { BiInfoCircle } from "react-icons/bi"

import { useSuccessToast } from "utils/toasts"

import { sendLoginOtp, verifyLoginOtp } from "api"
import { IsomerLogo, LoginImage, OGPLogo } from "assets"

import {
  LoginForm,
  LoginFormInputs,
  OtpForm,
  OtpFormInputs,
} from "./components"

export type LoginOtpData = {
  email: string
}

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

export const LoginPage = (): JSX.Element => {
  const successToast = useSuccessToast()

  const LoginContent = (): JSX.Element => {
    const [email, setEmail] = useState<string>()

    const handleSendOtp = async ({ email: emailInput }: LoginFormInputs) => {
      const trimmedEmail = emailInput.trim()
      try {
        await sendLoginOtp(trimmedEmail)
      } catch (err) {
        console.log(err)
        throw err
      }
      successToast({
        description: `OTP sent to ${trimmedEmail}`,
      })
      setEmail(trimmedEmail)
    }

    const handleVerifyOtp = async ({ otp }: OtpFormInputs) => {
      // Should not happen, since OtpForm component is only shown when there is
      // already an email state set.
      if (!email) {
        throw new Error("Something went wrong")
      }
      try {
        await verifyLoginOtp(email, otp)
      } catch (err) {
        console.log(err)
        throw err
      }
      window.location.reload()
    }

    const handleResendOtp = async () => {
      // Should not happen, since OtpForm component is only shown when there is
      // already an email state set.
      if (!email) {
        throw new Error("Something went wrong")
      }
      try {
        await sendLoginOtp(email)
      } catch (err) {
        console.log(err)
        throw err
      }
      successToast({
        description: `OTP sent to ${email}!`,
      })
    }

    return (
      <VStack gap="2.5rem" alignItems="start" width="65%">
        <Text
          fontSize="2.5rem"
          color="primary.500"
          fontWeight="600"
          lineHeight="1"
        >
          Rapidly build & launch informational sites
        </Text>
        <Box p="1rem" bgColor="background.action.infoInverse">
          <HStack spacing="1rem" w="100%">
            <Icon
              as={BiInfoCircle}
              type="solid"
              fill="icon.default"
              fontSize="1rem"
            />
            <Text>
              We’re moving in phases from GitHub IDs to email addresses as the
              login method. If you can’t log in with your GitHub ID, please use
              your email address.
            </Text>
          </HStack>
        </Box>
        <Tabs width="100%">
          <TabList>
            <Tab>Github Login</Tab>
            <Tab>Email Login</Tab>
          </TabList>
          <TabPanels pt="2rem" minHeight="11rem">
            <TabPanel>
              <Button
                as={Link}
                rel="noopener noreferrer"
                textDecoration="none"
                _hover={{
                  textDecoration: "none",
                  bgColor: "primary.600",
                }}
                href={`${process.env.REACT_APP_BACKEND_URL}/auth/github-redirect`}
              >
                <Text color="white">Log in with GitHub</Text>
              </Button>
            </TabPanel>
            <TabPanel>
              {!email ? (
                <LoginForm onSubmit={handleSendOtp} />
              ) : (
                <OtpForm
                  email={email}
                  onSubmit={handleVerifyOtp}
                  onResendOtp={handleResendOtp}
                />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    )
  }

  return (
    <Flex flex={1} flexDir="column" w="100vw" h="100vh">
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
              <Link
                href="https://form.gov.sg/#!/5dc80f7c03b2790012428dc5"
                rel="noopener noreferrer"
                target="_blank"
                textDecorationLine="none"
              >
                Contact Us
              </Link>
              <Link
                href="https://go.gov.sg/isomercms-guide/"
                rel="noopener noreferrer"
                target="_blank"
                textDecorationLine="none"
              >
                Guide
              </Link>
              <Text>Privacy</Text>
              <Text>Terms of use</Text>
              <Link
                href="https://www.tech.gov.sg/report_vulnerability/"
                textDecorationLine="none"
              >
                Report vulnerability
              </Link>
            </HStack>
          </Flex>
        </GridItem>
      </Grid>
    </Flex>
  )
}
