import { Box, Text, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import { WarningModal } from "components/WarningModal"

interface OverwriteChangesModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export const OverwriteChangesModal = ({
  isOpen,
  onClose,
  onProceed,
}: OverwriteChangesModalProps): JSX.Element => {
  return (
    <WarningModal
      isOpen={isOpen}
      onClose={onClose}
      displayTitle="Do you want to override recent changes?"
      displayText={
        <Box>
          <VStack gap="1.5rem">
            <Text>
              Another user edited and saved this page recently. If you save your
              edits now, their changes will be lost.
            </Text>
            <Text>
              We recommend you to make a copy of your changes elsewhere, and
              come back later to reconcile your changes.
            </Text>
          </VStack>
        </Box>
      }
    >
      <Button variant="clear" colorScheme="critical" onClick={onProceed}>
        Save my edits anyway
      </Button>
      <Button colorScheme="main" onClick={onClose}>
        Back to editing
      </Button>
    </WarningModal>
  )
}
