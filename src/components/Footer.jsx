import { HStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

const Footer = ({
  keyCallback,
  isKeyButtonDisabled,
  keyButtonIsLoading,
  optionalCallback,
}) => (
  <div className={editorStyles.pageEditorFooter}>
    <HStack>
      {optionalCallback && (
        <Button variant="clear" onClick={optionalCallback}>
          Cancel
        </Button>
      )}
      {keyCallback && (
        <Button
          isDisabled={isKeyButtonDisabled}
          onClick={keyCallback}
          isLoading={keyButtonIsLoading}
        >
          Save
        </Button>
      )}
    </HStack>
  </div>
)

export default Footer
