import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { WarningModal } from "./WarningModal"

const modalMeta = {
  title: "Components/WarningModal",
  component: WarningModal,
} as ComponentMeta<typeof WarningModal>

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
      <WarningModal
        isOpen={isOpen}
        onClose={onClose}
        displayTitle={displayTitle}
        displayText={displayText}
      >
        <Button>{buttonText}</Button>
      </WarningModal>
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
      <WarningModal
        isOpen={isOpen}
        onClose={onClose}
        displayTitle={displayTitle}
        displayText={displayText}
      >
        <Button variant="clear" colorScheme="secondary">
          {buttonText}
        </Button>
        <Button>{secondButtonText}</Button>
      </WarningModal>
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
