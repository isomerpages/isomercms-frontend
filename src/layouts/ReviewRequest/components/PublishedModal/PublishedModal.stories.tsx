import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { PublishedModal } from "./PublishedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Published Modal",
  component: PublishedModal,
} as ComponentMeta<typeof PublishedModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PublishedModal isOpen={isOpen} onClose={onClose}>
        <Button colorScheme="danger">Click me</Button>
      </PublishedModal>
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
