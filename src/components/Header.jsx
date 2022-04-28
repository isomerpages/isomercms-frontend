import { Flex, HStack, Box, Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import GenericWarningModal from "components/GenericWarningModal"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"

import useRedirectHook from "hooks/useRedirectHook"
import useSiteUrlHook from "hooks/useSiteUrlHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getBackButton } from "utils"

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"

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

  const [showBackNavWarningModal, setShowBackNavWarningModal] = useState(false)
  const [showStagingWarningModal, setShowStagingWarningModal] = useState(false)
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
    if (isEditPage && !shouldAllowEditPageBackNav)
      setShowBackNavWarningModal(true)
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

  const handleViewStaging = () => {
    window.open(stagingUrl, "_blank")
    setShowStagingWarningModal(false)
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
              onClick={() => setShowStagingWarningModal(true)}
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
              Logged in as @{localStorage.getItem(userIdKey)}
            </div>
            <Button
              type="button"
              className={`${elementStyles.blue} float-right text-nowrap`}
              onClick={setRedirectToLogout}
            >
              Log Out
            </Button>
          </>
        )}
      </Flex>
      {showBackNavWarningModal && (
        <GenericWarningModal
          displayTitle="Warning"
          displayText="You have unsaved changes. Are you sure you want to navigate away from this page?"
          onProceed={toggleBackNav}
          onCancel={() => setShowBackNavWarningModal(false)}
          proceedText="Yes"
          cancelText="No"
        />
      )}
      {showStagingWarningModal && (
        <GenericWarningModal
          displayTitle=""
          displayText="Your changes may take some time to be reflected. <br/> Refresh your staging site to see if your changes have been built."
          displayImg="/publishModal.svg"
          displayImgAlt="View Staging Modal Image"
          onProceed={handleViewStaging}
          onCancel={() => setShowStagingWarningModal(false)}
          proceedText="Proceed to staging site"
          cancelText="Cancel"
        />
      )}
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
