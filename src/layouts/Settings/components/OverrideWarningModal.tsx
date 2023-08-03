import { Text } from "@chakra-ui/react"
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
      displayTitle="Override Changes"
      displayText={
        <Text>
          Your site settings have recently been changed by another user. You can
          choose to either override their changes, or go back to editing.
          {/*
           * NOTE: We have 2 line breaks here because we want a line spacing between the 2 <paragraphs.
           * Only have 1 br would cause the second paragraph to begin on a new line but without the line spacing.
           */}
          <br />
          <br />
          We recommend you to make a copy of your changes elsewhere, and come
          back later to reconcile your changes.
        </Text>
      }
    >
      <Button variant="outline" onClick={onClose}>
        Back to editing
      </Button>
      <Button
        colorScheme="critical"
        type="submit"
        isLoading={isLoading}
        onClick={async () => {
          await onSubmit()
          onClose()
        }}
      >
        Override
      </Button>
    </WarningModal>
  )
}
