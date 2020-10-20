import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const Header = ({
  showButton, title, backButtonText, backButtonUrl,
}) => {
  const [shouldRedirect, setShouldRedirect] = useState(false)

  const clearCookie = async () => {
    try {
      // Call the logout endpoint in the API server to clear the browser cookie
      await axios.get(`${BACKEND_URL}/auth/logout`)
      setShouldRedirect(true)
    } catch (err) {
      console.error(err)
      setShouldRedirect(false)
    }
  }

  return (
    <div className={elementStyles.header}>
      {/* Back button section */}
      <div className={elementStyles.headerLeft}>
        { !showButton ? null : (
          <a href={backButtonUrl}>
            <button className={elementStyles.default} type="button">
              <i className="bx bx-chevron-left" />
              {backButtonText}
            </button>
          </a>
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
        <button type="button" className={elementStyles.blue} onClick={clearCookie}>
          Log Out
        </button>
      </div>
      { shouldRedirect && 
        <Redirect
          to={{
            pathname: '/'
          }}
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
