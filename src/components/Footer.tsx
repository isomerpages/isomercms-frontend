import { HStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { MouseEventHandler } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

export interface FooterProps {
  keyCallback: MouseEventHandler<HTMLButtonElement>
  isKeyButtonDisabled: boolean
  keyButtonIsLoading: boolean
  optionalButtonText: string
  optionalCallback?: MouseEventHandler<HTMLButtonElement>
}

const Footer = ({
  keyCallback,
  isKeyButtonDisabled = false,
  keyButtonIsLoading = false,
  optionalButtonText = "Cancel",
  optionalCallback,
}: FooterProps): JSX.Element => (
  <div className={editorStyles.pageEditorFooter}>
    <HStack>
      {optionalCallback && (
        <Button variant="clear" onClick={optionalCallback}>
          {optionalButtonText}
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
