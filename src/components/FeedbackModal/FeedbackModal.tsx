import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button as ChakraButton,
  HStack,
  ModalFooter,
  VStack,
  ButtonGroup,
  FormControl,
  useMultiStyleConfig,
  chakra,
} from "@chakra-ui/react"
import {
  ModalCloseButton,
  Button,
  Textarea,
  FormLabel,
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
  const [activeIdx, setActiveIdx] = useState<undefined | number>()
  const styles = useMultiStyleConfig("Pagination")

  return (
    <form>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader pt="1.5rem">
            How likely are you to recommend Isomer to a colleague?
          </ModalHeader>
          <ModalCloseButton w="1.5rem" h="1.5rem" />
          <ModalBody pb={shouldShowTextArea ? "auto" : "1.5rem"}>
            <VStack spacing="1.5rem" align="flex-start">
              <chakra.ul
                display="flex"
                flexFlow="row nowrap"
                listStyleType="none"
                alignItems="center"
                gap="1.5rem"
                w="full"
                alignSelf="center"
                px="1.16rem"
                py="0.5rem"
              >
                {Array(11)
                  .fill(null)
                  .map((_, idx) => {
                    return (
                      <chakra.li>
                        <ChakraButton
                          variant="unstyled"
                          sx={{
                            ...styles.button,
                            _active: {
                              bg: "interaction.support.selected",
                              color: "base.content.inverse",
                              _hover: {
                                bg: "interaction.support.selected",
                              },
                              _disabled: {
                                bg: "interaction.support.disabled",
                                color: "interaction.support.disabled-content",
                              },
                            },
                          }}
                          onClick={() => {
                            setShouldShowTextArea(true)
                            setActiveIdx(idx)
                          }}
                          isActive={activeIdx === idx}
                        >
                          {idx}
                        </ChakraButton>
                      </chakra.li>
                    )
                  })}
              </chakra.ul>
              {shouldShowTextArea && (
                <FormControl>
                  <FormLabel>Share why you gave us this rating</FormLabel>
                  <Textarea mt="0.25rem" placeholder="Leave us some feedback" />
                </FormControl>
              )}
            </VStack>
          </ModalBody>
          {shouldShowTextArea && (
            <ModalFooter pb="2rem">
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
