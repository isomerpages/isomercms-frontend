import { Flex, Text, Icon } from "@chakra-ui/react"
import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { BiPlus } from "react-icons/bi"

interface SectionHeaderProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "iconSpacing"> {
  label: string | JSX.Element
}

// eslint-disable-next-line import/prefer-default-export
export const SectionHeader = ({
  label,
  ...rest
}: SectionHeaderProps): JSX.Element => {
  return (
    <Flex flexDir="row" w="full" justify="space-between">
      <Text as="h3" textStyle="h3" color="title.alt">
        {label}
      </Text>
      <Button
        variant="outline"
        /* eslint-disable-next-line react/jsx-props-no-spreading */
        {...rest}
        iconSpacing="0.5rem"
        leftIcon={<Icon as={BiPlus} fontSize="1.5rem" fill="icon.default" />}
      />
    </Flex>
  )
}
