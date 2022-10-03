import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  VStack,
  ModalBody,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Divider,
  Text,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react"
import { ModalCloseButton, Button, Tab } from "@opengovsg/design-system-react"
import { Story, ComponentMeta } from "@storybook/react"
import _ from "lodash"

import { MOCK_ITEMS } from "mocks/constants"

import { RequestOverview, RequestOverviewProps } from "./RequestOverview"

const formMeta = {
  title: "Components/ReviewRequestModal/Overview",
  component: RequestOverview,
} as ComponentMeta<typeof RequestOverview>

const Template: Story<RequestOverviewProps> = ({ items }) => {
  const props = useDisclosure({ defaultIsOpen: true })
  return (
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
              An Admin needs to review and approve your changes before they can
              be published
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px="16.5rem" pt="1.5rem" pb="2.5rem">
          <Tabs defaultIndex={1}>
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
                isDisabled
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
              <TabPanel>This is empty</TabPanel>
              <TabPanel>
                <RequestOverview items={items} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <Divider bg="border.divider.alt" />
        <ModalFooter>
          <Button variant="clear" mr={3}>
            Cancel
          </Button>
          <Button>Submit Review</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const ManyEditors = Template.bind({})
ManyEditors.args = {
  items: _.times(100, () => MOCK_ITEMS).flat(),
}

export const Playground = Template.bind({})
Playground.args = {
  items: MOCK_ITEMS,
}

export default formMeta
