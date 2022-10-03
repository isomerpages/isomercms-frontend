import {
  Flex,
  Icon,
  Spacer,
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Link,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Skeleton,
  LinkProps,
  Center,
  VStack,
} from "@chakra-ui/react"
import { Button, ButtonProps, IconButton } from "@opengovsg/design-system-react"
import { AvatarMenu } from "components/Header/AvatarMenu"
import { NotificationMenu } from "components/Header/NotificationMenu"
import { BiArrowBack } from "react-icons/bi"
import { Link as RouterLink, useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { useStagingUrl } from "hooks/settingsHooks"

import { NavImage } from "assets"

export const SiteViewHeader = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { siteName } = useParams<{ siteName: string }>()
  const { data: stagingUrl, isLoading } = useStagingUrl({ siteName })
  const { displayedName } = useLoginContext()

  return (
    <>
      <Flex
        py="0.625rem"
        px="2rem"
        borderBottom="1px solid"
        borderColor="border.divider.alt"
        bg="white"
        h="4rem"
      >
        <HStack spacing="1.25rem">
          <IconButton
            aria-label="Back to sites"
            variant="clear"
            icon={
              <Icon as={BiArrowBack} fontSize="1.25rem" fill="icon.secondary" />
            }
            as={RouterLink}
            to="/sites"
          />
          <Text color="text.label" textStyle="body-1">
            All sites
          </Text>
        </HStack>
        <Spacer />
        <HStack>
          <Button
            onClick={onOpen}
            variant="outline"
            colorScheme="primary"
            isDisabled={!stagingUrl}
          >
            View Staging
          </Button>
          <ButtonLink href={`https://github.com/isomerpages/${siteName}/pulls`}>
            <Text color="white">Pull Request</Text>
          </ButtonLink>
          <NotificationMenu siteName={siteName} />
          <AvatarMenu name={displayedName} />
        </HStack>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="1.5rem">
              <Center>
                <NavImage />
              </Center>
              <Text textStyle="body-2">
                Your changes may take some time to be reflected. Refresh your
                staging site to see if your changes have been built.
              </Text>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack w="100%" spacing={2} justifyContent="flex-end">
              <Button variant="clear" onClick={onClose}>
                Cancel
              </Button>
              <Skeleton isLoaded={!isLoading}>
                <ButtonLink href={stagingUrl}>
                  <Text color="white">Proceed to staging site</Text>
                </ButtonLink>
              </Skeleton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// NOTE: This button exists just to ensure that the text won't have an underline displayed
const ButtonLink = (props: ButtonProps & LinkProps) => {
  return (
    <Button
      as={Link}
      rel="noopener noreferrer"
      target="_blank"
      textDecoration="none"
      _hover={{
        textDecoration: "none",
        bgColor: "primary.600",
      }}
      {...props}
    />
  )
}
