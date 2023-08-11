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
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Redirect, useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"
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

export const SiteLaunchPad = ({
  pageNumber,
  setPageNumber,
  handleDecrementStepNumber,
  handleIncrementStepNumber,
}: {
  pageNumber: number
  setPageNumber: React.Dispatch<React.SetStateAction<number>>
  handleDecrementStepNumber: () => void
  handleIncrementStepNumber: () => void
}): JSX.Element => {
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
    <VStack bg="white" w="100%" minH="100vh" spacing="2rem">
      {title}
      {body}
      <RiskAcceptanceModal
        isOpen={pageNumber === SITE_LAUNCH_PAGES.RISK_ACCEPTANCE}
        setPageNumber={setPageNumber}
      />
    </VStack>
  )
}

export const SiteLaunchPadPage = (): JSX.Element => {
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()
  const { siteName } = useParams<{ siteName: string }>()
  const { email } = useLoginContext()
  const [pageNumber, setPageNumber] = useState(
    getInitialPageNumber(siteLaunchStatusProps)
  )

  const errorToast = useErrorToast()
  const { data: role } = useGetCollaboratorRoleHook(siteName)
  useEffect(() => {
    if (!isSiteLaunchEnabled(siteName, role)) {
      errorToast({
        id: "no_access_to_launchpad",
        description: "You do not have access to this page.",
      })
    }
  }, [siteName, errorToast, role])

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
      <SiteViewHeader />
      {isSiteLaunchEnabled(siteName, role) ? (
        <SiteLaunchPad
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          handleDecrementStepNumber={handleDecrementStepNumber}
          handleIncrementStepNumber={handleIncrementStepNumber}
        />
      ) : (
        <Redirect to={`/sites/${siteName}/dashboard`} />
      )}
    </>
  )
}
