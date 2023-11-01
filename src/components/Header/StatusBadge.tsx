import {
  Box,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { Badge } from "@opengovsg/design-system-react"
import { BiCheckCircle, BiError, BiLoader } from "react-icons/bi"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { GoDotFill } from "react-icons/go"
import { IconBaseProps } from "react-icons/lib"

import { buildStatus } from "types/stagingBuildStatus"

interface StatusBadgeProps {
  status: buildStatus
  timeLastSaved: number
}

interface StagingPopoverContentProps {
  status: buildStatus
  timeLastSavedInMin: number
}

const getTimeSavedInMins = (timeLastSaved: number): number => {
  const timeLastSavedInMin = Math.floor(
    (Date.now() - timeLastSaved) / 1000 / 60
  )

  return timeLastSavedInMin
}

const StagingPopoverContent = ({
  status,
  timeLastSavedInMin,
}: StagingPopoverContentProps) => {
  let headingText = ""
  let bodyText = ""
  let Icon = (props: IconBaseProps) => <BiLoader {...props} />
  let timeText
  if (timeLastSavedInMin < 60) {
    timeText = `${timeLastSavedInMin} minute${
      timeLastSavedInMin === 1 ? "" : "s"
    } ago`
  } else if (timeLastSavedInMin < 60 * 60) {
    const hours = Math.floor(timeLastSavedInMin / 60)
    timeText = `${hours} hour${hours === 1 ? "" : "s"} ago`
  } else {
    const days = Math.floor(timeLastSavedInMin / 60 / 24)
    timeText = `${days} day${days === 1 ? "" : "s"} ago`
  }
  switch (status) {
    case "READY":
      headingText = `All saved edits from ${timeText} are on staging`
      bodyText = "Click on 'Open staging' to take a look."

      Icon = (props: IconBaseProps) => (
        <BiCheckCircle {...props} color="#0F796F" />
      )

      break
    case "PENDING":
      headingText = `Site building since last save ${timeText}`
      bodyText = "We'll let you know when the staging site is ready."
      Icon = (props: IconBaseProps) => (
        <BiLoader {...props} style={{ animation: "spin 2s linear infinite" }} />
      )
      break
    case "ERROR":
      headingText =
        "We had some trouble updating the staging site since your latest save. "
      bodyText =
        "Don't worry, your production site isn't affected. Try saving your page again. If the issue persists, please contact Isomer Support."
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
        <Text textStyle="body-2">{bodyText}</Text>
      </Box>
    </HStack>
  )
}

export const StatusBadge = ({
  status,
  timeLastSaved,
}: StatusBadgeProps): JSX.Element => {
  const timeLastSavedInMin = getTimeSavedInMins(timeLastSaved ?? Date.now())
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
    <Box position="relative">
      <Popover trigger="hover">
        <PopoverTrigger>
          <Badge colorScheme={colourScheme} variant="subtle" cursor="default">
            <GoDotFill size="1rem" color={dotColor} />
            <Text ml="0.5rem" mr="0.5rem">
              {displayText}
            </Text>
            <BsFillQuestionCircleFill color="#454953" />
          </Badge>
        </PopoverTrigger>
        <PopoverContent width="26.25rem" height="auto" mt="2rem">
          <StagingPopoverContent
            status={status}
            timeLastSavedInMin={timeLastSavedInMin}
          />
        </PopoverContent>
      </Popover>
    </Box>
  )
}
