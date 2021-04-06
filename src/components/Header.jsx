import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import GenericWarningModal from './GenericWarningModal'
import useRedirectHook from '../hooks/useRedirectHook';
import useSiteUrlHook from '../hooks/useSiteUrlHook';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"

const Header = ({
  siteName, showButton, title, isEditPage, shouldAllowEditPageBackNav, backButtonText, backButtonUrl,
}) => {
  const { setRedirectToLogout, setRedirectToPage } = useRedirectHook()
  const { retrieveStagingUrl } = useSiteUrlHook()

  const [showBackNavWarningModal, setShowBackNavWarningModal] = useState(false)
  const [showStagingWarningModal, setShowStagingWarningModal] = useState(false)
  const [stagingUrl, setStagingUrl] = useState()

  useEffect(() => {
    let _isMounted = true

    const loadStagingUrl = async () => {
      if (siteName) {
        const retrievedStagingUrl = await retrieveStagingUrl(siteName)
        if (_isMounted) setStagingUrl(retrievedStagingUrl)
      }
    }

    loadStagingUrl()
    return () => {
      _isMounted = false
    }
  }, [])

  const toggleBackNav = () => {
    setRedirectToPage(backButtonUrl)
  }

  const handleBackNav = () => {
    if (isEditPage && !shouldAllowEditPageBackNav) setShowBackNavWarningModal(true)
    else toggleBackNav()
  }

  const handleViewPullRequest = () => {
    const githubUrl = `https://github.com/isomerpages/${siteName}/pulls`
    window.open(githubUrl, '_blank')
  }

  const handleViewStaging = () => {
    window.open(stagingUrl, '_blank')
    setShowStagingWarningModal(false)
  }

  return (
    <div className={elementStyles.header}>
      {/* Back button section */}
      <div className={elementStyles.headerLeft}>
        { !showButton ? null : (
          <div>
            <button className={elementStyles.default} onClick={handleBackNav} type="button">
              <i className="bx bx-chevron-left" />
              {backButtonText}
            </button>
          </div>
        )}
      </div>
      {/* Middle section */}
      <div className={elementStyles.headerCenter}>
        { title
          ? <h1>{title}</h1>
          : (
            <div className={elementStyles.logo}>
              <img src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Isomer CMS logo" />
            </div>
          )}
      </div>
      {/* Right section */}
      <div className={elementStyles.headerRight}>
        { siteName ?
          <>
            <button type="button" className={`${elementStyles.green} float-right text-nowrap`} onClick={handleViewPullRequest}>
              Pull Request
            </button>
            <button type="button" className={`${elementStyles.blue} float-right text-nowrap`} onClick={() => setShowStagingWarningModal(true)}>
              View Staging
            </button>
          </>
          :
          <>
            <div className={`${elementStyles.info} mr-3`}>
              Logged in as @{localStorage.getItem(userIdKey)}
            </div>
            <button type="button" className={`${elementStyles.blue} float-right text-nowrap`} onClick={setRedirectToLogout}>
              Log Out
            </button>
          </>
        }
      </div>
      {
        showBackNavWarningModal &&
        <GenericWarningModal
          displayTitle="Warning"
          displayText="You have unsaved changes. Are you sure you want to navigate away from this page?"
          onProceed={toggleBackNav}
          onCancel={() => setShowBackNavWarningModal(false)}
          proceedText="Yes"
          cancelText="No"
        />
      }
      {
        showStagingWarningModal &&
        <GenericWarningModal
          displayTitle=""
          displayText="Your changes may take some time to be reflected. <br/> Refresh your page to see if your changes have been built."
          displayImg="/publishModal.svg"
          displayImgAlt="View Staging Modal Image"
          onProceed={handleViewStaging}
          onCancel={() => setShowStagingWarningModal(false)}
          proceedText="Proceed to staging site"
          cancelText="Cancel"
        />
      }
    </div>
  )
};

Header.defaultProps = {
  siteName: undefined,
  showButton: true,
  title: undefined,
  isEditPage: false,
  shouldAllowEditPageBackNav: true,
  backButtonText: 'Back to Sites',
  backButtonUrl: '/sites',
};

Header.propTypes = {
  siteName: PropTypes.string,
  showButton: PropTypes.bool,
  title: PropTypes.string,
  isEditPage: PropTypes.bool,
  shouldAllowEditPageBackNav: PropTypes.bool,
  backButtonText: PropTypes.string,
  backButtonUrl: PropTypes.string,
};

export default Header;
