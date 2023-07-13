import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"

import { PendingApprovalModal } from "./PendingApprovalModal"

const modalMeta = {
  title: "Components/ReviewRequest/Pending Approval Modal",
  component: PendingApprovalModal,
} as Meta<typeof PendingApprovalModal>

const Template: StoryFn<Record<string, never>> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PendingApprovalModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
