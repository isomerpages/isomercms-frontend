import {
  Box,
  HStack,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react"
import { Badge } from "@opengovsg/design-system-react"
import { useMemo } from "react"
import { BiCheckCircle, BiError, BiLoader } from "react-icons/bi"
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
      bodyText = "Click on 'Open staging' to take a look."

      biLoaderIcon = (props: IconBaseProps) => (
        <BiCheckCircle {...props} color="#0F796F" />
      )

      break
    case "PENDING":
      headingText = `Staging site is building`
      bodyText =
        "We detected a change in your site. We'll let you know when the staging site is ready."
      biLoaderIcon = (props: IconBaseProps) => (
        <BiLoader {...props} style={{ animation: "spin 2s linear infinite" }} />
      )
      break
    case "ERROR":
      headingText =
        "We had some trouble updating the staging site since the latest save. "
      bodyText =
        "Don't worry, your production site isn't affected. Try saving your page again. If the issue persists, please contact support@isomer.gov.sg."

      biLoaderIcon = (props: IconBaseProps) => <BiError {...props} />
      break
    default:
      break
  }

  return (
    <HStack align="start" spacing="0.75rem" m="0.75rem">
      <Box width="1.6rem" height="1.6rem" p="0.05rem">
        <Icon as={biLoaderIcon} size="1.5rem" />
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

export const StatusBadgeComponent = (
  status: BuildStatus | undefined
): JSX.Element => {
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
    <Popover placement="end" trigger="hover">
      <PopoverTrigger>
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
        </Badge>
      </PopoverTrigger>
      <Portal>
        <Box position="absolute" top="5.25rem" right="36.5rem">
          <PopoverContent width="26.25rem" height="auto">
            <StagingPopoverContent status={status} />
          </PopoverContent>
        </Box>
      </Portal>
    </Popover>
  )
}
export const StatusBadge = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { data: getStagingStatusData } = useGetStagingStatus(siteName)
  const status = getStagingStatusData?.status

  const badge = useMemo(() => {
    return StatusBadgeComponent(status)
  }, [status])

  return badge
}
