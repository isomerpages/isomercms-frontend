import { Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Editor } from "@tiptap/core"

import { EditorDrawer } from "components/EditorDrawer"

interface EditorCardsDrawerProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export const EditorCardsDrawer = ({
  editor,
  isOpen,
  onClose,
  onProceed,
}: EditorCardsDrawerProps): JSX.Element => {
  return (
    <EditorDrawer isOpen={isOpen}>
      <EditorDrawer.Header onClose={onClose}>
        <Text as="h5" textStyle="h5">
          Editing card grid
        </Text>
      </EditorDrawer.Header>

      <EditorDrawer.Content>
        <Text>Placeholder content</Text>
      </EditorDrawer.Content>

      <EditorDrawer.Footer>
        <Button>Save card grid</Button>
      </EditorDrawer.Footer>
    </EditorDrawer>
  )
}
