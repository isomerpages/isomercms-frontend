import { HStack, Text, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { SiteLaunchFailureImage, SiteLaunchSuccessImage } from "assets"

const SiteLaunchSuccessState = (): JSX.Element => {
  return (
    <>
      <Text
        as="h3"
        textStyle="h3"
        textColor="base.content.strong"
        mb="1.5rem"
        mt="3rem"
      >
        We have lift off! Your site has successfully launched.
      </Text>
      <SiteLaunchSuccessImage />

      <Text textStyle="body-1" textColor="base.content.default" mt="1.5rem">
        View your site status from the Dashboard.
      </Text>
      <Text textStyle="body-1" textColor="base.content.default" mb="3rem">
        You can find your site&apos;s DNS records in the settings page.
      </Text>
      <HStack spacing="3rem">
        <Button variant="link">Back to tasklist</Button>
        <Button>Visit live site</Button>
      </HStack>
    </>
  )
}

const SiteLaunchFailureState = (): JSX.Element => {
  return (
    <>
      <Text
        as="h3"
        textStyle="h3"
        textColor="base.content.strong"
        mb="1.5rem"
        mt="3rem"
      >
        Site failed to launch, please contact the Isomer team
      </Text>
      <SiteLaunchFailureImage />

      <Text
        textStyle="body-1"
        textColor="base.content.default"
        mt="1.5rem"
        textAlign="center"
      >
        The most common reason for site launch failure is unknown cloudflare
        records. Please remove all existing domains and try site launch again.
      </Text>

      <Button
        mt="1.5rem"
        as="a"
        href="mailto:support@isomer.gov.sg?subject=Site%20Launch%20Failure&body=Hello%20Isomer%20Support,"
      >
        <Text textColor="base.content.inverse" textStyle="subhead-1">
          Email Isomer support
        </Text>
      </Button>
    </>
  )
}

export const SiteLaunchFinalState = (): JSX.Element => {
  const { siteLaunchStatusProps } = useSiteLaunchContext()
  const isSuccess = siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHED"

  return (
    <VStack w="65%">
      {isSuccess ? <SiteLaunchSuccessState /> : <SiteLaunchFailureState />}
    </VStack>
  )
}
