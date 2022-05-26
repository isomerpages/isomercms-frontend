import { CloseButton, Box } from "@chakra-ui/react"
import { Button, Searchbar } from "@opengovsg/design-system-react"
import { FolderCard } from "components/FolderCard"
import { BreadcrumbItem } from "components/folders/Breadcrumb"
import { LoadingButton } from "components/LoadingButton"
import MediaCard from "components/media/MediaCard"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { Link, useRouteMatch } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { deslugifyDirectory, getMediaDirectoryName } from "utils"

const MediasSelectModal = ({
  onProceed,
  onClose,
  onMediaSelect,
  onUpload,
  mediasData,
  queryParams,
  setQueryParams,
}) => {
  const {
    params: { siteName },
  } = useRouteMatch()

  const { mediaRoom } = queryParams

  const [filteredMedias, setFilteredMedias] = useState([])
  const [filteredDirectories, setFilteredDirectories] = useState([])

  const { watch, handleSubmit } = useFormContext()

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const searchChangeHandler = (value) => {
    const filterMediaByFileName = (medias, filterTerm) =>
      medias.filter((media) =>
        media.name.toLowerCase().includes(filterTerm.toLowerCase())
      )

    const filteredMediaData = filterMediaByFileName(
      mediasData.filter((medias) => medias.type === "file"),
      value
    )
    const filteredDirectoriesData = filterMediaByFileName(
      mediasData.filter((medias) => medias.type === "dir"),
      value
    )
    setFilteredMedias(filteredMediaData)
    setFilteredDirectories(filteredDirectoriesData)
  }

  useEffect(() => {
    if (mediasData) {
      setFilteredMedias(mediasData.filter((medias) => medias.type === "file"))
      setFilteredDirectories(
        mediasData.filter((medias) => medias.type === "dir")
      )
    }
  }, [mediasData])

  return (
    <div className={elementStyles.overlay}>
      <div className={mediaStyles.mediaModal}>
        <div className={elementStyles.modalHeader}>
          <h1 className="pl-5 mr-auto">{`Select ${mediaRoom.slice(0, -1)}`}</h1>
          {/* Search medias */}
          <Box w="33%" px="1rem">
            <Searchbar isExpanded onSearch={searchChangeHandler} />
          </Box>
          {/* Upload medias */}
          <Button onClick={onUpload} mr={2}>
            Add new
          </Button>
          <CloseButton onClick={onClose} />
        </div>
        {/* Segment divider  */}
        <div className={`${contentStyles.segmentDividerContainer}`}>
          <hr className="w-100 mt-3 mb-3" />
        </div>
        <div className={`${contentStyles.segment} mb-0`}>
          <p>
            For {mediaRoom} other than
            {mediaRoom === "images"
              ? ` 'png', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'`
              : ` 'pdf'`}
            , please use
            <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
              https://go.gov.sg
            </Link>
            to upload and link them to your Isomer site.
          </p>
        </div>
        <div className={`${contentStyles.segment} mb-3`}>
          {queryParams.mediaDirectoryName
            ? queryParams.mediaDirectoryName.split("%2F").map((dir, idx) => (
                <BreadcrumbItem
                  item={deslugifyDirectory(dir)}
                  isLast={
                    idx ===
                    queryParams.mediaDirectoryName.split("%2F").length - 1
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setQueryParams((prevState) => ({
                      ...prevState,
                      mediaDirectoryName: getMediaDirectoryName(
                        queryParams.mediaDirectoryName,
                        { end: idx + 1 }
                      ),
                    }))
                  }}
                />
              ))
            : null}
        </div>
        {!mediasData ? (
          <div className="spinner-border text-primary" role="status" />
        ) : (
          <>
            <div
              className={`${mediaStyles.mediaCards} justify-content-center pt-3 pl-2`}
            >
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {/* Directories */}
                  {filteredDirectories.map((dir) => (
                    <FolderCard
                      displayText={dir.name}
                      siteName={siteName}
                      onClick={() =>
                        setQueryParams((prevState) => {
                          return {
                            ...prevState,
                            mediaDirectoryName: `${prevState.mediaDirectoryName}%2F${dir.name}`,
                          }
                        })
                      }
                      key={dir.path}
                      hideSettings
                    />
                  ))}
                </div>
              </div>
              {/* Media */}
              {filteredMedias.map((media, mediaItemIndex) => (
                <MediaCard
                  type={mediaRoom}
                  media={media}
                  mediaItemIndex={mediaItemIndex}
                  onClick={() => onMediaSelect(media)}
                  key={media.name}
                  isSelected={media.name === watch("selectedMedia")?.name}
                  showSettings={false}
                />
              ))}
            </div>
          </>
        )}
        {/* Flexbox parent needs to be full-width - https://stackoverflow.com/a/49029061 */}
        <div className={`d-flex ${elementStyles.modalFooter}`}>
          <div className="ml-auto mt-3">
            <LoadingButton
              id="selectMedia"
              isDisabled={!watch("selectedMedia")}
              onClick={handleSubmit((data) => onProceed(data))}
            >
              Select
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediasSelectModal

MediasSelectModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
}
