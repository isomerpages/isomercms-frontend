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
} from "@chakra-ui/react"
import { Button, ButtonProps } from "@opengovsg/design-system-react"
import { BiArrowBack } from "react-icons/bi"
import { Link as RouterLink, useParams } from "react-router-dom"

import { useStagingUrl } from "hooks/settingsHooks"

export const SiteViewHeader = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { siteName } = useParams<{ siteName: string }>()
  const { data: stagingUrl, isLoading } = useStagingUrl({ siteName })

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
        <Button
          variant="clear"
          leftIcon={
            <Icon as={BiArrowBack} fontSize="1.25rem" fill="icon.secondary" />
          }
          iconSpacing="1.25rem"
          as={RouterLink}
          to="/sites"
        >
          <Text color="text.label" textStyle="body-1">
            All sites
          </Text>
        </Button>
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
        </HStack>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader />
          <ModalCloseButton />
          <ModalBody>
            <Text textStyle="body-2">
              Your changes may take some time to be reflected. Refresh your
              staging site to see if your changes have been built.
            </Text>
          </ModalBody>
          <ModalFooter>
            <HStack w="100%" spacing={2} justifyContent="flex-end">
              <Button colorScheme="danger" onClick={onClose}>
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
      textDecoration="none"
      _hover={{
        textDecoration: "none",
        bgColor: "primary.600",
      }}
      {...props}
    />
  )
}
