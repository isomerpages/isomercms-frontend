import {
  Box,
  Flex,
  Icon,
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
import axios from "axios"
import { ButtonLink } from "components/ButtonLink"
import { NotificationMenu } from "components/Header/NotificationMenu"
import { WarningModal } from "components/WarningModal"
import PropTypes from "prop-types"
import { BiArrowBack } from "react-icons/bi"

import { useStagingUrl } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { NavImage } from "assets"
import { getBackButton } from "utils"

// axios settings
axios.defaults.withCredentials = true

const Header = ({
  showButton,
  title,
  isEditPage,
  shouldAllowEditPageBackNav,
  backButtonText,
  backButtonUrl,
  params,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setRedirectToPage } = useRedirectHook()
  const { siteName } = params
  const { data: stagingUrl, isLoading } = useStagingUrl({ siteName })
  const {
    isOpen: isWarningModalOpen,
    onOpen: onWarningModalOpen,
    onClose: onWarningModalClose,
  } = useDisclosure()

  const {
    backButtonLabel: backButtonTextFromParams,
    backButtonUrl: backButtonUrlFromParams,
  } = getBackButton(params)

  const toggleBackNav = () => {
    setRedirectToPage(backButtonUrlFromParams || backButtonUrl)
  }

  const handleBackNav = () => {
    if (isEditPage && !shouldAllowEditPageBackNav) onWarningModalOpen()
    else toggleBackNav()
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
        w="100%"
      >
        <HStack spacing="1.25rem" flex={1}>
          {!showButton ? (
            <Box w="180px">
              <img
                src={`${process.env.PUBLIC_URL}/img/logo.svg`}
                alt="Isomer CMS logo"
              />
            </Box>
          ) : (
            <>
              <IconButton
                aria-label="Back to sites"
                variant="clear"
                icon={
                  <Icon
                    as={BiArrowBack}
                    fontSize="1.25rem"
                    fill="icon.secondary"
                  />
                }
                onClick={handleBackNav}
              />
              <Text color="text.label" textStyle="body-1">
                {backButtonTextFromParams || backButtonText}
              </Text>
            </>
          )}
        </HStack>
        {/* <Spacer /> */}
        {title ? (
          <Flex minWidth="-webkit-min-content" alignItems="center">
            <Text textStyle="h3">{title}</Text>
          </Flex>
        ) : null}
        <HStack flex={1} justifyContent="flex-end">
          <NotificationMenu siteName={siteName} />
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
      <WarningModal
        isOpen={isWarningModalOpen}
        onClose={onWarningModalClose}
        displayTitle="Warning"
        displayText={
          <Text>
            You have unsaved changes. Are you sure you want to navigate away
            from this page?
          </Text>
        }
      >
        <Button colorScheme="danger" onClick={onWarningModalClose}>
          No
        </Button>
        <Button onClick={toggleBackNav}>Yes</Button>
      </WarningModal>
    </>
  )
}

Header.defaultProps = {
  siteName: undefined,
  showButton: true,
  title: undefined,
  isEditPage: false,
  shouldAllowEditPageBackNav: true,
  backButtonText: "Back to Sites",
  backButtonUrl: "/sites",
  params: {},
}

Header.propTypes = {
  siteName: PropTypes.string,
  showButton: PropTypes.bool,
  title: PropTypes.string,
  isEditPage: PropTypes.bool,
  shouldAllowEditPageBackNav: PropTypes.bool,
  backButtonText: PropTypes.string,
  backButtonUrl: PropTypes.string,
  params: PropTypes.shape({
    siteName: PropTypes.string,
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    fileName: PropTypes.string,
  }),
}

export default Header
