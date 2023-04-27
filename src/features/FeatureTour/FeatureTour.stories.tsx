import { Icon, Button } from "@chakra-ui/react"
import { Meta, Story } from "@storybook/react"
import { useState } from "react"
import { BiCheckCircle } from "react-icons/bi"

import { FeatureTour } from "./FeatureTour"
import { STORYBOOK_FEATURE_STEPS } from "./FeatureTourSequence"

export default {
  title: "Pages/Feature Tour",
  parameters: {
    layout: "fullscreen",
    // Prevent flaky tests due to modal animating in.
    chromatic: { delay: 200 },
  },
} as Meta

const onClose = () => {
  console.log("closed")
}

const Template: Story = () => {
  const [stepIndex, setStepIndex] = useState(0)
  return (
    <>
      <Button
        id="isomer-storybook-step-1"
        leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
      >
        Button 1
      </Button>
      <Button
        id="isomer-storybook-step-2"
        leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
      >
        Button 2
      </Button>
      <Button
        id="isomer-storybook-step-3"
        leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
      >
        Button 3
      </Button>
      <FeatureTour
        steps={STORYBOOK_FEATURE_STEPS}
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        onClose={onClose}
      />
    </>
  )
}

export const BasicUsage = Template.bind({})
