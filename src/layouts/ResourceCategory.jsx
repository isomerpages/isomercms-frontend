import Header from "components/Header"
import PageCard from "components/PageCard"
import Sidebar from "components/Sidebar"
import PropTypes from "prop-types"
import React from "react"
import { Link, Switch, useRouteMatch, useHistory } from "react-router-dom"

import { useGetDirectoryHook } from "hooks/directoryHooks"
import useRedirectHook from "hooks/useRedirectHook"

// Import screens
import {
  PageSettingsScreen,
  PageMoveScreen,
  DeleteWarningScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/RouteSelector"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

// Import utils
import { deslugifyDirectory } from "utils"

const ResourceCategory = ({ match, location }) => {
  const {
    resourceRoomName,
    resourceCategoryName: collectionName,
    siteName,
  } = match.params
  const { setRedirectToPage } = useRedirectHook()
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: pagesData } = useGetDirectoryHook({
    ...match.params,
  })

  return (
    <>
      <Header
        siteName={siteName}
        backButtonText="Back to Resources"
        backButtonUrl={`/sites/${siteName}/resourceRoom/${resourceRoomName}`}
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
              <Link to={`/sites/${siteName}/resourceRoom/${resourceRoomName}`}>
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
          <div className={contentStyles.contentContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              <button
                type="button"
                id="settings-NEW"
                onClick={() => setRedirectToPage(`${url}/createPage`)}
                className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
              >
                <i
                  id="settingsIcon-NEW"
                  className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`}
                />
                <h2 id="settingsText-NEW">Add a new page</h2>
              </button>
              {pagesData
                ? pagesData
                    .filter((page) => page.name != "contact-us.md")
                    .map((page, pageIdx) => (
                      <PageCard itemIndex={pageIdx} item={page} />
                    ))
                : /* Display loader if pages have not been retrieved from API call */
                  "Loading Pages..."}
            </div>
          </div>
        </div>
        {/* main section ends here */}
      </div>
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
          component={PageSettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/deletePage/:fileName`]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/movePage/:fileName`]}
          component={PageMoveScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </>
  )
}

export default ResourceCategory

ResourceCategory.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
