import { Box, Center, Text } from "@chakra-ui/react"

export const SiteLaunchPadTitle = ({
  title,
  subTitle,
}: {
  title: string
  subTitle: string
}): JSX.Element => {
  return (
    <Box bg="base.canvas.purpleSubtle" w="100%" h="100%">
      <Center>
        <Box w="65%">
          <Text as="h2" textStyle="h2" textAlign="left">
            {title}
          </Text>
          <Text textStyle="body-2">{subTitle}</Text>
        </Box>
      </Center>
    </Box>
  )
}
