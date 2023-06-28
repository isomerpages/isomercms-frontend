import { Box, StackProps } from "@chakra-ui/react"

export const SiteLaunchPadBody = ({ children }: StackProps): JSX.Element => {
  return (
    // we add min width so that the table don't get squished when screen is resized
    <Box w="65%" minWidth="56.25rem">
      {children}
    </Box>
  )
}
