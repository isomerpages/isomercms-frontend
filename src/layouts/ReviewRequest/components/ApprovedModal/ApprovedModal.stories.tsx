import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { ApprovedModal } from "./ApprovedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Request Approved Modal",
  component: ApprovedModal,
} as ComponentMeta<typeof ApprovedModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ApprovedModal isOpen={isOpen} onClose={onClose}>
        <Button colorScheme="danger">Click me</Button>
      </ApprovedModal>
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
