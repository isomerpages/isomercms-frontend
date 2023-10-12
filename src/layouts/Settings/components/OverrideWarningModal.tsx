import { Box, Text, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import { WarningModal } from "components/WarningModal"

interface OverrideWarningModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  onSubmit: () => void
}

export const OverrideWarningModal = ({
  isOpen,
  onClose,
  isLoading,
  onSubmit,
}: OverrideWarningModalProps) => {
  return (
    <WarningModal
      isCentered
      // NOTE: The second conditional is required as the wrapped method by react hook form
      // terminates earlier than the actual call to the BE API.
      // Hence, the model is open if it was triggered manually or if the warning in the modal was acknowledged
      // and the user still chose to proceed (this only occurs when there is a diff)
      isOpen={isOpen}
      onClose={onClose}
      displayTitle="Do you want to override recent changes?"
      displayText={
        <Box>
          <VStack gap="1.5rem">
            <Text>
              Another user edited and saved your site settings recently. You can
              choose to either override their changes, or go back to editing.
            </Text>
            <Text>
              We recommend you to make a copy of your changes elsewhere and come
              back later.
            </Text>
          </VStack>
        </Box>
      }
    >
      <Button
        variant="clear"
        colorScheme="critical"
        type="submit"
        isLoading={isLoading}
        onClick={async () => {
          await onSubmit()
          onClose()
        }}
      >
        Save my edits anyway
      </Button>
      <Button colorScheme="main" onClick={onClose}>
        Back to editing
      </Button>
    </WarningModal>
  )
}
