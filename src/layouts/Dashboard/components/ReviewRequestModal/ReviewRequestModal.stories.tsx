import { Button, useDisclosure, Text } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { ReviewRequestModal } from "./ReviewRequestModal"

const modalMeta = {
  title: "Components/ReviewRequestModal",
  component: ReviewRequestModal,
} as ComponentMeta<typeof ReviewRequestModal>

interface TemplateArgs {
  buttonText: string
}

const SingleButtonModalTemplate: Story<TemplateArgs> = ({
  buttonText,
}: TemplateArgs) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ReviewRequestModal isOpen={isOpen} onClose={onClose}>
        <Button colorScheme="danger">{buttonText}</Button>
      </ReviewRequestModal>
    </>
  )
}
export const SingleButtonModal = SingleButtonModalTemplate.bind({})
SingleButtonModal.args = {
  buttonText: "Button",
}

export default modalMeta
