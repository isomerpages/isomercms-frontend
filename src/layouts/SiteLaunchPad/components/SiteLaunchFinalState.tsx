import { HStack, Link, Text, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import {
  SiteLaunchFailureImage,
  SiteLaunchPendingImage,
  SiteLaunchSuccessImage,
} from "assets"

interface SiteLaunchFinalStateProps {
  decreasePageNumber: () => void
}

const SiteLaunchSuccessState = ({
  decreasePageNumber,
}: SiteLaunchFinalStateProps): JSX.Element => {
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
        <Button
          variant="link"
          colorScheme="neutral"
          onClick={decreasePageNumber}
        >
          Back to tasklist
        </Button>
        <Link href="google.com">
          <Button>Visit live site</Button>
        </Link>
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
        Site failed to launch, please contact Isomer support.
      </Text>
      <SiteLaunchFailureImage />

      <Text
        textStyle="body-1"
        textColor="base.content.default"
        mt="1.5rem"
        textAlign="center"
      >
        The most common reason for site launch failure is unknown CloudFront
        records. Isomer support will get back to you as soon as we can.
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

const SiteLaunchInProgressState = ({
  decreasePageNumber,
}: SiteLaunchFinalStateProps): JSX.Element => {
  return (
    <>
      <Text
        textStyle="h3"
        textColor="base.content.strong"
        mt="3rem"
        mb="1.5rem"
      >
        We&apos;re keeping an eye out... Be right back!
      </Text>
      <SiteLaunchPendingImage />
      <Text
        textStyle="body-1"
        textColor="base.content.default"
        mt="1.5rem"
        textAlign="center"
      >
        Come back to this space to track your site status - you may see an error
        when visiting your domain at this moment. Leave this window open or exit
        and come back later.
      </Text>
      <Button
        variant="link"
        colorScheme="neutral"
        mt="3rem"
        onClick={decreasePageNumber}
      >
        Back to tasklist
      </Button>
    </>
  )
}

export const SiteLaunchFinalState = ({
  decreasePageNumber,
}: SiteLaunchFinalStateProps): JSX.Element => {
  const { siteLaunchStatusProps } = useSiteLaunchContext()
  const State = () => {
    if (siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHED") {
      return <SiteLaunchSuccessState decreasePageNumber={decreasePageNumber} />
    }
    if (siteLaunchStatusProps?.siteLaunchStatus === "FAILURE") {
      return <SiteLaunchFailureState />
    }
    return <SiteLaunchInProgressState decreasePageNumber={decreasePageNumber} />
  }

  return (
    <VStack w="65%">
      <State />
    </VStack>
  )
}
