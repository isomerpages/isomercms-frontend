import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"

import { useSuccessToast } from "utils"

import { EditorDrawerCloseWarningModal } from "./EditorDrawerCloseWarningModal"

const editorDrawerCloseWarningModalMeta = {
  title: "Components/Editor/Drawer Close Warning Modal",
  component: EditorDrawerCloseWarningModal,
} as Meta<typeof EditorDrawerCloseWarningModal>

interface EditorDrawerCloseWarningModalTemplateArgs {
  name: string
}

const editorDrawerCloseWarningModalTemplate: StoryFn<
  typeof EditorDrawerCloseWarningModal
> = ({ name }: EditorDrawerCloseWarningModalTemplateArgs) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = () => {
    successToast({
      id: "storybook-editor-drawer-close-warning-success",
      description: "STORYBOOK: Successfully exited from editor drawer",
    })
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Open editor drawer close warning modal</Button>
      <EditorDrawerCloseWarningModal
        name={name}
        isOpen={isOpen}
        onClose={onClose}
        onProceed={onProceed}
      />
    </>
  )
}

export const Default = editorDrawerCloseWarningModalTemplate.bind({})
Default.args = {}

export default editorDrawerCloseWarningModalMeta
