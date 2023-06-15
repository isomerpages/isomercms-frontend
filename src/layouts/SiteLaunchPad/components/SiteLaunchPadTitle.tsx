import { Box, Text } from "@chakra-ui/react"

export const SiteLaunchPadTitle = ({
  title,
  subTitle,
}: {
  title: string
  subTitle: string
}): JSX.Element => {
  return (
    <Box bg="brand.illustration.50" w="65%">
      <Text as="h2" textStyle="h2" textAlign="left">
        {title}
      </Text>
      <Text textStyle="body-2">{subTitle}</Text>
    </Box>
  )
}
