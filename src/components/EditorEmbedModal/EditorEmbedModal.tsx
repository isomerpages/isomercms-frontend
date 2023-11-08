import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import {
  Button,
  ModalCloseButton,
  Textarea,
} from "@opengovsg/design-system-react"
import { useState } from "react"

interface EditorEmbedModalProps {
  isOpen: boolean
  onClose: () => void
  onProceed: (embedCode: string) => void
}

export const EditorEmbedModal = ({
  isOpen,
  onClose,
  onProceed,
}: EditorEmbedModalProps): JSX.Element => {
  const [embed, setEmbed] = useState("")

  const handleEmbedChange = (embedCode: string) => {
    // TODO: Validate the embed code
    setEmbed(embedCode)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Insert embeddable content</ModalHeader>

        <ModalBody>
          <Text textStyle="body-1">
            Embed external content such as videos, maps, and social media posts.
          </Text>

          <Textarea
            placeholder="<iframe ..."
            id="embed"
            value={embed}
            onChange={(e) => handleEmbedChange(e.target.value)}
            mt="1rem"
          />
        </ModalBody>

        <ModalFooter>
          <HStack w="100%" spacing={4} justifyContent="flex-end">
            <Button variant="clear" colorScheme="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onProceed(embed)}>Insert</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
