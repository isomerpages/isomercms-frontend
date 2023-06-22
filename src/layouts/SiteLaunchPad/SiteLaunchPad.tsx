/* eslint-disable react/jsx-props-no-spreading */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  Button,
  Checkbox,
  Link,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { SiteViewHeader } from "layouts/layouts/SiteViewLayout/SiteViewHeader"

import {
  SiteLaunchStatusProps,
  SiteLaunchTaskTypeIndex,
  SITE_LAUNCH_PAGES,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

import {
  SiteLaunchChecklistTitle,
  SiteLaunchChecklistBody,
} from "./components/SiteLaunchCheckList"
import {
  SiteLaunchDisclaimerBody,
  SiteLaunchDisclaimerTitle,
} from "./components/SiteLaunchDisclaimer"
import {
  SiteLaunchInfoCollectorTitle,
  SiteLaunchInfoCollectorBody,
} from "./components/SiteLaunchInfoGathering"

interface RiskAcceptanceModalProps {
  isOpen: boolean
  setPageNumber: (number: number) => void
}

const RiskAcceptanceModal = ({
  isOpen,
  setPageNumber,
}: RiskAcceptanceModalProps): JSX.Element => {
  const { register, handleSubmit, watch } = useForm({})
  const isRiskAccepted = watch("isRiskAccepted")

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text as="h4" textStyle="h4">
            Check if you have full control over your DNS
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mt="2rem">
          <Text textStyle="body-2" fontWeight="bold" mb="2rem">
            The biggest reason for site launch failure is because of unknown
            cloudfront records.
          </Text>

          <Text textStyle="body-2" mb="2rem">
            <Text as="b">Please do your best to find this out. </Text>
            If you are unsure, consult your ITD team on this. If your domain is
            a .gov.sg domain, You can go to{" "}
            <Link href="https://dnschecker.org/">DNS checker</Link> and check if
            your A record starts with 35.
          </Text>

          <Text textStyle="body-2" mb="4rem">
            Isomer will not be held liable for any extended period of downtime
            due to unknown cloudfront records. Downtime could happen even if
            your site is not currently using cloudfront, but has used it
            previously.
          </Text>

          <Checkbox {...register("isRiskAccepted")}>
            <Text color="text.body" textStyle="body-1">
              I understand the risks
            </Text>
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={() => setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)}
            variant="link"
          >
            Cancel
          </Button>
          <Button
            isDisabled={!isRiskAccepted}
            type="submit"
            onClick={handleSubmit(() => {
              setPageNumber(SITE_LAUNCH_PAGES.CHECKLIST)
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
export const SiteLaunchPad = (): JSX.Element => {
  const { siteLaunchStatusProps } = useSiteLaunchContext()

  const [pageNumber, setPageNumber] = useState(
    getInitialPageNumber(siteLaunchStatusProps)
  )

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

  let title: JSX.Element
  let body: JSX.Element
  switch (pageNumber) {
    case SITE_LAUNCH_PAGES.DISCLAIMER:
      title = <SiteLaunchDisclaimerTitle />
      body = <SiteLaunchDisclaimerBody setPageNumber={setPageNumber} />
      break
    case SITE_LAUNCH_PAGES.INFO_GATHERING:
    case SITE_LAUNCH_PAGES.RISK_ACCEPTANCE: // Risk acceptance modal overlay
      title = <SiteLaunchInfoCollectorTitle />
      body = <SiteLaunchInfoCollectorBody setPageNumber={setPageNumber} />
      break
    case SITE_LAUNCH_PAGES.CHECKLIST:
      title = <SiteLaunchChecklistTitle />
      body = (
        <SiteLaunchChecklistBody
          handleIncrementStepNumber={handleIncrementStepNumber}
          handleDecrementStepNumber={handleDecrementStepNumber}
        />
      )
      break
    default:
      title = <SiteLaunchDisclaimerTitle />
      body = <SiteLaunchDisclaimerBody setPageNumber={setPageNumber} />
  }
  return (
    <>
      <SiteViewHeader />
      <VStack bg="white" w="100%" minH="100vh" spacing="2rem">
        {title}
        {body}
        <RiskAcceptanceModal
          isOpen={pageNumber === SITE_LAUNCH_PAGES.RISK_ACCEPTANCE}
          setPageNumber={setPageNumber}
        />
      </VStack>
    </>
  )
}
