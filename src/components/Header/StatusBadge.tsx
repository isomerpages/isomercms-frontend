import {
  Box,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { Badge } from "@opengovsg/design-system-react"
import { BiCheckCircle, BiError, BiLoader } from "react-icons/bi"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { GoDotFill } from "react-icons/go"
import { IconBaseProps } from "react-icons/lib"

import { FEATURE_FLAGS } from "constants/featureFlags"

import { FeatureFlags } from "types/featureFlags"
import { BuildStatus } from "types/stagingBuildStatus"

interface StatusBadgeProps {
  status: BuildStatus
}

interface StagingPopoverContentProps {
  status: BuildStatus
}

const StagingPopoverContent = ({ status }: StagingPopoverContentProps) => {
  let headingText = ""
  let bodyText = ""

  let Icon = (props: IconBaseProps) => <BiLoader {...props} />

  switch (status) {
    case "READY":
      headingText = `All saved edits are on staging`
      bodyText = "Click on 'Open staging' to take a look."

      Icon = (props: IconBaseProps) => (
        <BiCheckCircle {...props} color="#0F796F" />
      )

      break
    case "PENDING":
      headingText = `Staging site is building`
      bodyText =
        "We detected a change in your site. We'll let you know when the staging site is ready."
      Icon = (props: IconBaseProps) => (
        <BiLoader {...props} style={{ animation: "spin 2s linear infinite" }} />
      )
      break
    case "ERROR":
      headingText =
        "We had some trouble updating the staging site since the latest save. "
      bodyText =
        "Don't worry, your production site isn't affected. Try saving your page again. If the issue persists, please contact support@isomer.gov.sg."

      Icon = (props: IconBaseProps) => <BiError {...props} />
      break
    default:
      break
  }

  return (
    <HStack align="start" spacing="0.75rem" m="0.75rem">
      <Box width="1.6rem" height="1.6rem" p="0.05rem">
        <Icon size="1.5rem" />
      </Box>

      <Box alignItems="left">
        <Text textStyle="subhead-2">{headingText}</Text>

        <Text textStyle="body-2" mt="0.25rem">
          {bodyText}
        </Text>
      </Box>
    </HStack>
  )
}

export const StatusBadge = ({ status }: StatusBadgeProps): JSX.Element => {
  if (
    useFeatureIsOn<FeatureFlags>(
      FEATURE_FLAGS.IS_SHOW_STAGING_BUILD_STATUS_ENABLED
    ) !== true
  ) {
    return <> </>
  }
  let displayText = ""
  let colourScheme = ""
  let dotColor = "#505660"
  switch (status) {
    case "PENDING":
      displayText = "Updating staging site"
      colourScheme = "grey"
      dotColor = "#505660"
      break
    case "READY":
      displayText = "Staging site is ready"
      colourScheme = "success"
      dotColor = "#0F796F"
      break
    case "ERROR":
      displayText = "Staging site is out of date"
      colourScheme = "warning"
      dotColor = "#FFDA68"
      break
    default:
      break
  }

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Badge
          colorScheme={colourScheme}
          variant="subtle"
          cursor="default"
          borderRadius="3.125rem"
        >
          <GoDotFill size="1rem" color={dotColor} />
          <Text ml="0.25rem" mr="0.5rem">
            {displayText}
          </Text>
          <BsFillQuestionCircleFill color="#454953" />
        </Badge>
      </PopoverTrigger>
      <Box position="relative">
        <PopoverContent width="26.25rem" height="auto">
          <StagingPopoverContent status={status} />
        </PopoverContent>
      </Box>
    </Popover>
  )
}
