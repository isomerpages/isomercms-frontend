import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"

import { ApprovedModal } from "./ApprovedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Request Approved Modal",
  component: ApprovedModal,
} as Meta<typeof ApprovedModal>

const Template: StoryFn<Record<string, never>> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ApprovedModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={() => console.log("Clicked")}
      />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
