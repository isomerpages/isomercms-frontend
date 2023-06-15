import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Text,
} from "@chakra-ui/react"
import {
  Button,
  Checkbox,
  Link,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { useState } from "react"

import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { SiteViewLayout } from "layouts/layouts"

import { SiteLaunchStatusProps, SITE_LAUNCH_PAGES } from "types/siteLaunch"

import {
  SiteLaunchDisclaimerBody,
  SiteLaunchDisclaimerTitle,
} from "./components/SiteLaunchDisclaimer"
import {
  SiteLaunchInfoGatheringTitle,
  SiteLaunchInfoGatheringBody,
} from "./components/SiteLaunchInfoGathering"

const RiskAcceptanceModal = ({
  isOpen,
  setPageNumber,
}: {
  isOpen: boolean
  setPageNumber: (number: number) => void
}): JSX.Element => {
  const [isDisabled, setIsDisabled] = useState(true)
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setPageNumber(SITE_LAUNCH_PAGES.INFO_GATHERING)}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4">
            Check if you have full control over your DNS
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <br />
          <Text textStyle="body-2" fontWeight="bold">
            The biggest reason for site launch failure is because of unknown
            cloudfront records.
          </Text>
          <br />

          <Text textStyle="body-2">
            <Text as="b">Please do your best to find this out. </Text>
            If you are unsure, consult your ITD team on this. If your domain is
            a .gov.sg domain, You can go to{" "}
            <Link href="https://dnschecker.org/">DNS checker</Link> and check if
            your A record starts with 35.
          </Text>
          <br />
          <Text textStyle="body-2">
            Isomer will not be held liable for any extended period of downtime
            due to unknown cloudfront records. Downtime could happen even if
            your site is not currently using cloudfront, but has used it
            previously.
          </Text>
          <br />
          <br />
          <Checkbox
            onChange={(e) => {
              e.preventDefault()
              setIsDisabled(!e.target.checked)
            }}
          >
            <Text textStyle="body-1" color="black">
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
            isDisabled={isDisabled}
            type="submit"
            onClick={() => setPageNumber(SITE_LAUNCH_PAGES.CHECKLIST)}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
const pageInitialNumber = (
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
  const {
    siteLaunchStatusProps,
    setSiteLaunchStatusProps,
  } = useSiteLaunchContext()

  const [pageNumber, setPageNumber] = useState(
    pageInitialNumber(siteLaunchStatusProps)
  )

  let title = <SiteLaunchDisclaimerTitle />
  let body = <SiteLaunchDisclaimerBody setPageNumber={setPageNumber} />
  switch (pageNumber) {
    case SITE_LAUNCH_PAGES.DISCLAIMER:
      title = <SiteLaunchDisclaimerTitle />
      body = <SiteLaunchDisclaimerBody setPageNumber={setPageNumber} />
      break
    case SITE_LAUNCH_PAGES.INFO_GATHERING:
    case SITE_LAUNCH_PAGES.RISK_ACCEPTANCE: // Risk acceptance modal overlay
      title = <SiteLaunchInfoGatheringTitle />
      body = <SiteLaunchInfoGatheringBody setPageNumber={setPageNumber} />
      break

    // todo case for site launch pages checklist
    default:
      title = <SiteLaunchDisclaimerTitle />
      body = <SiteLaunchDisclaimerBody setPageNumber={setPageNumber} />
  }
  return (
    <SiteViewLayout overflow="hidden">
      {title}
      {body}
      <RiskAcceptanceModal
        isOpen={pageNumber === SITE_LAUNCH_PAGES.RISK_ACCEPTANCE}
        setPageNumber={setPageNumber}
      />
    </SiteViewLayout>
  )
}
