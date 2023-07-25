import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  HStack,
  ModalFooter,
  VStack,
  ButtonGroup,
  FormControl,
} from "@chakra-ui/react"
import {
  ModalCloseButton,
  Button,
  Textarea,
  FormLabel,
} from "@opengovsg/design-system-react"
import { Rating } from "components/Rating/Rating"
import { useState } from "react"

export interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}
export const FeedbackModal = ({
  isOpen,
  onClose,
}: FeedbackModalProps): JSX.Element => {
  const [shouldShowTextArea, setShouldShowTextArea] = useState(false)
  const [activeIdx, setActiveIdx] = useState<number>(-1)

  return (
    // modal content, button, header, footer
    <form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How satisfied are you with Isomer?</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={shouldShowTextArea ? "auto" : "1.5rem"}>
            <VStack spacing="1.5rem" align="flex-start">
              <Rating
                onClick={(idx) => {
                  setShouldShowTextArea(true)
                  setActiveIdx(idx)
                }}
                activeIdx={activeIdx}
              />
              {shouldShowTextArea && (
                <FormControl isRequired>
                  <FormLabel isRequired>
                    Share why you gave us this rating
                  </FormLabel>
                  <Textarea mt="0.25rem" placeholder="Leave us some feedback" />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          {shouldShowTextArea && (
            <ModalFooter>
              <HStack spacing="1rem">
                <ButtonGroup>
                  <Button colorScheme="neutral" variant="clear">
                    Cancel
                  </Button>
                  <Button colorScheme="main" isDisabled>
                    Done
                  </Button>
                </ButtonGroup>
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </form>
  )
}
