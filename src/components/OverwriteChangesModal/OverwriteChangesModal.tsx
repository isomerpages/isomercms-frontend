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
      displayTitle="Override Changes"
      displayText={
        <Box>
          <VStack gap="1.5rem">
            <Text>
              A different version of this page has recently been saved by
              another user. You can choose to either override their changes, or
              go back to editing.
            </Text>
            <Text>
              We recommend you to make a copy of your changes elsewhere, and
              come back later to reconcile your changes.
            </Text>
          </VStack>
        </Box>
      }
    >
      <Button
        variant="clear"
        colorScheme="secondary"
        textColor="text.title.alt"
        onClick={onClose}
      >
        Back to Editing
      </Button>
      <Button colorScheme="critical" onClick={onProceed}>
        Override
      </Button>
    </WarningModal>
  )
}
