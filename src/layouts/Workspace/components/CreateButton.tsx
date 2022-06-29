import { Icon } from "@chakra-ui/react"
import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { BiPlus } from "react-icons/bi"

export const CreateButton = (
  props: Omit<ButtonProps, "iconSpacing" | "leftIcon" | "rightIcon">
): JSX.Element => {
  return (
    <Button
      variant="outline"
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...props}
      iconSpacing="0.5rem"
      leftIcon={<Icon as={BiPlus} fontSize="1.5rem" fill="icon.default" />}
    />
  )
}
