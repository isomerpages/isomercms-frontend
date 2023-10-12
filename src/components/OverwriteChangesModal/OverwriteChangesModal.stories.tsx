import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"

import { useSuccessToast } from "utils/toasts"

import { OverwriteChangesModal } from "./OverwriteChangesModal"

const overwriteChangesModalMeta = {
  title: "Components/OverwriteChangesModal",
  component: OverwriteChangesModal,
} as Meta<typeof OverwriteChangesModal>

const overwriteChangesModalTemplate: StoryFn<
  typeof OverwriteChangesModal
> = () => {
  const props = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = () => {
    successToast({
      id: "storybook-overwrite-changes-success",
      description: "STORYBOOK: Changes have been successfully overwritten",
    })
    props.onClose()
  }

  return (
    <>
      <Button onClick={props.onOpen}>Open overwrite changes modal</Button>
      <OverwriteChangesModal onProceed={onProceed} {...props} />
    </>
  )
}

export const Default = overwriteChangesModalTemplate.bind({})
Default.args = {}

export default overwriteChangesModalMeta
