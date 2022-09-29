import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { CancelRequestModal } from "./CancelRequestModal"

const modalMeta = {
  title: "Components/ReviewRequest/Cancel Request Modal",
  component: CancelRequestModal,
} as ComponentMeta<typeof CancelRequestModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <CancelRequestModal isOpen={isOpen} onClose={onClose}>
        <Button colorScheme="danger">Click me</Button>
      </CancelRequestModal>
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
