import React, { useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/isomer-cms/pages/Admin.module.scss';
import useRedirectHook from '../hooks/useRedirectHook';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// Import context
const { LoginContext } = require('../contexts/LoginContext')

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const sidebarPathDict = [
  {
    pathname: 'workspace',
    title: 'My Workspace',
  },
  {
    pathname: 'resources',
    title: 'Resources',
  },
  {
    pathname: 'images',
    title: 'Images',
  },
  {
    pathname: 'files',
    title: 'Files',
  },
  {
    pathname: 'settings',
    title: 'Settings',
  },
  {
    pathname: 'help',
    title: 'Help',
  }
];

const Sidebar = ({ siteName, currPath }) => {
  const { setRedirectToLogout } = useRedirectHook()
  const setLogoutState = useContext(LoginContext)

  // Highlight workspace sidebar tab when in collections layout
  const convertCollectionsPathToWorkspace = (currPath, siteName) => {
    const currPathArr = currPath.split('/')

    // example path: /sites/demo-v2/folder/left-nav-one
    if (currPathArr[3] === 'folder') return `/sites/${siteName}/workspace`
    
    // example path: /sites/demo-v2/resources/news
    if (currPathArr.length === 5 && currPathArr[3] === 'resources') return `/sites/${siteName}/resources`
    
    return currPath
  }

  const generateLink = (title, siteName, pathname) => {
    if (title === 'Help') {
      return (
        <a
          className="px-4 py-4 h-100 w-100"
          href="https://go.gov.sg/isomer-cms-help"
          target="_blank"
        >
          {title}
        </a>
      )
    }

    return (
      <Link
        className="px-4 py-4 h-100 w-100"
        to={`/sites/${siteName}/${pathname}`}
      >
        {title}
      </Link>
    )
  }

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

  return (
    <div className={styles.adminSidebar}>
      <div className={styles.siteIntro}>
        <div className={styles.siteName}>{siteName}</div>
        <div className={styles.siteDate}>Updated 2 days ago</div>
      </div>
      <div className={styles.sidebarNavigation}>
        <ul>
          {sidebarPathDict.map(({ pathname, title }) => (
            <li
              className={`d-flex p-0 ${`/sites/${siteName}/${pathname}` === convertCollectionsPathToWorkspace(currPath, siteName) ? styles.active : null}`}
              key={title}
            >
              {generateLink(title, siteName, pathname)}
            </li>
          ))}
          <li
            className={`d-flex p-0`}
            key={'logout'}
            onClick={clearCookie}
          >
            <div
              className="px-4 py-4 h-100 w-100"
            >
              Logout
            </div>
          </li>
          <li
            className={`d-flex p-0`}
            key={'user'}
          >
            <div
              className={`px-4 py-4 h-100 w-100 ${elementStyles.info}`}
            >
              Logged in as 
              <br/>
              @{localStorage.getItem(userIdKey)}
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
};

export default Sidebar;

Sidebar.propTypes = {
  siteName: PropTypes.string.isRequired,
  currPath: PropTypes.string.isRequired,
};
