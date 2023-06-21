import { Flex, Text, FlexProps } from "@chakra-ui/react"

interface SectionHeaderProps extends FlexProps {
  label: string | JSX.Element
}

export const SectionHeader = ({
  label,
  children,
  ...rest
}: SectionHeaderProps): JSX.Element => {
  return (
    <Flex
      flexDir="row"
      w="full"
      justify="space-between"
      align="center"
      {...rest}
    >
      <Text as="h5" textStyle="h5" color="title.alt">
        {label}
      </Text>
      {children}
    </Flex>
  )
}
