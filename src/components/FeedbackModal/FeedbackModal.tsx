import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Heading,
  HStack,
  Text,
  ModalFooter,
  VStack,
  Box,
} from "@chakra-ui/react"
import {
  ModalCloseButton,
  Button,
  Textarea,
} from "@opengovsg/design-system-react"
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

  return (
    <form>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent py="1.5rem" px="2rem">
          <ModalHeader p={0}>
            <Heading as="h5">
              How&apos;s your IsomerCMS experience today?
            </Heading>
          </ModalHeader>
          <ModalCloseButton right="2rem" top="2rem" />
          <ModalBody p={0} mt="1.5rem">
            <VStack spacing="1.5rem" align="flex-start" p={0}>
              <HStack spacing="1.5rem" px="18.5">
                {Array(11)
                  .fill(null)
                  .map((_, index) => index)
                  .map((idx) => (
                    <Button
                      onClick={() => setShouldShowTextArea(true)}
                      variant="reverse"
                      fill="inherit"
                    >
                      <Text
                        textStyle="body-2"
                        textColor="color.base.content.default"
                      >
                        {idx}
                      </Text>
                    </Button>
                  ))}
              </HStack>
              {shouldShowTextArea && (
                <Box width="full">
                  <Text>Share why you gave us this rating</Text>
                  <Textarea mt="0.25rem" placeholder="Leave us some feedback" />
                </Box>
              )}
            </VStack>
          </ModalBody>
          {shouldShowTextArea && (
            <ModalFooter mt="0.5rem">
              <HStack spacing="1rem">
                <Button>Cancel</Button>
                <Button>Done</Button>
              </HStack>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </form>
  )
}
