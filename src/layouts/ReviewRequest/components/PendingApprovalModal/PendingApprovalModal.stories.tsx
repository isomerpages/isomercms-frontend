import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { PendingApprovalModal } from "./PendingApprovalModal"

const modalMeta = {
  title: "Components/ReviewRequest/Pending Approval Modal",
  component: PendingApprovalModal,
} as ComponentMeta<typeof PendingApprovalModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PendingApprovalModal isOpen={isOpen} onClose={onClose}>
        <Button colorScheme="danger">Click me</Button>
      </PendingApprovalModal>
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
