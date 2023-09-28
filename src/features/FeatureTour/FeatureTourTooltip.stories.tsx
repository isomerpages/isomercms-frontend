import { ButtonProps } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"
import { useState } from "react"
import { Step } from "react-joyride"

import { FeatureTourContext } from "./FeatureTourContext"
import {
  DASHBOARD_FEATURE_STEPS,
  HERO_OPTIONS_FEATURE_STEPS,
} from "./FeatureTourSequence"
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

const Template: StoryFn<FeatureTourTooltipProps & { steps: Step[] }> = (
  args
) => {
  const { index, isLastStep, steps = DASHBOARD_FEATURE_STEPS } = args
  const [featureStep, setFeatureStep] = useState<number>(index ?? 0)

  const handleNextClick = () => {
    featureStep === steps.length - 1
      ? setFeatureStep(featureStep)
      : setFeatureStep(featureStep + 1)
  }

  const getFeatureTourTooltipContent = (step: number): FeatureTourStep => {
    return {
      title: steps[step].title,
      content: steps[step].content,
    }
  }

  const featureTourTooltipContent = getFeatureTourTooltipContent(featureStep)
  const isThisLastStep = isLastStep ?? featureStep === steps.length - 1
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
        size={steps.length}
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

export const HeroBannerStep = Template.bind({})

HeroBannerStep.args = {
  index: 0,
  isLastStep: true,
  steps: HERO_OPTIONS_FEATURE_STEPS,
}
