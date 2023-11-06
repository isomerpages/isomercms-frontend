import { useMultiStyleConfig, Box } from "@chakra-ui/react"
import { PropsWithChildren } from "react"

import { AttachmentStylesProvider } from "components/Attachment/AttachmentContext"

export const Dropzone = ({ children }: PropsWithChildren) => {
  const styles = useMultiStyleConfig("Attachment")

  return (
    <AttachmentStylesProvider value={styles}>
      <Box __css={styles.container}>
        <Box __css={styles.dropzone} _hover={{}} _active={{}} cursor="auto">
          {children}
        </Box>
      </Box>
    </AttachmentStylesProvider>
  )
}
