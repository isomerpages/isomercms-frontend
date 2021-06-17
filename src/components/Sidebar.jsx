import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import PropTypes from "prop-types"
import styles from "../styles/isomer-cms/pages/Admin.module.scss"
import useRedirectHook from "../hooks/useRedirectHook"
import useSiteUrlHook from "../hooks/useSiteUrlHook"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import { getLastUpdated } from "../api"
import { LAST_UPDATED_KEY } from "../constants"
import { errorToast } from "../utils/toasts"

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"
const sidebarContentPathDict = [
  {
    pathname: "workspace",
    title: "My Workspace",
  },
  {
    pathname: "resources",
    title: "Resources",
  },
  {
    pathname: "images",
    title: "Images",
  },
  {
    pathname: "documents",
    title: "Files",
  },
]
const sidebarSettingsPathDict = [
  {
    pathname: "settings",
    title: "Settings",
  },
  {
    pathname: "guide",
    title: "Guide",
  },
  {
    pathname: "help",
    title: "Help",
  },
]
const sidebarUserDict = [
  {
    pathname: "logout",
    title: "Logout",
  },
  {
    pathname: "user",
    title: "User",
  },
]
const typeInfoDict = {
  Help: {
    url: "https://go.gov.sg/isomer-cms-help",
    icon: "bx bx-buoy",
  },
  Guide: {
    url: "https://go.gov.sg/isomercms-guide/",
    icon: "bx bx-book",
  },
  Settings: {
    icon: "bx bx-cog",
  },
  Logout: {
    icon: "bx bx-log-out-circle",
  },
}

const Sidebar = ({ siteName, currPath }) => {
  const { setRedirectToLogout } = useRedirectHook()
  const [lastUpdated, setLastUpdated] = useState("Updated")
  const [siteUrl, setSiteUrl] = useState()
  const { retrieveSiteUrl } = useSiteUrlHook()

  const { data: lastUpdatedResp } = useQuery(
    [LAST_UPDATED_KEY, siteName],
    () => getLastUpdated(siteName),
    {
      retry: false,
      onError: (err) => {
        console.log(err)
        errorToast()
      },
    }
  )

  useEffect(() => {
    let _isMounted = true

    const loadSiteUrl = async () => {
      if (siteName) {
        const retrievedSiteUrl = await retrieveSiteUrl(siteName)
        if (_isMounted) setSiteUrl(retrievedSiteUrl)
      }
    }

    loadSiteUrl()
    return () => {
      _isMounted = false
    }
  }, [siteName])

  useEffect(() => {
    if (lastUpdatedResp) setLastUpdated(lastUpdatedResp.lastUpdated)
  }, [lastUpdatedResp])

  // Highlight workspace sidebar tab when in collections layout
  const convertCollectionsPathToWorkspace = (currPath, siteName) => {
    const currPathArr = currPath.split("/")

    // example path: /sites/demo-v2/folder/left-nav-one
    if (currPathArr.length > 3 && currPathArr[3] === "folder")
      return `/sites/${siteName}/workspace`

    return currPathArr.slice(0, 4).join("/")
  }

  const generateContent = (title, siteName, pathname, isActive) => {
    switch (title) {
      case "Help":
      case "Guide":
        return (
          <a
            className={`px-4 py-3 h-100 w-100 font-weight-bold text-dark ${elementStyles.noExtLink}`}
            href={typeInfoDict[title].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
            <div className="float-right">
              <i className={`text-dark ${typeInfoDict[title].icon}`} />
            </div>
          </a>
        )
      case "Logout":
        return (
          <a
            className="px-4 py-3 h-100 w-100 font-weight-bold"
            onClick={setRedirectToLogout}
          >
            Logout
            <div className="float-right">
              <i className={`${typeInfoDict[title].icon}`} />
            </div>
          </a>
        )
      case "User":
        return (
          <div className={`px-4 py-3 h-100 w-100 ${elementStyles.info}`}>
            Logged in as
            <br />@{localStorage.getItem(userIdKey)}
          </div>
        )
      default:
        return (
          <Link
            className={`px-4 py-3 h-100 w-100 font-weight-bold ${
              isActive ? "" : "text-dark"
            }`}
            to={`/sites/${siteName}/${pathname}`}
          >
            {title}
            {title in typeInfoDict && "icon" in typeInfoDict[title] && (
              <div className="float-right">
                <i
                  className={`${isActive ? "" : "text-dark"} ${
                    typeInfoDict[title].icon
                  }`}
                />
              </div>
            )}
          </Link>
        )
    }
  }

  const generateTab = (title, siteName, pathname) => {
    const isActive =
      `/sites/${siteName}/${pathname}` ===
      convertCollectionsPathToWorkspace(currPath, siteName)
    return (
      <li
        className={`d-flex p-0 ${isActive ? styles.active : ""} ${
          pathname === "user" ? styles.noHover : ""
        }`}
        key={title}
      >
        {generateContent(title, siteName, pathname, isActive)}
      </li>
    )
  }

  return (
    <div className={styles.adminSidebar}>
      <div>
        <div className={styles.siteIntro}>
          <div className={`font-weight-bold ${styles.siteName}`}>
            {siteName}
          </div>
          <div className={styles.siteInfo}>{siteUrl}</div>
          <div className={styles.siteInfo}>{lastUpdated}</div>
        </div>
        <div className={styles.sidebarNavigation}>
          <ul>
            {sidebarContentPathDict.map(({ pathname, title }) =>
              generateTab(title, siteName, pathname)
            )}
          </ul>
        </div>
      </div>
      <div className={styles.sidebarNavigation}>
        <hr className="m-0" />
        <ul>
          {sidebarSettingsPathDict.map(({ pathname, title }) =>
            generateTab(title, siteName, pathname)
          )}
        </ul>
      </div>
      <div className={styles.sidebarNavigation}>
        <ul>
          {sidebarUserDict.map(({ pathname, title }) =>
            generateTab(title, siteName, pathname)
          )}
        </ul>
      </div>
    </div>
  )
}

export default Sidebar

Sidebar.propTypes = {
  siteName: PropTypes.string.isRequired,
  currPath: PropTypes.string.isRequired,
}
