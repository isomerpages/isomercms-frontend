import {
  Box,
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { Badge } from "@opengovsg/design-system-react"
import { BiCheckCircle, BiError, BiLoader } from "react-icons/bi"
import { BsFillQuestionCircleFill } from "react-icons/bs"
import { GoDotFill } from "react-icons/go"
import { IconBaseProps } from "react-icons/lib"
import { useParams } from "react-router-dom"

import { useGetStagingStatus } from "hooks/useGetStagingStatus"

import { BuildStatus } from "types/stagingBuildStatus"

interface StagingPopoverContentProps {
  status: BuildStatus
}

const StagingPopoverContent = ({ status }: StagingPopoverContentProps) => {
  let headingText = ""
  let bodyText = ""

  let biLoaderIcon = (props: IconBaseProps) => <BiLoader {...props} />

  switch (status) {
    case "READY":
      headingText = `All saved edits are on staging`
      bodyText = "Click 'Open staging' to see a preview of your site."

      biLoaderIcon = (props: IconBaseProps) => (
        <BiCheckCircle {...props} color="#0F796F" />
      )

      break
    case "PENDING":
      headingText = `Your staging site is being built`
      bodyText = "This status indicator will change once it's ready."
      biLoaderIcon = (props: IconBaseProps) => (
        <BiLoader {...props} style={{ animation: "spin 2s linear infinite" }} />
      )
      break
    case "ERROR":
      headingText = "Your staging site may not show the latest changes"
      bodyText =
        "Your live site isn't affected. Please save the page again before clicking 'Open Staging'. If changes still don't show, email support@isomer.gov.sg"

      biLoaderIcon = (props: IconBaseProps) => <BiError {...props} />
      break
    default:
      break
  }

  return (
    <HStack align="start">
      <Box width="1.6rem" height="1.6rem" p="0.05rem">
        <Icon as={biLoaderIcon} w="1.5rem" h="1.5rem" />
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

export const StatusBadgeComponent = ({
  status,
}: {
  status: BuildStatus | undefined
}): JSX.Element => {
  let displayText = ""
  let colourScheme = ""

  switch (status) {
    case "PENDING":
      displayText = "Updating staging site"
      colourScheme = "grey"

      break
    case "READY":
      displayText = "Staging site is ready"
      colourScheme = "success"

      break
    case "ERROR":
      displayText = "Staging site is out of date"
      colourScheme = "warning"

      break
    default:
      break
  }

  if (!status) {
    return <> </>
  }
  return (
    <Popover placement="bottom-start" trigger="hover">
      <PopoverTrigger>
        <Box>
          <Badge
            colorScheme={colourScheme}
            variant="subtle"
            cursor="default"
            borderRadius="3.125rem"
          >
            <Icon as={GoDotFill} size="1rem" />

            <Text ml="0.25rem" mr="0.5rem">
              {displayText}
            </Text>
            <Icon
              as={BsFillQuestionCircleFill}
              color="interaction.neutral.active"
            />
          </Badge>
        </Box>
      </PopoverTrigger>

      <PopoverContent width="26.25rem" height="auto">
        <PopoverBody>
          <StagingPopoverContent status={status} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
export const StatusBadge = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { data: getStagingStatusData } = useGetStagingStatus(siteName)
  const status = getStagingStatusData?.status

  return <StatusBadgeComponent status={status} />
}
