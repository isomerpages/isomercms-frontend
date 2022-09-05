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
import { SetStateAction, useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { INSTAGRAM_POST_URL_REGEX } from "utils/validators"

import FormContext from "./Form/FormContext"
import FormTitle from "./Form/FormTitle"

type InstagramModalPostUrlProps = {
  postUrl: string
  isCaptioned: boolean
}

type InstagramModalEmbedCodeProps = {
  embedCode: string
}

type InstagramModalProps = {
  onSave: (
    type: string,
    value: InstagramModalPostUrlProps | InstagramModalEmbedCodeProps
  ) => void
  onClose: () => void
}

// axios settings
axios.defaults.withCredentials = true

const InstagramModal = ({
  onSave,
  onClose,
}: InstagramModalProps): JSX.Element => {
  const [postUrl, setPostUrl] = useState<string>("")
  const [isCaptioned, setCaptioned] = useState<boolean>(false)
  const [embedCode, setEmbedCode] = useState<string>("")

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
                        <Box pt={3}>
                          <FormControl
                            isInvalid={
                              !!postUrl &&
                              !RegExp(INSTAGRAM_POST_URL_REGEX).test(postUrl)
                            }
                          >
                            <FormTitle>URL to Instagram post</FormTitle>
                            <FormField
                              id="code"
                              placeholder="https://www.instagram.com/p/..."
                              value={postUrl}
                              onChange={(event: {
                                target: { value: SetStateAction<string> }
                              }) => setPostUrl(event.target.value)}
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
                        <Box pt={3}>
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
