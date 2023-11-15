import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"

import { useSuccessToast } from "utils"

import { EditorEmbedModal } from "./EditorEmbedModal"

const editorEmbedModalMeta = {
  title: "Components/Editor/Embed Modal",
  component: EditorEmbedModal,
} as Meta<typeof EditorEmbedModal>

const editorEmbedModalTemplate: StoryFn<typeof EditorEmbedModal> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = () => {
    successToast({
      id: "storybook-editor-embed-success",
      description: "STORYBOOK: Embed has been successfully added",
    })
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Open editor embed modal</Button>
      <EditorEmbedModal
        isOpen={isOpen}
        onClose={onClose}
        onProceed={onProceed}
        cursorValue=""
      />
    </>
  )
}

export const Default = editorEmbedModalTemplate.bind({})
Default.args = {}

export default editorEmbedModalMeta
