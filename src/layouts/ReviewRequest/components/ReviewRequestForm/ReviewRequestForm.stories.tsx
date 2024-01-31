import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  VStack,
  ModalBody,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
  Text,
  ModalFooter,
  useDisclosure,
  Heading,
} from "@chakra-ui/react"
import { ModalCloseButton, Button, Tab } from "@opengovsg/design-system-react"
import { Story, ComponentMeta } from "@storybook/react"
import _ from "lodash"
import { useForm, FormProvider } from "react-hook-form"

import { Modal } from "components/Modal"

import { MOCK_ADMINS } from "mocks/constants"
import { ReviewRequestInfo } from "types/reviewRequest"

import { ReviewRequestForm, ReviewRequestFormProps } from "./ReviewRequestForm"

const formMeta = {
  title: "Components/ReviewRequest/Modal Form",
  component: ReviewRequestForm,
} as ComponentMeta<typeof ReviewRequestForm>

const Template: Story<ReviewRequestFormProps> = ({ admins }) => {
  const methods = useForm<Required<ReviewRequestInfo>>({
    mode: "onTouched",
  })
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
            <Heading as="h4" textStyle="h4" color="text.title.alt">
              Request a review
            </Heading>
            <Text textStyle="body-2" color="text.helper">
              An Admin needs to review and approve your changes before they can
              be published
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
              <Tab ml={0}>Add Details</Tab>
              <Tab>Edited Items</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <FormProvider {...methods}>
                  <ReviewRequestForm admins={admins} />
                </FormProvider>
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

export const WithLongDropdown = Template.bind({})
WithLongDropdown.args = {
  admins: _.times(100, () => MOCK_ADMINS).flat(),
}

export const Playground = Template.bind({})
Playground.args = {
  admins: MOCK_ADMINS,
}

export default formMeta
