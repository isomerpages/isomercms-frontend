import LoadingButton from "components/LoadingButton"
import MediaCard from "components/media/MediaCard"
import { MediaSearchBar } from "components/media/MediaSearchBar"
import _ from "lodash"
import PropTypes from "prop-types"
import React, { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"

import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY } from "constants/constants"

import useRedirectHook from "hooks/useRedirectHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { errorToast } from "utils/toasts"

import { getMedia } from "api"
import { DEFAULT_RETRY_MSG, deslugifyDirectory } from "utils"

const MediaModal = ({
  siteName,
  onClose,
  onMediaSelect,
  type,
  readFileToStageUpload,
  setUploadPath,
}) => {
  const [medias, setMedias] = useState([])
  const [filteredMedias, setFilteredMedias] = useState([])
  const [directories, setDirectories] = useState([])
  const [filteredDirectories, setFilteredDirectories] = useState([])
  const [selectedFile, setSelectedFile] = useState()
  const [customPath, setCustomPath] = useState("")
  const [mediaSearchTerm, setMediaSearchTerm] = useState("")
  const { setRedirectToNotFound } = useRedirectHook()

  const { data: mediaData } = useQuery(
    type === "images"
      ? [IMAGE_CONTENTS_KEY, customPath]
      : [DOCUMENT_CONTENTS_KEY, customPath],
    () => getMedia(siteName, customPath || "", type),
    {
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(
            `There was a problem trying to load your ${type}. ${DEFAULT_RETRY_MSG}`
          )
        }
      },
    }
  )

  useEffect(() => {
    let _isMounted = true

    if (mediaData) {
      const { respMedia, respDirectories } = mediaData

      const medias = []
      respMedia.forEach((mediaFile) => {
        if (mediaFile.fileName !== `.keep`) medias.push(mediaFile)
      })

      const directories = []
      respDirectories.forEach((mediaDir) =>
        directories.push({
          ...mediaDir,
          fileName: deslugifyDirectory(mediaDir.fileName),
        })
      )

      if (_isMounted) {
        setMedias(medias)
        setFilteredMedias(medias)
        setDirectories(directories)
        setFilteredDirectories(directories)
      }
    }

    return () => {
      _isMounted = false
    }
  }, [mediaData])

  const filterMediaByFileName = (medias, filterTerm) => {
    const filteredMedias = medias.filter((media) => {
      if (media.fileName.toLowerCase().includes(filterTerm.toLowerCase()))
        return true
      return false
    })
    return filteredMedias
  }

  const searchChangeHandler = (event) => {
    const {
      target: { value },
    } = event
    const filteredMedias = filterMediaByFileName(medias, value)
    const filteredDirectories = filterMediaByFileName(directories, value)
    setMediaSearchTerm(value)
    setFilteredMedias(filteredMedias)
    setFilteredDirectories(filteredDirectories)
  }

  const BreadcrumbButton = ({ name, idx }) => {
    const newCustomPath = customPath
      .split("/")
      .slice(0, idx + 1)
      .join("/") // retrieves paths elements up to (excluding) element idx
    return (
      <button
        className={`${elementStyles.breadcrumbText} ml-1`}
        type="button"
        onClick={() => setCustomPath(newCustomPath)}
      >
        {name}
      </button>
    )
  }

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={mediaStyles.mediaModal}>
          <div className={elementStyles.modalHeader}>
            <h1 className="pl-5 mr-auto">{`Select ${type.slice(0, -1)}`}</h1>
            {/* Search medias */}
            <MediaSearchBar
              value={mediaSearchTerm}
              onSearchChange={searchChangeHandler}
            />
            {/* Upload medias */}
            <button
              type="button"
              className={elementStyles.blue}
              onClick={() => document.getElementById("file-upload").click()}
            >
              {`Add new ${type.slice(0, -1)}`}
            </button>
            <input
              onChange={(event) => {
                setUploadPath(customPath)
                readFileToStageUpload(event)
              }}
              onClick={(event) => {
                // eslint-disable-next-line no-param-reassign
                event.target.value = ""
              }}
              type="file"
              id="file-upload"
              accept={
                type === "images"
                  ? "image/jpeg, image/png, image/gif, image/svg+xml, image/tiff, image/bmp, image/x-icon"
                  : "application/pdf"
              }
              hidden
            />
            {/* Close */}
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Breadcrumb */}
          {
            <>
              <div className={contentStyles.segment}>
                {customPath !== "" ? (
                  <>
                    <BreadcrumbButton
                      name={deslugifyDirectory(type)}
                      idx={-1}
                    />
                    {customPath.split("/").map((folderName, idx, arr) => {
                      return idx === arr.length - 1 ? (
                        <>
                          &nbsp;{">"}
                          <strong>
                            &nbsp;
                            {deslugifyDirectory(folderName)}
                          </strong>
                        </>
                      ) : (
                        <>
                          &nbsp;{">"}
                          <BreadcrumbButton
                            idx={idx}
                            name={deslugifyDirectory(folderName)}
                          />
                        </>
                      )
                    })}
                  </>
                ) : (
                  <strong>{deslugifyDirectory(type)}</strong>
                )}
              </div>
              <div className={contentStyles.segment}>
                <p>
                  For {type} other than
                  {type === "images"
                    ? `'png', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'`
                    : `'pdf'`}
                  , please use{" "}
                  <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
                    {" "}
                    https://go.gov.sg{" "}
                  </Link>{" "}
                  to upload and link them to your Isomer site.
                </p>
              </div>
            </>
          }
          <div className={mediaStyles.mediaCards}>
            {/* Directories */}
            {filteredDirectories.map((directory) => (
              <MediaCard
                type="dirs"
                media={directory}
                siteName={siteName}
                onClick={() =>
                  setCustomPath((prevState) =>
                    prevState
                      ? `${prevState}/${directory.name}`
                      : directory.name
                  )
                }
                key={directory.path}
              />
            ))}
            {/* Media */}
            {filteredMedias.map((media) => (
              <MediaCard
                type={type}
                media={media}
                siteName={siteName}
                onClick={() => setSelectedFile(media)}
                key={media.path}
                isSelected={media.path === selectedFile?.path}
              />
            ))}
          </div>
          {/* Flexbox parent needs to be full-width - https://stackoverflow.com/a/49029061 */}
          <div className={`d-flex ${elementStyles.modalFooter}`}>
            <div className="ml-auto mt-3">
              <LoadingButton
                label={`Select ${type.slice(0, -1)}`}
                disabledStyle={elementStyles.disabled}
                disabled={!selectedFile}
                className={elementStyles.blue}
                callback={() => {
                  if (selectedFile)
                    onMediaSelect(`/${decodeURIComponent(selectedFile.path)}`)
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MediaModal

MediaModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  siteName: PropTypes.string.isRequired,
  onMediaSelect: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["files", "images"]).isRequired,
  readFileToStageUpload: PropTypes.func.isRequired,
  setUploadPath: PropTypes.func.isRequired,
}
