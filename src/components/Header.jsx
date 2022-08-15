import {
  Flex,
  HStack,
  Box,
  Text,
  Skeleton,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import { WarningModal } from "components/WarningModal"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"

import { useLoginContext } from "contexts/LoginContext"

import useRedirectHook from "hooks/useRedirectHook"
import useSiteUrlHook from "hooks/useSiteUrlHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getBackButton } from "utils"

// axios settings
axios.defaults.withCredentials = true

const Header = ({
  siteName,
  showButton,
  title,
  isEditPage,
  shouldAllowEditPageBackNav,
  backButtonText,
  backButtonUrl,
  params,
}) => {
  const { setRedirectToLogout, setRedirectToPage } = useRedirectHook()
  const { retrieveStagingUrl } = useSiteUrlHook()
  const { userId, accountName } = useLoginContext()
  const {
    isOpen: isWarningModalOpen,
    onOpen: onWarningModalOpen,
    onClose: onWarningModalClose,
  } = useDisclosure()
  const {
    isOpen: isStagingModalOpen,
    onOpen: onStagingModalOpen,
    onClose: onStagingModalClose,
  } = useDisclosure()

  const [stagingUrl, setStagingUrl] = useState()

  const {
    backButtonLabel: backButtonTextFromParams,
    backButtonUrl: backButtonUrlFromParams,
  } = getBackButton(params)
  const { siteName: siteNameFromParams } = params

  useEffect(() => {
    let _isMounted = true

    const loadStagingUrl = async () => {
      if (siteNameFromParams || siteName) {
        const retrievedStagingUrl = await retrieveStagingUrl(
          siteNameFromParams || siteName
        )
        if (_isMounted) setStagingUrl(retrievedStagingUrl)
      }
    }

    loadStagingUrl()
    return () => {
      _isMounted = false
    }
  }, [])

  const toggleBackNav = () => {
    setRedirectToPage(backButtonUrlFromParams || backButtonUrl)
  }

  const handleBackNav = () => {
    if (isEditPage && !shouldAllowEditPageBackNav) onWarningModalOpen()
    else toggleBackNav()
  }

  const handleViewPullRequest = () => {
    if (siteNameFromParams || siteName) {
      const githubUrl = `https://github.com/isomerpages/${
        siteNameFromParams || siteName
      }/pulls`
      window.open(githubUrl, "_blank")
    }
  }

  return (
    <div className={elementStyles.header}>
      {/* Back button section */}
      <Box float="left" flexBasis="20%">
        {!showButton ? null : (
          <Button
            variant="clear"
            colorScheme="black"
            onClick={handleBackNav}
            leftIcon={<i className="bx bx-chevron-left" />}
          >
            {backButtonTextFromParams || backButtonText}
          </Button>
        )}
      </Box>
      {/* Middle section */}
      <Box m="0 auto" overflow="hidden">
        {title ? (
          <Text textStyle="h3">{title}</Text>
        ) : (
          <Box w="180px">
            <img
              src={`${process.env.PUBLIC_URL}/img/logo.svg`}
              alt="Isomer CMS logo"
            />
          </Box>
        )}
      </Box>
      {/* Right section */}
      <Flex flexBasis="20%" justifyContent="flex-end" alignItems="center">
        {siteNameFromParams || siteName ? (
          <HStack>
            <Button
              onClick={onStagingModalOpen}
              variant="outline"
              colorScheme="primary"
              isDisabled={!stagingUrl}
            >
              View Staging
            </Button>
            <Button onClick={handleViewPullRequest}>Pull Request</Button>
          </HStack>
        ) : (
          <>
            <div className={`${elementStyles.info} mr-3`}>
              Logged in as {`${userId ? "@" : ""}${accountName}`}
            </div>
            <Button onClick={setRedirectToLogout}>Log Out</Button>
          </>
        )}
      </Flex>
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
      <WarningModal
        isOpen={isStagingModalOpen}
        onClose={onStagingModalClose}
        displayTitle=""
        displayText={
          <Text textStyle="body-2">
            Your changes may take some time to be reflected. <br />
            Refresh your staging site to see if your changes have been built.
          </Text>
        }
      >
        <Button colorScheme="danger" onClick={onStagingModalClose}>
          Cancel
        </Button>
        <Skeleton isLoaded={!!stagingUrl}>
          <Button
            as={Link}
            textDecoration="none"
            _hover={{
              textDecoration: "none",
              bgColor: "primary.600",
            }}
            href={stagingUrl}
          >
            <Text color="white">Proceed to staging site</Text>
          </Button>
        </Skeleton>
      </WarningModal>
    </div>
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
