import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { EditingBlockedModal } from "./EditingBlockedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Editing Blocked Modal",
  component: EditingBlockedModal,
} as ComponentMeta<typeof EditingBlockedModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <EditingBlockedModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
