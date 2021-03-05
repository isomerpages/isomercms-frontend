import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import GenericWarningModal from './GenericWarningModal'
import useRedirectHook from '../hooks/useRedirectHook';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// Import context
const { LoginContext } = require('../contexts/LoginContext')

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Header = ({
  showButton, title, isEditPage, shouldAllowEditPageBackNav, backButtonText, backButtonUrl,
}) => {
  const { setRedirectToPage, setRedirectToLogout } = useRedirectHook()
  const setLogoutState = useContext(LoginContext)

  const [showBackNavWarningModal, setShowBackNavWarningModal] = useState(false)

  const clearCookie = async () => {
    try {
      // Call the logout endpoint in the API server to clear the browser cookie
      localStorage.removeItem(userIdKey)
      await axios.get(`${BACKEND_URL}/auth/logout`)
      setRedirectToLogout()
      setLogoutState()
    } catch (err) {
      console.error(err)
    }
  }

  const toggleBackNav = () => {
    setRedirectToPage(backButtonUrl)
  }

  const handleBackNav = () => {
    if (isEditPage && !shouldAllowEditPageBackNav) setShowBackNavWarningModal(true)
    else toggleBackNav()
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
        <div className={`${elementStyles.info} mr-3`}>
          Logged in as @{localStorage.getItem(userIdKey)}
        </div>
        <button type="button" className={`${elementStyles.blue} float-right`} onClick={clearCookie}>
          Log Out
        </button>
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
    </div>
  )
};

Header.defaultProps = {
  showButton: true,
  title: undefined,
  backButtonText: 'Back to Sites',
  backButtonUrl: '/sites',
};

Header.propTypes = {
  showButton: PropTypes.bool,
  title: PropTypes.string,
  backButtonText: PropTypes.string,
  backButtonUrl: PropTypes.string,
};

export default Header;
