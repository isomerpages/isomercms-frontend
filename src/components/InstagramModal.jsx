import {
  CloseButton,
  VStack,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Switch,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
} from "@chakra-ui/react"
import { FormLabel } from "@opengovsg/design-system-react"
import axios from "axios"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import { useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { INSTAGRAM_POST_URL_REGEX } from "utils/validators"

import FormContext from "./Form/FormContext"
import FormTitle from "./Form/FormTitle"

// axios settings
axios.defaults.withCredentials = true

const InstagramModal = ({ onSave, onClose }) => {
  const [postUrl, setPostUrl] = useState("")
  const [isCaptioned, setCaptioned] = useState(false)
  const [embedCode, setEmbedCode] = useState("")

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={elementStyles["modal-settings"]}>
          <div className={elementStyles.modalHeader}>
            <h1>Insert Instagram post</h1>
            <CloseButton onClick={onClose} />
          </div>
          <div className={elementStyles.modalContent}>
            <div>
              <Tabs>
                <TabList>
                  <Tab>Post URL</Tab>
                  <Tab>Embed Code</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack display="block">
                      <FormContext isRequired>
                        <Box />
                        <Box>
                          <FormControl
                            isInvalid={
                              postUrl &&
                              !RegExp(INSTAGRAM_POST_URL_REGEX).test(postUrl)
                            }
                          >
                            <FormTitle>URL to Instagram post</FormTitle>
                            <FormField
                              placeholder="https://www.instagram.com/p/..."
                              id="code"
                              value={postUrl}
                              onChange={(event) =>
                                setPostUrl(event.target.value)
                              }
                              width="50%"
                              isRequired
                            />
                            <FormErrorMessage>
                              The URL you have entered is not valid.
                            </FormErrorMessage>
                          </FormControl>
                        </Box>
                        <Box>
                          <Flex justifyContent="space-between" w="100%">
                            <FormLabel>Include post caption</FormLabel>
                            <Switch
                              id="isCaptioned"
                              onChange={(event) =>
                                setCaptioned(event.target.checked)
                              }
                            />
                          </Flex>
                        </Box>
                        <Flex justifyContent="end">
                          <Button
                            isDisabled={
                              !postUrl ||
                              !RegExp(INSTAGRAM_POST_URL_REGEX).test(postUrl)
                            }
                            onClick={() =>
                              onSave("postUrl", {
                                postUrl,
                                isCaptioned,
                              })
                            }
                          >
                            Save
                          </Button>
                        </Flex>
                      </FormContext>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <VStack display="block">
                      <FormContext>
                        <Box />
                        <Box>
                          <FormControl isRequired>
                            <FormTitle>Instagram embed code</FormTitle>
                            <Textarea
                              placeholder='<blockquote class="instagram-media"...'
                              id="code"
                              value={embedCode}
                              onChange={(event) =>
                                setEmbedCode(event.target.value)
                              }
                            />
                          </FormControl>
                        </Box>
                        <Flex justifyContent="end">
                          <Button
                            isDisabled={!embedCode}
                            onClick={() => onSave("embedCode", { embedCode })}
                          >
                            Save
                          </Button>
                        </Flex>
                      </FormContext>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default InstagramModal

InstagramModal.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
