import { TextProps, Text, Icon, HStack } from "@chakra-ui/react"

interface SectionCaptionProps extends TextProps {
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element
  label?: string
}
// eslint-disable-next-line import/prefer-default-export
export const SectionCaption = ({
  icon,
  label,
  ...rest
}: SectionCaptionProps): JSX.Element => {
  return (
    <HStack spacing="0.25rem" w="100%" alignItems="center">
      <Icon as={icon} fill="icon.alt" fontSize="1.25rem" />
      <Text as="p" color="text.description">
        <Text textStyle="subhead-3" as="span">
          {label}
        </Text>
        <Text textStyle="body-2" as="span" {...rest} />
      </Text>
    </HStack>
  )
}
