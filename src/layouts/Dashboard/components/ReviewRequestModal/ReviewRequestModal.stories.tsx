import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { EditedItemProps } from "./RequestOverview"
import {
  ReviewRequestModal,
  ReviewRequestModalProps,
} from "./ReviewRequestModal"

const modalMeta = {
  title: "Components/ReviewRequestModal",
  component: ReviewRequestModal,
} as ComponentMeta<typeof ReviewRequestModal>

const MOCK_ITEMS: EditedItemProps[] = [
  {
    type: ["page"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
]

const MOCK_ADMINS = [
  {
    value: "a cat",
    label: "Cat",
  },
  {
    value: "Someone",
    label: "Unknown",
  },
]

type TemplateProps = Pick<ReviewRequestModalProps, "admins" | "items">

const SingleButtonModalTemplate: Story<TemplateProps> = ({
  admins,
  items,
}: TemplateProps) => {
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
export const SingleButtonModal = SingleButtonModalTemplate.bind({})
SingleButtonModal.args = {
  items: MOCK_ITEMS,
  admins: MOCK_ADMINS,
}

export default modalMeta
