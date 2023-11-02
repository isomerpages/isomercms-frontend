import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Box,
  VStack,
  Button,
  Text,
} from "@chakra-ui/react"
import { ModalCloseButton } from "@opengovsg/design-system-react"
import axios from "axios"
import PropTypes from "prop-types"
import { useState } from "react"

import FormField from "components/FormField"

import FormContext from "./Form/FormContext"
import FormTitle from "./Form/FormTitle"

// axios settings
axios.defaults.withCredentials = true

const HyperlinkModal = ({ onSave, initialText, onClose }) => {
  const [text, setText] = useState(initialText)
  const [link, setLink] = useState("")

  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h3" textColor="brand.primary.500">
            Insert hyperlink
          </Text>
          <ModalCloseButton onClick={onClose} />
        </ModalHeader>
        <ModalBody>
          <FormContext isRequired>
            <VStack w="100%" spacing="1rem">
              <Box w="100%">
                <FormTitle>Text</FormTitle>
                <FormField
                  placeholder="Text"
                  id="text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </Box>
              <Box w="100%">
                <FormTitle>Link</FormTitle>
                <FormField
                  placeholder="Link"
                  id="link"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                />
              </Box>
            </VStack>
          </FormContext>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onSave(text, link)}>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default HyperlinkModal

HyperlinkModal.propTypes = {
  initialText: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
