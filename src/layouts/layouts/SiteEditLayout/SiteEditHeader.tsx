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
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Skeleton,
  Center,
  VStack,
} from "@chakra-ui/react"
import { Button, IconButton } from "@opengovsg/design-system-react"
import { ButtonLink } from "components/ButtonLink"
import { NotificationMenu } from "components/Header/NotificationMenu"
import { BiArrowBack, BiCheckCircle } from "react-icons/bi"
import { Link as RouterLink, useParams } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { useStagingUrl } from "hooks/settingsHooks"
import { useGetReviewRequests } from "hooks/siteDashboardHooks"

import { ReviewRequestModal } from "layouts/ReviewRequest"

import { NavImage } from "assets"

export const SiteEditHeader = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isReviewRequestModalOpen,
    onOpen: onReviewRequestModalOpen,
    onClose: onReviewRequestModalClose,
  } = useDisclosure()
  const { siteName } = useParams<{ siteName: string }>()
  const { data: stagingUrl, isLoading } = useStagingUrl({ siteName })
  const { userId } = useLoginContext()
  // NOTE: Even if we have an unknown user, we assume that it is github
  // and avoid showing new features.
  const isGithubUser = !!userId
  const {
    data: reviewRequests,
    isLoading: isReviewRequestsLoading,
  } = useGetReviewRequests(siteName)

  const openReviewRequests = reviewRequests
    ? reviewRequests.filter((request) => request.status === "OPEN")
    : []

  const shouldDisableReviewRequestButton =
    isReviewRequestsLoading || openReviewRequests.length > 0

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
            aria-label={`Back to ${
              isGithubUser ? "my sites" : "site dashboard"
            }`}
            variant="clear"
            icon={
              <Icon as={BiArrowBack} fontSize="1.25rem" fill="icon.secondary" />
            }
            as={RouterLink}
            to={isGithubUser ? "/sites" : `/sites/${siteName}/dashboard`}
          />
          <Text color="text.label" textStyle="body-1">
            {isGithubUser ? "My sites" : "Site dashboard"}
          </Text>
        </HStack>
        <Spacer />
        <HStack>
          <NotificationMenu />
          <Button
            onClick={onOpen}
            variant="outline"
            colorScheme="primary"
            isDisabled={!stagingUrl}
          >
            View Staging
          </Button>
          {userId ? (
            // Github user
            <ButtonLink
              href={`https://github.com/isomerpages/${siteName}/pulls`}
            >
              <Text color="white">Pull Request</Text>
            </ButtonLink>
          ) : (
            <Button
              id="isomer-workspace-feature-tour-step-1"
              leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
              onClick={onReviewRequestModalOpen}
              isDisabled={shouldDisableReviewRequestButton}
            >
              Request a Review
            </Button>
          )}
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
      <ReviewRequestModal
        isOpen={isReviewRequestModalOpen}
        onClose={onReviewRequestModalClose}
      />
    </>
  )
}
