import { Box, BoxProps, CloseButton, Flex, Icon, Text } from "@chakra-ui/react"
import { Badge, Button, ButtonProps } from "@opengovsg/design-system-react"
import { BiBulb, BiRightArrowAlt } from "react-icons/bi"

import { ProgressIndicator } from "components/ProgressIndicator/ProgressIndicator"

import { useFeatureTourContext } from "./FeatureTourContext"
import { DASHBOARD_FEATURE_STEPS } from "./FeatureTourSequence"

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
}

export const FeatureTourTooltip = ({
  step,
  size,
  tooltipProps,
  primaryProps,
  closeProps,
  isLastStep,
  index,
}: FeatureTourTooltipProps): JSX.Element => {
  const { paginationCallback } = useFeatureTourContext()
  return (
    <Box
      padding="1.5rem"
      alignItems="center"
      maxW="100%"
      w="18rem"
      color="secondary.500"
      bg="background.action.defaultInverse"
      borderRadius="4px"
      {...tooltipProps}
      position="relative"
    >
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
      <Text textStyle="subhead-1" color="base.content.dark" marginTop="1.25rem">
        {step.title}
      </Text>
      <Text textStyle="body-2" color="base.content.default" marginTop="0.5rem">
        {step.content}
      </Text>
      <Flex
        flexDirection="row"
        marginTop="2.5rem"
        alignItems="center"
        justifyContent="space-between"
      >
        <ProgressIndicator
          numIndicators={size}
          currActiveIdx={index}
          onClick={paginationCallback}
        />
        {isLastStep ? (
          <Button {...primaryProps} title="Done">
            Done
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
