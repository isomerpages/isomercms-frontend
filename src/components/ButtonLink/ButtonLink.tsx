import type { ButtonProps, LinkProps } from "@opengovsg/design-system-react"
import { Button, Link } from "@opengovsg/design-system-react"

// NOTE: This button exists just to ensure that the text won't have an underline displayed
// TODO: We should make a separate variant for button rather than a new component
export const ButtonLink = (props: ButtonProps & LinkProps) => {
  return (
    <Button
      as={Link}
      rel="noopener noreferrer"
      target="_blank"
      border="none"
      justifyContent="flex-start"
      alignItems="flex-start"
      textDecoration="none"
      _hover={{
        textDecoration: "none",
        bgColor: "primary.600",
      }}
      {...props}
    />
  )
}
