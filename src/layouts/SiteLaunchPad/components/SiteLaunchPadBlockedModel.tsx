import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  Link,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Link as RouterLink, useHistory, useParams } from "react-router-dom"

export const SiteLaunchPadBlockedModel = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const history = useHistory()

  return (
    <Modal
      isOpen
      onClose={() => {
        history.push(`/sites/${siteName}/dashboard`)
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" textColor="text.title.alt">
            This site is not configured to access this feature.
          </Text>
        </ModalHeader>

        <ModalBody>
          <Text textStyle="body-1">
            Please contact{" "}
            <Link href="mailto:support@isomer.gov.sg">
              support@isomer.gov.sg
            </Link>{" "}
            if this is a mistake.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button as={RouterLink} to={`/sites/${siteName}/dashboard`}>
            Back to Site Dashboard
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
