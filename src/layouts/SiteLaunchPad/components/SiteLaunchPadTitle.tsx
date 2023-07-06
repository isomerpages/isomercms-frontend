import { Box, Center, Text, VStack } from "@chakra-ui/react"

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
        <Box mt="3rem" mb="1.5rem" w="65%">
          <Text as="h2" textStyle="h2" textAlign="left">
            {title}
          </Text>
          <Text textStyle="body-2" textAlign="left">
            {subTitle}
          </Text>
        </Box>
      </Center>
    </Box>
  )
}
