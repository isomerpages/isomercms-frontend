import type { ButtonProps, LinkProps } from "@opengovsg/design-system-react"
import { Button, Link } from "@opengovsg/design-system-react"

// NOTE: This button exists just to ensure that the text won't have an underline displayed
// TODO: We should make a separate variant for button rather than a new component
export const ButtonLink = (props: ButtonProps & LinkProps): JSX.Element => {
  return <Button as="a" rel="noopener noreferrer" target="_blank" {...props} />
}
