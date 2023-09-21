import { Box, BoxProps, CloseButton, Flex, Icon, Text } from "@chakra-ui/react"
import { Badge, Button, ButtonProps } from "@opengovsg/design-system-react"
import { BiBulb, BiRightArrowAlt } from "react-icons/bi"

import { ProgressIndicator } from "components/ProgressIndicator/ProgressIndicator"

import { useFeatureTourContext } from "./FeatureTourContext"

export interface FeatureTourStep {
  content: React.ReactNode
  title?: React.ReactNode
}

export interface FeatureTourTooltipProps {
  step: FeatureTourStep
  size: number
  tooltipProps: BoxProps
  primaryProps: ButtonProps
  closeProps: ButtonProps
  isLastStep: boolean
  index: number
  isTipBadgeShown?: boolean
}

export const FeatureTourTooltip = ({
  step,
  size,
  tooltipProps,
  primaryProps,
  closeProps,
  isLastStep,
  index,
  isTipBadgeShown = true,
}: FeatureTourTooltipProps): JSX.Element => {
  const { paginationCallback } = useFeatureTourContext()
  const showProgressIndicator = size > 1

  let titleComponent: React.ReactNode
  if (typeof step.title === "string") {
    titleComponent = (
      <Text textStyle="subhead-1" color="base.content.dark" marginTop="1.25rem">
        {step.title}
      </Text>
    )
  } else {
    titleComponent = step.title
  }

  let contentComponent: React.ReactNode
  if (typeof step.content === "string") {
    contentComponent = (
      <Text textStyle="body-2" color="base.content.default" marginTop="0.5rem">
        {step.content}
      </Text>
    )
  } else {
    contentComponent = step.content
  }

  return (
    <Box
      padding="1.5rem"
      alignItems="center"
      maxW="100%"
      w="20rem"
      color="secondary.500"
      bg="background.action.defaultInverse"
      borderRadius="4px"
      {...tooltipProps}
      position="relative"
    >
      {isTipBadgeShown && (
        <Badge
          colorScheme="success"
          variant="solid"
          display="flex"
          width="fit-content"
          backgroundColor="background.action.success"
        >
          <Icon as={BiBulb} mr="0.25rem" fontSize="1rem" color="text.inverse" />
          <Text textStyle="caption-1" color="text.inverse">
            Tip
          </Text>
        </Badge>
      )}

      {titleComponent}
      {contentComponent}

      <Flex
        flexDirection="row"
        marginTop="2rem"
        alignItems="center"
        justifyContent="space-between"
      >
        {showProgressIndicator && (
          <ProgressIndicator
            numIndicators={size}
            currActiveIdx={index}
            onClick={paginationCallback}
          />
        )}
        {isLastStep ? (
          <Button {...primaryProps} title="Done">
            Got it
          </Button>
        ) : (
          <Button
            rightIcon={<BiRightArrowAlt size="1.5rem" />}
            {...primaryProps}
          >
            Next
          </Button>
        )}
      </Flex>
    </Box>
  )
}
