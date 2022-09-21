import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { EditedItemProps } from "./RequestOverview"
import {
  ReviewRequestModal,
  ReviewRequestModalProps,
} from "./ReviewRequestModal"

const modalMeta = {
  title: "Components/ReviewRequestModal/Modal",
  component: ReviewRequestModal,
} as ComponentMeta<typeof ReviewRequestModal>

export const MOCK_ITEMS: EditedItemProps[] = [
  {
    type: ["page"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
  {
    type: ["nav"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
  {
    type: ["file"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
  {
    type: ["setting"],
    name:
      "some file with an extremely long title that probably can't fit into a single line and we have to truncate this somehow. so we will hopefully display an ellipsis over it",
    // NOTE: We don't have arbitrary nested folders.
    // We only have depth = 2 for our folders.
    path: [
      "something extremely long that",
      "might not be able to fit into a single line",
      "so we have to truncate it to show an ellipsis at the end",
    ],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
  {
    type: ["image"],
    name: "some file",
    path: ["some", "thing"],
    url: "www.google.com",
    lastEditedBy: "asdf",
    lastEditedTime: 129823104823094,
  },
]

export const MOCK_ADMINS = [
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
