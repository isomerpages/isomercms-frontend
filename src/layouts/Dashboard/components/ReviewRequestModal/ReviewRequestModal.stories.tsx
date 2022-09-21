import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { MOCK_ITEMS, MOCK_ADMINS } from "mocks/constants"

import { EditedItemProps } from "./RequestOverview"
import {
  ReviewRequestModal,
  ReviewRequestModalProps,
} from "./ReviewRequestModal"

const modalMeta = {
  title: "Components/ReviewRequestModal/Modal",
  component: ReviewRequestModal,
} as ComponentMeta<typeof ReviewRequestModal>
type TemplateProps = Pick<ReviewRequestModalProps, "admins" | "items">

const Template: Story<TemplateProps> = ({ admins, items }: TemplateProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ReviewRequestModal
        admins={admins}
        items={items}
        isOpen={isOpen}
        onClose={onClose}
      >
        <Button colorScheme="danger">Click me</Button>
      </ReviewRequestModal>
    </>
  )
}

export const Playground = Template.bind({})
Playground.args = {
  items: MOCK_ITEMS,
  admins: MOCK_ADMINS,
}

export default modalMeta
