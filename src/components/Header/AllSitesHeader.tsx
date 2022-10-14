import {
  Flex,
  Spacer,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react"
import { AvatarMenu } from "components/Header/AvatarMenu"
import { Link as RouterLink } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

export const AllSitesHeader = (): JSX.Element => {
  const { displayedName } = useLoginContext()
  return (
    <Flex
      py="0.625rem"
      px="2rem"
      borderBottom="1px solid"
      borderColor="border.divider.alt"
      bg="white"
      h="4rem"
    >
      <Flex w="180px" justifyContent="center">
        <Image
          src={`${process.env.PUBLIC_URL}/img/logo.svg`}
          alt="Isomer CMS logo"
        />
      </Flex>
      <Spacer />
      <HStack spacing="2rem">
        <LinkBox position="relative">
          <LinkOverlay as={RouterLink} to="https://guide.isomer.gov.sg/">
            <Text color="text.link.dark" noOfLines={1}>
              Get help
            </Text>
          </LinkOverlay>
        </LinkBox>
        <AvatarMenu name={displayedName} />
      </HStack>
    </Flex>
  )
}
