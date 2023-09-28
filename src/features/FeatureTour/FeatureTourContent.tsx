import { Icon, Text } from "@chakra-ui/react"
import { Badge } from "@opengovsg/design-system-react"
import { BiCheck } from "react-icons/bi"

export const HeroOptionsFeatureTourContent = (): JSX.Element => {
  return (
    <>
      <Badge
        mt="2rem"
        variant="subtle"
        display="inline-flex"
        columnGap="0.5rem"
        alignItems="center"
        colorScheme="brand.secondary"
      >
        <Icon as={BiCheck} h="1rem" w="1rem" />
        <Text textStyle="caption-1">New feature</Text>
      </Badge>
      <Text textStyle="subhead-1" mt="1rem" color="base.content.default">
        {" "}
        Now you can customise your hero banner with various layouts!{" "}
      </Text>
      <Text textStyle="body-2" mt="0.5rem" color="base.content.default">
        {`We've added some variations to how you can display your hero section.
        Try them out here.`}
      </Text>
    </>
  )
}
