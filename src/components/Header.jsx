import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import GenericWarningModal from './GenericWarningModal'
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
  const setLogoutState = useContext(LoginContext)

  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [shouldPerformBackNav, setShouldPerformBackNav] = useState(false)
  const [showBackNavWarningModal, setShowBackNavWarningModal] = useState(false)

  const clearCookie = async () => {
    try {
      // Call the logout endpoint in the API server to clear the browser cookie
      sessionStorage.clear()
      await axios.get(`${BACKEND_URL}/auth/logout`)
      setShouldRedirect(true)
      setLogoutState()
    } catch (err) {
      console.error(err)
      setShouldRedirect(false)
    }
  }

  const toggleBackNav = () => {
    setShouldPerformBackNav(!shouldPerformBackNav)
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
        <div className={elementStyles.info}>
          Logged in as {sessionStorage.getItem(userIdKey)}
        </div>
        <button type="button" className={`${elementStyles.blue} float-right`} onClick={clearCookie}>
          Log Out
        </button>
      </div>
      { shouldPerformBackNav && 
        <Redirect
          to={{
            pathname: backButtonUrl
          }}
        />
      }
      { shouldRedirect && 
        <Redirect
          to={{
            pathname: '/',
            state: { isFromSignOutButton: true },
          }}
        />
      }
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
