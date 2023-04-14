import { useToken } from "@chakra-ui/react"
import { useState } from "react"
import Joyride, {
  ACTIONS,
  CallBackProps,
  EVENTS,
  STATUS,
  Step,
} from "react-joyride"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLocalStorage } from "hooks/useLocalStorage"

import { FeatureTourContext } from "./FeatureTourContext"
import { FeatureTourTooltip } from "./FeatureTourTooltip"

interface FeatureTourHandlerProps {
  localStorageKey: LOCAL_STORAGE_KEYS
  steps: Array<Step>
  onClose?: () => void
}
interface FeatureTourProps {
  stepIndex: number
  setStepIndex: (value: number) => void
  steps: Array<Step>
  onClose?: () => void
}

export const FeatureTourHandler = ({
  localStorageKey,
  steps,
  onClose,
}: FeatureTourHandlerProps): JSX.Element => {
  const [stepIndex, setStepIndex] = useLocalStorage(localStorageKey, 0)
  return FeatureTour({
    stepIndex,
    setStepIndex,
    steps,
    onClose,
  })
}

export const FeatureTour = ({
  steps,
  onClose,
  stepIndex,
  setStepIndex,
}: FeatureTourProps): JSX.Element => {
  const arrowColor: string = useToken("colors", ["text.inverse"])
  const [isPaginationClicked, setIsPaginationClicked] = useState<boolean>(false)

  const handleJoyrideCallback = ({
    index,
    status,
    type,
    action,
  }: CallBackProps) => {
    if (!isPaginationClicked) {
      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        setStepIndex(index + 1)
      }
      if (
        status === STATUS.FINISHED ||
        status === STATUS.SKIPPED ||
        action === ACTIONS.CLOSE
      ) {
        if (onClose) onClose()
      }
    } else {
      setIsPaginationClicked(false)
    }
  }

  const handlePaginationCallback = (indicatorIdx: number) => {
    setIsPaginationClicked(true)
    setStepIndex(indicatorIdx)
  }

  return (
    <FeatureTourContext.Provider
      value={{
        paginationCallback: handlePaginationCallback,
      }}
    >
      <Joyride
        steps={steps}
        callback={handleJoyrideCallback}
        stepIndex={stepIndex}
        continuous
        run
        hideBackButton
        floaterProps={{
          placement: "right-start",
          styles: {
            arrow: {
              length: 8,
              spread: 16,
            },
            floaterWithAnimation: {
              transition: "opacity 0.3s ease 0s, transform 0s ease 0s",
            },
          },
        }}
        styles={{
          options: {
            arrowColor,
            zIndex: 2000, // need this for it to be on top of the navbar
          },
        }}
        spotlightPadding={3}
        tooltipComponent={FeatureTourTooltip}
        disableScrolling
      />
    </FeatureTourContext.Provider>
  )
}
