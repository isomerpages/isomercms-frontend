import { ButtonProps } from "@opengovsg/design-system-react"
import { Meta, Story } from "@storybook/react"
import { useState } from "react"

import { FeatureTourContext } from "./FeatureTourContext"
import { DASHBOARD_FEATURE_STEPS } from "./FeatureTourSequence"
import {
  FeatureTourStep,
  FeatureTourTooltip,
  FeatureTourTooltipProps,
} from "./FeatureTourTooltip"

export default {
  title: "Pages/Feature Tour/Tooltip",
  parameters: {
    layout: "fullscreen",
    chromatic: { pauseAnimationAtEnd: true, delay: 50 },
  },
} as Meta

const Template: Story<FeatureTourTooltipProps> = (args) => {
  const { index, isLastStep } = args
  const [featureStep, setFeatureStep] = useState<number>(index ?? 0)

  const handleNextClick = () => {
    featureStep === DASHBOARD_FEATURE_STEPS.length - 1
      ? setFeatureStep(featureStep)
      : setFeatureStep(featureStep + 1)
  }

  const getFeatureTourTooltipContent = (step: number): FeatureTourStep => {
    return {
      title: DASHBOARD_FEATURE_STEPS[step].title,
      content: DASHBOARD_FEATURE_STEPS[step].content,
    }
  }

  const featureTourTooltipContent = getFeatureTourTooltipContent(featureStep)
  const isThisLastStep =
    isLastStep ?? featureStep === DASHBOARD_FEATURE_STEPS.length - 1
  const mockPrimaryProps: ButtonProps = {
    onClick: handleNextClick,
  }
  const paginationCallback = (indicatorIdx: number) => {
    setFeatureStep(indicatorIdx)
  }

  return (
    <FeatureTourContext.Provider value={{ paginationCallback }}>
      <FeatureTourTooltip
        {...args}
        step={featureTourTooltipContent}
        primaryProps={mockPrimaryProps}
        isLastStep={isThisLastStep}
        index={featureStep}
      />
    </FeatureTourContext.Provider>
  )
}

export const BasicUsage = Template.bind({})

export const LastFeatureStep = Template.bind({})
LastFeatureStep.args = {
  index: DASHBOARD_FEATURE_STEPS.length - 1,
  isLastStep: true,
}
