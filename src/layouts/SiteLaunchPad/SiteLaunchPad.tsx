import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
  Skeleton,
} from "@chakra-ui/react"
import {
  Button,
  Checkbox,
  Link,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Redirect, useParams } from "react-router-dom"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { useGetCollaboratorRoleHook } from "hooks/collaboratorHooks"

import { SiteViewHeader } from "layouts/layouts/SiteViewLayout/SiteViewHeader"

import { isSiteLaunchEnabled } from "utils/siteLaunchUtils"

import {
  SiteLaunchStatusProps,
  SiteLaunchTaskTypeIndex,
  SITE_LAUNCH_PAGES,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"
import { useErrorToast } from "utils"

import {
  SiteLaunchChecklistTitle,
  SiteLaunchChecklistBody,
} from "./components/SiteLaunchCheckList"
import {
  SiteLaunchDisclaimerBody,
  SiteLaunchDisclaimerTitle,
} from "./components/SiteLaunchDisclaimer"
import { SiteLaunchFinalState } from "./components/SiteLaunchFinalState"
import {
  SiteLaunchInfoCollectorTitle,
  SiteLaunchInfoCollectorBody,
} from "./components/SiteLaunchInfoGathering"

interface RiskAcceptanceModalProps {
  isOpen: boolean
  increasePageNumber: () => void
  decreasePageNumber: () => void
}

interface SiteLaunchPadProps {
  pageNumber: number
  increasePageNumber: () => void
  decreasePageNumber: () => void
  handleDecrementStepNumber: () => void
  handleIncrementStepNumber: () => void
}

const RiskAcceptanceModal = ({
  isOpen,
  increasePageNumber,
  decreasePageNumber,
}: RiskAcceptanceModalProps): JSX.Element => {
  const { register, handleSubmit, watch } = useForm({})
  const isRiskAccepted = watch("isRiskAccepted")

  return (
    <Modal isOpen={isOpen} onClose={() => decreasePageNumber()}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text as="h4" textStyle="h4" textColor="base.content.strong">
            Check if you have full control over your DNS
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mt="2rem">
          <Text textStyle="body-2" fontWeight="bold" mb="2rem">
            The biggest reason for site launch failure is because of unknown
            CloudFront records.
          </Text>

          <Text textStyle="body-2" mb="2rem">
            <Text as="b">Please do your best to find this out. </Text>
            If you are unsure, consult your ITD team on this. If your domain is
            a .gov.sg domain, you can go to{" "}
            <Link href="https://dnschecker.org/" isExternal>
              DNS checker
            </Link>{" "}
            and where it points to. If it points to 35.201.83.130, you must
            contact CWP to drop corresponding CloudFront records for your
            domain.
          </Text>

          <Text textStyle="body-2" mb="4rem">
            Isomer will not be held liable for any extended period of downtime
            due to unknown CloudFront records. Downtime could happen even if
            your site is not currently using CloudFront, but has used it
            previously.
          </Text>

          <Checkbox {...register("isRiskAccepted")}>
            <Text color="text.body" textStyle="body-1">
              I understand the risks
            </Text>
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={() => decreasePageNumber()} variant="link">
            Cancel
          </Button>
          <Button
            isDisabled={!isRiskAccepted}
            type="submit"
            onClick={handleSubmit(() => {
              increasePageNumber()
            })}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
const getInitialPageNumber = (
  siteLaunchStatusProps: SiteLaunchStatusProps | undefined
) => {
  const hasUserAlreadyStartedChecklistTasks =
    siteLaunchStatusProps?.siteLaunchStatus === "CHECKLIST_TASKS_PENDING"
  if (hasUserAlreadyStartedChecklistTasks) return SITE_LAUNCH_PAGES.CHECKLIST
  const isSiteLaunchInProgress =
    siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING"
  if (isSiteLaunchInProgress) return SITE_LAUNCH_PAGES.CHECKLIST

  return SITE_LAUNCH_PAGES.DISCLAIMER
}

export const SiteLaunchPad = ({
  pageNumber,
  increasePageNumber,
  decreasePageNumber,
  handleDecrementStepNumber,
  handleIncrementStepNumber,
}: SiteLaunchPadProps): JSX.Element => {
  let title: JSX.Element
  let body: JSX.Element
  switch (pageNumber) {
    case SITE_LAUNCH_PAGES.DISCLAIMER:
      title = <SiteLaunchDisclaimerTitle />
      body = (
        <SiteLaunchDisclaimerBody increasePageNumber={increasePageNumber} />
      )
      break
    case SITE_LAUNCH_PAGES.INFO_GATHERING:
    case SITE_LAUNCH_PAGES.RISK_ACCEPTANCE: // Risk acceptance modal overlay
      title = <SiteLaunchInfoCollectorTitle />
      body = (
        <SiteLaunchInfoCollectorBody
          increasePageNumber={increasePageNumber}
          decreasePageNumber={decreasePageNumber}
        />
      )
      break
    case SITE_LAUNCH_PAGES.CHECKLIST:
      title = <SiteLaunchChecklistTitle />
      body = (
        <SiteLaunchChecklistBody
          handleIncrementStepNumber={handleIncrementStepNumber}
          handleDecrementStepNumber={handleDecrementStepNumber}
          increasePageNumber={increasePageNumber}
        />
      )
      break
    case SITE_LAUNCH_PAGES.FINAL_STATE:
      title = <></> // No title for final state
      body = <SiteLaunchFinalState decreasePageNumber={decreasePageNumber} />
      break
    default:
      title = <SiteLaunchDisclaimerTitle />
      body = (
        <SiteLaunchDisclaimerBody increasePageNumber={increasePageNumber} />
      )
  }
  return (
    <>
      <SiteViewHeader />
      <VStack bg="white" w="100%" minH="100vh" spacing="2rem">
        {title}
        {body}
        <RiskAcceptanceModal
          isOpen={pageNumber === SITE_LAUNCH_PAGES.RISK_ACCEPTANCE}
          increasePageNumber={increasePageNumber}
          decreasePageNumber={decreasePageNumber}
        />
      </VStack>
    </>
  )
}

export const SiteLaunchPadPage = (): JSX.Element => {
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()
  const { siteName } = useParams<{ siteName: string }>()
  const [pageNumber, setPageNumber] = useState(
    getInitialPageNumber(siteLaunchStatusProps)
  )

  useEffect(() => {
    // In case user wishes to check status page
    const isSiteLaunchEndState =
      siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHED" ||
      siteLaunchStatusProps?.siteLaunchStatus === "FAILURE" ||
      siteLaunchStatusProps?.siteLaunchStatus === "LAUNCHING"

    if (isSiteLaunchEndState) {
      setPageNumber(SITE_LAUNCH_PAGES.FINAL_STATE)
    }
  }, [siteLaunchStatusProps?.siteLaunchStatus])

  const increasePageNumber = () => {
    setPageNumber(pageNumber + 1)
  }
  const decreasePageNumber = () => {
    setPageNumber(pageNumber - 1)
  }

  const errorToast = useErrorToast()
  const { data: role } = useGetCollaboratorRoleHook(siteName)

  const isLoaded: boolean = !!siteName && !!role
  useEffect(() => {
    if (isLoaded && !isSiteLaunchEnabled(siteName, role)) {
      errorToast({
        id: "no_access_to_launchpad",
        description: "You do not have access to this page.",
      })
    }
  }, [siteName, errorToast, role, isLoaded, siteLaunchStatusProps])

  const handleIncrementStepNumber = () => {
    if (
      siteLaunchStatusProps &&
      siteLaunchStatusProps.stepNumber < SITE_LAUNCH_TASKS_LENGTH
    ) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        stepNumber: (siteLaunchStatusProps.stepNumber +
          1) as SiteLaunchTaskTypeIndex, // safe to assert since we do a check
        siteLaunchStatus: "CHECKLIST_TASKS_PENDING",
      })
    }
  }
  const handleDecrementStepNumber = () => {
    if (siteLaunchStatusProps && siteLaunchStatusProps.stepNumber > 0) {
      setSiteLaunchStatusProps({
        ...siteLaunchStatusProps,
        stepNumber: (siteLaunchStatusProps?.stepNumber -
          1) as SiteLaunchTaskTypeIndex, // safe to assert since we do a check
      })
    }
  }

  return (
    <>
      {isLoaded ? (
        <>
          {isSiteLaunchEnabled(siteName, role) ? (
            <SiteLaunchPad
              pageNumber={pageNumber}
              increasePageNumber={increasePageNumber}
              decreasePageNumber={decreasePageNumber}
              handleDecrementStepNumber={handleDecrementStepNumber}
              handleIncrementStepNumber={handleIncrementStepNumber}
            />
          ) : (
            <Redirect to={`/sites/${siteName}/dashboard`} />
          )}
        </>
      ) : (
        <Skeleton isLoaded />
      )}
    </>
  )
}
