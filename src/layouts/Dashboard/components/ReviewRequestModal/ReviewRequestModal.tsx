import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
} from "@chakra-ui/react"
import { Button, ModalCloseButton, Tab } from "@opengovsg/design-system-react"

import { EditedItemProps, RequestOverview } from "./RequestOverview"
import { ReviewRequestForm } from "./ReviewRequestForm"

export const ReviewRequestModal = (props: ModalProps): JSX.Element => {
  const { onClose } = props
  return (
    <form>
      <Modal {...props} size="full">
        <ModalOverlay />
        <ModalContent>
          {/* 
          NOTE: padding has to be used as the base component from Chakra uses it to set padding.
          Not using it (and using pt etc) would result in the property being overwritten to the default.
          The format is top, left + right, bottom.
          */}
          <ModalHeader bg="blue.50" padding="6rem 16.5rem 1.5rem">
            <VStack spacing="0.625rem" align="flex-start">
              <Text as="h2" textStyle="h2" color="text.title.alt">
                Request a review
              </Text>
              <Text textStyle="body-2" color="text.helper">
                An Admin needs to review and approve your changes before they
                can be published
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody px="16.5rem" pt="1.5rem" pb="2.5rem">
            <Tabs>
              <TabList>
                {/* 
                NOTE: The design system tab has inbuilt left-margin.
                However, the figma design requires that the tabs be aligned with the content.
                Hence, margin is set to 0 here 
                */}
                <Tab
                  ml={0}
                  _focus={{
                    boxShadow: "none",
                  }}
                  color="text.link.disabled"
                >
                  Add Details
                </Tab>
                <Tab
                  _focus={{
                    boxShadow: "none",
                  }}
                  color="text.link.disabled"
                >
                  Edited Items
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <ReviewRequestForm />
                </TabPanel>
                <TabPanel>
                  <RequestOverview items={MOCK_ITEMS} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <Divider bg="border.divider.alt" />
          <ModalFooter>
            <Button variant="clear" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button>Submit Review</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </form>
  )
}

const MOCK_ITEMS: EditedItemProps[] = [
  {
    type: ["page"],
    name: "some file",
    path: ["asdfasdf"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
]
