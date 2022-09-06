import {
  VStack,
  Button,
  Flex,
  FormControl,
  Switch,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import FormField from "components/FormField"
import type { SetStateAction } from "react"
import { useState } from "react"

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
    type: InstagramModalTabs,
    value: InstagramModalPostUrlProps | InstagramModalEmbedCodeProps | undefined
  ) => void
  onClose: () => void
}

export enum InstagramModalTabs {
  PostUrl = 0,
  EmbedCode = 1,
}

const InstagramModal = ({
  onSave,
  onClose,
}: InstagramModalProps): JSX.Element => {
  const [tabIndex, setTabIndex] = useState<number>(InstagramModalTabs.PostUrl)
  const [postUrl, setPostUrl] = useState<string>("")
  const [isCaptioned, setCaptioned] = useState<boolean>(false)
  const [embedCode, setEmbedCode] = useState<string>("")

  // TODO: This hook should be used for all other modals
  const { isOpen } = useDisclosure({ defaultIsOpen: true })

  const getInstagramModalDto = (
    index: InstagramModalTabs
  ): InstagramModalPostUrlProps | InstagramModalEmbedCodeProps | undefined => {
    if (index === InstagramModalTabs.PostUrl) {
      return {
        postUrl,
        isCaptioned,
      }
    }
    if (index === InstagramModalTabs.EmbedCode) {
      return {
        embedCode,
      }
    }
    return undefined
  }

  const isInputValid = (index: InstagramModalTabs): boolean => {
    if (index === InstagramModalTabs.PostUrl) {
      return RegExp(INSTAGRAM_POST_URL_REGEX).test(postUrl)
    }
    if (index === InstagramModalTabs.EmbedCode) {
      return embedCode.length > 0
    }
    return false
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Insert Instagram post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs onChange={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>Post URL</Tab>
              <Tab>Embed Code</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack display="block">
                  <FormContext isRequired>
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
                    <Flex justifyContent="space-between" w="100%">
                      <FormLabel>Include post caption</FormLabel>
                      <Switch
                        id="isCaptioned"
                        onChange={() => setCaptioned(!isCaptioned)}
                      />
                    </Flex>
                  </FormContext>
                </VStack>
              </TabPanel>
              <TabPanel>
                <VStack display="block">
                  <FormContext isRequired>
                    <FormControl>
                      <FormTitle>Instagram embed code</FormTitle>
                      <Textarea
                        placeholder='<blockquote class="instagram-media"...'
                        id="code"
                        value={embedCode}
                        onChange={(event) => setEmbedCode(event.target.value)}
                      />
                    </FormControl>
                  </FormContext>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            isDisabled={!isInputValid(tabIndex)}
            onClick={() => onSave(tabIndex, getInstagramModalDto(tabIndex))}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default InstagramModal
