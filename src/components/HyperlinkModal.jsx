import { CloseButton, VStack, Box, Button, Flex } from "@chakra-ui/react"
import axios from "axios"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import { useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import FormContext from "./Form/FormContext"
import FormTitle from "./Form/FormTitle"

// axios settings
axios.defaults.withCredentials = true

const HyperlinkModal = ({ onSave, initialText, onClose }) => {
  const [text, setText] = useState(initialText)
  const [link, setLink] = useState("")

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={elementStyles["modal-settings"]}>
          <div className={elementStyles.modalHeader}>
            <h1>Insert hyperlink</h1>
            <CloseButton onClick={onClose} />
          </div>
          <div className={elementStyles.modalContent}>
            <div>
              <FormContext isRequired>
                <VStack display="block">
                  <Box>
                    <FormTitle>Text</FormTitle>
                    <FormField
                      placeholder="Text"
                      id="text"
                      value={text}
                      onChange={(event) => setText(event.target.value)}
                    />
                  </Box>
                  <Box>
                    <FormTitle>Link</FormTitle>
                    <FormField
                      placeholder="Link"
                      id="link"
                      value={link}
                      onChange={(event) => setLink(event.target.value)}
                    />
                  </Box>
                  <Flex justifyContent="end">
                    <Button onClick={() => onSave(text, link)}>Save</Button>
                  </Flex>
                </VStack>
              </FormContext>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HyperlinkModal

HyperlinkModal.propTypes = {
  initialText: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
