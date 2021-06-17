import React, { useState, useEffect } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"

// Import components
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import CollectionPagesSection from "../components/CollectionPagesSection"

// Import styles
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../styles/isomer-cms/pages/Content.module.scss"

// Import utils
import { retrieveResourceFileMetadata, deslugifyDirectory } from "../utils.js"
import { errorToast } from "../utils/toasts"
import { getResourcePages } from "../api"
import { RESOURCE_CATEGORY_CONTENT_KEY } from "../constants"
import useRedirectHook from "../hooks/useRedirectHook"

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

// Determine whether the back button in the header should point to Workspace or Resources
const getBackButtonInfo = (pathname) => {
  const pathnameArr = pathname.split("/")
  if (pathnameArr[3] === "collections")
    return {
      backButtonLabel: "My Workspace",
      backButtonUrl: "workspace",
    }
  if (pathnameArr[3] === "resources")
    return {
      backButtonLabel: "Resources",
      backButtonUrl: "resources",
    }
}

const CategoryPages = ({ match, location, isResource }) => {
  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(
    location.pathname
  )
  const { collectionName, siteName } = match.params
  const { setRedirectToPage } = useRedirectHook()

  const [categoryPages, setCategoryPages] = useState()

  const { data: resourcePagesResp } = useQuery(
    [RESOURCE_CATEGORY_CONTENT_KEY, siteName, collectionName, isResource],
    () => getResourcePages(siteName, collectionName),
    {
      retry: false,
      onError: (err) => {
        console.log(err)
        if (err.response && err.response.status === 404 && isResource) {
          setRedirectToPage(`/sites/${siteName}/resources`)
        } else {
          errorToast()
        }
      },
    }
  )

  useEffect(() => {
    let _isMounted = true
    const fetchData = async () => {
      if (isResource) {
        if (!resourcePagesResp) return
        const { resourcePages } = resourcePagesResp

        if (resourcePages.length > 0) {
          const retrievedResourcePages = resourcePages.map((resourcePage) => {
            const { title, type, date } = retrieveResourceFileMetadata(
              resourcePage.fileName
            )
            return {
              title,
              type,
              date,
              fileName: resourcePage.fileName,
            }
          })
          if (_isMounted) setCategoryPages(retrievedResourcePages)
        } else if (_isMounted) setCategoryPages([])
      } else {
        const collectionsResp = await axios.get(
          `${BACKEND_URL}/sites/${siteName}/collections/${collectionName}`
        )
        if (_isMounted) setCategoryPages(collectionsResp.data?.collectionPages)
      }
    }
    fetchData()
    return () => {
      _isMounted = false
    }
  }, [resourcePagesResp])

  return (
    <>
      <Header
        siteName={siteName}
        backButtonText={`Back to ${backButtonLabel}`}
        backButtonUrl={`/sites/${siteName}/${backButtonUrl}`}
      />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          {/* Collection title */}
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>
              {deslugifyDirectory(collectionName)}
            </h1>
          </div>
          <div className={contentStyles.segment}>
            <span>
              <Link to={`/sites/${siteName}/resources`}>
                <strong>Resources</strong>
              </Link>
              &nbsp;{">"}
              {collectionName ? (
                <span>
                  <strong className="ml-1">
                    &nbsp;
                    {deslugifyDirectory(collectionName)}
                  </strong>
                </span>
              ) : null}
            </span>
          </div>
          {/* Collection pages */}
          <CollectionPagesSection
            collectionName={collectionName}
            pages={categoryPages}
            siteName={siteName}
            isResource={isResource}
          />
        </div>
        {/* main section ends here */}
      </div>
    </>
  )
}

export default CategoryPages

CategoryPages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
