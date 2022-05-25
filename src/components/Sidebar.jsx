import { Flex, Button, Link as ChakraLink, Icon } from "@chakra-ui/react"
import axios from "axios"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"

import { LAST_UPDATED_KEY } from "constants/constants"

import { useGetResourceRoomNameHook } from "hooks/settingsHooks/useGetResourceRoomName"
import useRedirectHook from "hooks/useRedirectHook"
import useSiteUrlHook from "hooks/useSiteUrlHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import styles from "styles/isomer-cms/pages/Admin.module.scss"

import { useErrorToast } from "utils/toasts"

import { getLastUpdated } from "api"
import { BxBook, BxBuoy, BxLogOutCircle } from "assets/icons"

import { BxCog } from "../assets/icons/BxCog"

// axios settings
axios.defaults.withCredentials = true

// constants
const userIdKey = "userId"
const sidebarContentPathDict = (resourceRoomName) => [
  {
    pathname: "workspace",
    title: "My Workspace",
  },
  {
    pathname: `resourceRoom${resourceRoomName ? `/${resourceRoomName}` : ""}`,
    title: "Resources",
  },
  {
    pathname: "media/images/mediaDirectory/images",
    title: "Images",
  },
  {
    pathname: "media/files/mediaDirectory/files",
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
    icon: <Icon as={BxBuoy} />,
  },
  Guide: {
    url: "https://go.gov.sg/isomercms-guide/",
    icon: <Icon as={BxBook} />,
  },
  Settings: {
    icon: <Icon as={BxCog} />,
  },
}

const Sidebar = ({ siteName, currPath }) => {
  const { setRedirectToLogout } = useRedirectHook()
  const [lastUpdated, setLastUpdated] = useState("Updated")
  const [siteUrl, setSiteUrl] = useState()
  const { retrieveSiteUrl } = useSiteUrlHook()
  const { data: resourceRoomName } = useGetResourceRoomNameHook({ siteName })
  const errorToast = useErrorToast()

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
  const convertCollectionsPathToWorkspace = () => {
    const currPathArr = currPath.split("/")

    if (currPathArr[3] === "resourceRoom" || currPathArr[3] === "media")
      return currPathArr.slice(0, 5).join("/")

    // example path: /sites/demo-v2/folder/left-nav-one
    if (currPathArr.length > 3 && currPathArr[3] === "folders")
      return `/sites/${siteName}/workspace`

    return currPathArr.slice(0, 4).join("/")
  }

  const generateContent = (title, pathname) => {
    switch (title) {
      case "Help":
      case "Guide":
        return (
          <Button
            href={typeInfoDict[title].url}
            as={ChakraLink}
            variant="clear"
            isFullWidth
            fontWeight="bold"
            paddingInline={6}
            paddingBlock={4}
            textDecorationLine="none"
            className="text-dark"
          >
            <Flex w="100%" justifyContent="space-between" alignItems="center">
              {title}
              {typeInfoDict[title].icon}
            </Flex>
          </Button>
        )
      case "Logout":
        return (
          <Button
            w="100%"
            variant="clear"
            fontWeight="bold"
            onClick={setRedirectToLogout}
            px={6}
          >
            <Flex w="100%" justifyContent="space-between" alignItems="center">
              Logout
              <Icon as={BxLogOutCircle} />
            </Flex>
          </Button>
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
          <Button
            as={Link}
            variant="clear"
            isFullWidth
            fontWeight="bold"
            paddingInline={6}
            paddingBlock={4}
            className="text-dark"
            to={`/sites/${siteName}/${pathname}`}
          >
            <Flex w="100%" justifyContent="space-between" alignItems="center">
              {title}
              {title in typeInfoDict &&
                "icon" in typeInfoDict[title] &&
                typeInfoDict[title].icon}
            </Flex>
          </Button>
        )
    }
  }

  const generateTab = (title, pathname) => {
    const isActive =
      `/sites/${siteName}/${pathname}` === convertCollectionsPathToWorkspace()
    return (
      <li
        className={`d-flex p-1 ${isActive ? styles.active : ""} ${
          pathname === "user" ? styles.noHover : ""
        }`}
        key={title}
      >
        {generateContent(title, pathname, isActive)}
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
            {sidebarContentPathDict(
              resourceRoomName
            ).map(({ pathname, title }) => generateTab(title, pathname))}
          </ul>
        </div>
      </div>
      <div className={styles.sidebarNavigation}>
        <hr className="m-0" />
        <ul>
          {sidebarSettingsPathDict.map(({ pathname, title }) =>
            generateTab(title, pathname)
          )}
        </ul>
      </div>
      <div className={styles.sidebarNavigation}>
        <ul>
          {sidebarUserDict.map(({ pathname, title }) =>
            generateTab(title, pathname)
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
