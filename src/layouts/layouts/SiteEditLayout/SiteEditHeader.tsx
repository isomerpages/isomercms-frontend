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
import { BiArrowBack, BiCheckCircle } from "react-icons/bi"
import { useParams, useHistory } from "react-router-dom"

import { ButtonLink } from "components/ButtonLink"
import { NotificationMenu } from "components/Header/NotificationMenu"
import { WarningModal } from "components/WarningModal"

import { useDirtyFieldContext } from "contexts/DirtyFieldContext"
import { useLoginContext } from "contexts/LoginContext"

import { useStagingUrl } from "hooks/settingsHooks"

import { ReviewRequestModal } from "layouts/ReviewRequest"

import { doesOpenReviewRequestExist } from "utils/reviewRequests"

import { NavImage } from "assets"

export const SiteEditHeader = (): JSX.Element => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isDirtyWarningModalOpen,
    onOpen: onDirtyWarningModalOpen,
    onClose: onDirtyWarningModalClose,
  } = useDisclosure()
  const { isDirty } = useDirtyFieldContext()
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
  const history = useHistory()

  const hasOpenReviewRequest = doesOpenReviewRequestExist(siteName)

  const onBackButtonClick = () => {
    const redirPath = isGithubUser ? "/sites" : `/sites/${siteName}/dashboard`
    history.push(redirPath)
  }

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
            // NOTE: Conditionally do this because we need to show the modal
            // when there are dirty fields, which could result in user
            // not navigating away.
            onClick={() =>
              isDirty ? onDirtyWarningModalOpen() : onBackButtonClick()
            }
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
            Open Staging
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
              isDisabled={hasOpenReviewRequest}
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
      <DirtyWarningModal
        isOpen={isDirtyWarningModalOpen}
        onClose={onDirtyWarningModalClose}
        onClick={onBackButtonClick}
      />
    </>
  )
}

interface DirtyWarningModalProps {
  isOpen: boolean
  onClose: () => void
  onClick: () => void
}

const DirtyWarningModal = ({
  isOpen,
  onClose,
  onClick,
}: DirtyWarningModalProps): JSX.Element => {
  return (
    <WarningModal
      isOpen={isOpen}
      onClose={onClose}
      displayTitle="Warning"
      displayText={
        <Text>
          You have unsaved changes. Are you sure you want to navigate away from
          this page?
        </Text>
      }
    >
      <Button colorScheme="critical" onClick={onClose}>
        No
      </Button>
      <Button onClick={onClick}>Yes</Button>
    </WarningModal>
  )
}
