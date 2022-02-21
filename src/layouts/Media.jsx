import { FolderCard } from "components/FolderCard"
import FolderOptionButton from "components/FolderOptionButton"
import { Breadcrumb } from "components/folders/Breadcrumb"
import Header from "components/Header"
import MediaCard from "components/media/MediaCard"
import Sidebar from "components/Sidebar"
import PropTypes from "prop-types"
import { ReactQueryDevtools } from "react-query/devtools"
import { Link, Switch, useRouteMatch, useHistory } from "react-router-dom"

import { useGetDirectoryHook } from "hooks/directoryHooks/useGetDirectoryHook"
import useRedirectHook from "hooks/useRedirectHook"

import { DeleteWarningScreen } from "layouts/screens/DeleteWarningScreen"
import { DirectoryCreationScreen } from "layouts/screens/DirectoryCreationScreen"
import { DirectorySettingsScreen } from "layouts/screens/DirectorySettingsScreen"
import { MediaCreationScreen } from "layouts/screens/MediaCreationScreen"
import { MediaSettingsScreen } from "layouts/screens/MediaSettingsScreen"
import { MoveScreen } from "layouts/screens/MoveScreen"

import { ProtectedRouteWithProps } from "routing/RouteSelector"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

const Media = ({ match, location }) => {
  const { params, decodedParams } = match
  const history = useHistory()
  const { path, url } = useRouteMatch()
  const { siteName, mediaRoom: mediaType, mediaDirectoryName } = match.params
  const { setRedirectToPage } = useRedirectHook()

  const { data: mediasData } = useGetDirectoryHook(params)

  return (
    <>
      <Header params={decodedParams} />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>
              {mediaType[0].toUpperCase() + mediaType.substring(1)}
            </h1>
          </div>
          {/* Info segment */}
          <div className={contentStyles.segment}>
            <span>
              <i className="bx bx-sm bx-info-circle text-dark" />
              <strong className="ml-1">Note:</strong> Upload {mediaType} here to
              link to them in pages and resources. The maximum{" "}
              {mediaType.slice(0, -1)} size allowed is 5MB.
              <br />
              <strong className="ml-1">
                For {mediaType} other than
                {mediaType === "images"
                  ? ` 'png', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'`
                  : ` 'pdf'`}
                , please use
                <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
                  {" "}
                  https://go.gov.sg{" "}
                </Link>{" "}
                to upload and link them to your Isomer site.
              </strong>
            </span>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Breadcrumb */}
          <div className={contentStyles.segment}>
            <Breadcrumb params={decodedParams} isLink />
          </div>
          {/* Creation buttons */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {/* Upload Media */}
              <FolderOptionButton
                title={`Upload new ${mediaType.slice(0, -1)}`}
                option={`upload-${mediaType.slice(0, -1)}`}
                onClick={() => setRedirectToPage(`${url}/createMedia`)}
              />
              <FolderOptionButton
                title={`Create new ${
                  mediaType === "images" ? "album" : "directory"
                }`}
                option="create-sub"
                isSubfolder={false}
                onClick={() => setRedirectToPage(`${url}/createDirectory`)}
              />
            </div>
          </div>
          {/* Directories title segment */}
          <div className={contentStyles.segment}>
            <span>{mediaType === "images" ? "Albums" : "Directories"}</span>
          </div>
          {/* Media directories */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {mediasData &&
                mediasData
                  .filter((media) => media.type === "dir")
                  .map((directory, idx) => (
                    <FolderCard
                      displayText={directory.name}
                      key={directory.name}
                      pageType={mediaType}
                      siteName={siteName}
                      itemIndex={idx}
                      category={`${mediaDirectoryName}%2F${encodeURIComponent(
                        directory.name
                      )}`}
                    />
                  ))}
            </div>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="invisible w-100 mt-3 mb-5" />
          </div>
          {/* Ungrouped Media title segment */}
          <div className={contentStyles.segment}>
            <span>Ungrouped {mediaType}</span>
          </div>
          {/* Media segment */}
          <div className={contentStyles.contentContainerBars}>
            <div className={contentStyles.boxesContainer}>
              <div className={mediaStyles.mediaCards}>
                {/* Media */}
                {mediasData ? (
                  mediasData
                    .filter((media) => media.type === "file")
                    .map((media, mediaItemIndex) => (
                      <MediaCard
                        type={mediaType}
                        media={media}
                        mediaItemIndex={mediaItemIndex}
                        key={media.name}
                      />
                    ))
                ) : (
                  <div className="spinner-border text-primary" role="status" />
                )}
              </div>
            </div>
          </div>
          {/* End of media cards */}
        </div>
        {/* main section ends here */}
      </div>
      {process.env.REACT_APP_ENV === "LOCAL_DEV" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createMedia`]}
          component={MediaCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editMediaSettings/:fileName`]}
          component={MediaSettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[
            `${path}/deleteMedia/:fileName`,
            `${path}/deleteDirectory/:mediaDirectoryName`,
          ]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:mediaDirectoryName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/moveMedia/:fileName`]}
          component={MoveScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </>
  )
}

export default Media

Media.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  mediaType: PropTypes.string.isRequired,
}
