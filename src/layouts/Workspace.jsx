// Import components
import { FolderCard } from "components/FolderCard"
import FolderOptionButton from "components/FolderOptionButton"
import Header from "components/Header"
import PageCard from "components/PageCard"
import Sidebar from "components/Sidebar"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Switch, useRouteMatch, useHistory } from "react-router-dom"

// Import styles

// Import utils

// Import hooks
import { useGetDirectoryHook } from "hooks/directoryHooks"
import { useGetPageHook } from "hooks/pageHooks"
import useRedirectHook from "hooks/useRedirectHook"

// Import screens
import {
  PageSettingsScreen,
  MoveScreen,
  DeleteWarningScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/RouteSelector"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

const Workspace = ({ match, location }) => {
  const { siteName } = match.params
  const [contactUsCard, setContactUsCard] = useState()

  const { setRedirectToPage } = useRedirectHook()
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: dirsData } = useGetDirectoryHook(match.params)
  const { data: pagesData } = useGetDirectoryHook({
    ...match.params,
    isUnlinked: true,
  })
  const { data: contactUsPage } = useGetPageHook({
    siteName,
    fileName: "contact-us.md",
  })

  useEffect(() => {
    if (contactUsPage)
      setContactUsCard(
        contactUsPage.content?.frontMatter?.layout ===
          CONTACT_US_TEMPLATE_LAYOUT
      )
  }, [pagesData, contactUsPage])

  return (
    <>
      <Header siteName={siteName} />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          {/* Page title */}
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>My Workspace</h1>
          </div>
          {/* Info segment */}
          <div className={contentStyles.segment}>
            <i className="bx bx-sm bx-bulb text-dark" />
            <span>
              <strong className="ml-1">Pro tip:</strong> Organise this workspace
              by moving pages into folders
            </span>
          </div>
          {/* Homepage, Nav bar and Contact Us */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              <FolderCard
                displayText="Homepage"
                settingsToggle={() => {}}
                key="homepage"
                pageType="homepage"
                siteName={siteName}
              />
              <FolderCard
                displayText="Navigation Bar"
                settingsToggle={() => {}}
                key="nav"
                pageType="nav"
                siteName={siteName}
              />
              {contactUsCard && (
                <FolderCard
                  displayText="Contact Us"
                  settingsToggle={() => {}}
                  key="contact-us"
                  pageType="contact-us"
                  siteName={siteName}
                />
              )}
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Collections title */}
          <div className={contentStyles.segment}>Folders</div>
          {!dirsData && (
            <div className={contentStyles.segment}>Loading Folders...</div>
          )}
          {dirsData && dirsData.length === 0 && (
            <div className={contentStyles.segment}>
              There are no folders in this repository.
            </div>
          )}
          {/* Folders */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {dirsData && (
                <FolderOptionButton
                  title="Create new folder"
                  option="create-sub"
                  isSubfolder={false}
                  onClick={() => setRedirectToPage(`${url}/createDirectory`)}
                />
              )}
              {dirsData && dirsData.length > 0
                ? dirsData.map((collection, collectionIdx) => (
                    <FolderCard
                      key={collection}
                      pageType="collection"
                      siteName={siteName}
                      category={collection.name}
                      itemIndex={collectionIdx}
                    />
                  ))
                : null}
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="invisible w-100 mt-3 mb-5" />
          </div>{" "}
          {/* Pages title */}
          <div className={contentStyles.segment}>Pages</div>
          {/* Info segment */}
          <div className={contentStyles.segment}>
            <i className="bx bx-sm bx-info-circle text-dark" />
            <span>
              <strong className="ml-1">Note:</strong> The pages here do not
              belong to any folders.
            </span>
          </div>
          {/* Pages */}
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
                    .filter((page) => page.name !== "contact-us.md")
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
          component={MoveScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/deleteDirectory/:collectionName`]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:collectionName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </>
  )
}

export default Workspace

Workspace.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
