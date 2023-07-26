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
import { useForm } from "react-hook-form"

import { useLoginContext } from "contexts/LoginContext"

import { useSubmitFeedback } from "hooks/useSubmitFeedback"

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
  const { register, handleSubmit } = useForm<{ feedback: string }>()
  const { userType, email } = useLoginContext()
  const { mutateAsync: submitFeedback, isLoading } = useSubmitFeedback()

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={handleSubmit(async ({ feedback }) => {
            submitFeedback({ feedback, email, userType, rating: activeIdx })
            onClose()
          })}
        >
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
                <FormControl>
                  <FormLabel>Share why you gave us this rating</FormLabel>
                  <Textarea
                    mt="0.25rem"
                    placeholder="Leave us some feedback"
                    {...register("feedback")}
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          {shouldShowTextArea && (
            <ModalFooter>
              <HStack spacing="1rem">
                <ButtonGroup>
                  <Button
                    colorScheme="neutral"
                    variant="clear"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="main"
                    type="submit"
                    isLoading={isLoading}
                  >
                    Done
                  </Button>
                </ButtonGroup>
              </HStack>
            </ModalFooter>
          )}
        </form>
      </ModalContent>
    </Modal>
  )
}
