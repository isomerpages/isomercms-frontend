import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { GenericWarningModal } from "./GenericWarningModal"

const modalMeta = {
  title: "Components/GenericWarningModal",
  component: GenericWarningModal,
} as ComponentMeta<typeof GenericWarningModal>

interface TemplateArgs {
  buttonText: string
  displayTitle: string
  displayText: string
}

const SingleButtonModalTemplate: Story<TemplateArgs> = ({
  buttonText,
  displayTitle,
  displayText,
}: TemplateArgs) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <GenericWarningModal
        isOpen={isOpen}
        onClose={onClose}
        displayTitle={displayTitle}
        displayText={displayText}
      >
        <Button>{buttonText}</Button>
      </GenericWarningModal>
    </>
  )
}

interface MultiButtonModalTemplateArgs extends TemplateArgs {
  secondButtonText: string
}
const MultiButtonModalTemplate: Story<MultiButtonModalTemplateArgs> = ({
  buttonText,
  secondButtonText,
  displayTitle,
  displayText,
}: MultiButtonModalTemplateArgs) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <GenericWarningModal
        isOpen={isOpen}
        onClose={onClose}
        displayTitle={displayTitle}
        displayText={displayText}
      >
        <Button variant="clear" colorScheme="secondary">
          {buttonText}
        </Button>
        <Button>{secondButtonText}</Button>
      </GenericWarningModal>
    </>
  )
}

export const SingleButtonModal = SingleButtonModalTemplate.bind({})
SingleButtonModal.args = {
  buttonText: "Button",
  displayTitle: "Modal Title",
  displayText: "Modal Text",
}
export const MultiButtonModal = MultiButtonModalTemplate.bind({})
MultiButtonModal.args = {
  buttonText: "Button 1",
  secondButtonText: "Button 2",
  displayTitle: "Modal Title",
  displayText: "Modal Text",
}

export default modalMeta
