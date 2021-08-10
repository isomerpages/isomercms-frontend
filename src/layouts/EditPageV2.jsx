import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import { useQuery } from "react-query"
import PropTypes from "prop-types"
import SimpleMDE from "react-simplemde-editor"
import marked from "marked"
import Policy from "csp-parse"

import SimplePage from "../templates/SimplePage"
import LeftNavPage from "../templates/LeftNavPage"

import checkCSP from "../utils/cspUtils"
import { errorToast } from "../utils/toasts"

import {
  usePageHook,
  useUpdatePageHook,
  useDeletePageHook,
} from "../hooks/pageHooks"

import { useCollectionHook } from "../hooks/collectionHooks"
import { useCspHook, useSiteColorsHook } from "../hooks/settingsHooks"

// Isomer components
import {
  DEFAULT_RETRY_MSG,
  prependImageSrc,
  prettifyPageFileName,
  retrieveResourceFileMetadata,
  prettifyDate,
  parseDirectoryFile,
  deslugifyDirectory,
} from "../utils"
import {
  boldButton,
  italicButton,
  strikethroughButton,
  headingButton,
  codeButton,
  quoteButton,
  unorderedListButton,
  orderedListButton,
  tableButton,
  guideButton,
} from "../utils/markdownToolbar"

import { createPageStyleSheet } from "../utils/siteColorUtils"

import { DIR_CONTENT_KEY, CSP_CONTENT_KEY } from "../constants"
import "easymde/dist/easymde.min.css"
import "../styles/isomer-template.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import editorStyles from "../styles/isomer-cms/pages/Editor.module.scss"
import Header from "../components/Header"
import DeleteWarningModal from "../components/DeleteWarningModal"
import LoadingButton from "../components/LoadingButton"
import HyperlinkModal from "../components/HyperlinkModal"
import MediaModal from "../components/media/MediaModal"
import MediaSettingsModal from "../components/media/MediaSettingsModal"

// Import hooks
import useRedirectHook from "../hooks/useRedirectHook"

// Import API
import { getCsp, getDirectoryFile } from "../api"

// axios settings
axios.defaults.withCredentials = true

const extractMetadataFromFilename = (isResourcePage, fileName) => {
  if (isResourcePage) {
    const resourceMetadata = retrieveResourceFileMetadata(fileName)
    return {
      ...resourceMetadata,
      date: prettifyDate(resourceMetadata.date),
    }
  }
  return { title: prettifyPageFileName(fileName), date: "" }
}

const getBackButtonInfo = (
  resourceCategory,
  folderName,
  siteName,
  subfolderName
) => {
  if (resourceCategory)
    return {
      backButtonLabel: deslugifyDirectory(resourceCategory),
      backButtonUrl: `/sites/${siteName}/resources/${resourceCategory}`,
    }
  if (folderName) {
    if (subfolderName)
      return {
        backButtonLabel: deslugifyDirectory(subfolderName),
        backButtonUrl: `/sites/${siteName}/folder/${folderName}/subfolder/${subfolderName}`,
      }
    return {
      backButtonLabel: deslugifyDirectory(folderName),
      backButtonUrl: `/sites/${siteName}/folder/${folderName}`,
    }
  }
  return {
    backButtonLabel: "My Workspace",
    backButtonUrl: `/sites/${siteName}/workspace`,
  }
}

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditPageV2 = ({ match, isResourcePage, isCollectionPage, history }) => {
  const { setRedirectToNotFound } = useRedirectHook()

  const {
    folderName,
    fileName,
    siteName,
    resourceName,
    subfolderName,
  } = match.params
  const { title, type: resourceType, date } = extractMetadataFromFilename(
    isResourcePage,
    fileName
  )
  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(
    resourceName,
    folderName,
    siteName,
    subfolderName
  )

  const [csp, setCsp] = useState(new Policy())
  const [editorValue, setEditorValue] = useState("")
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(
    false
  )
  const [insertingMediaType, setInsertingMediaType] = useState("")
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [isInsertingHyperlink, setIsInsertingHyperlink] = useState(false)
  const [selectionText, setSelectionText] = useState("")
  const [isFileStagedForUpload, setIsFileStagedForUpload] = useState(false)
  const [stagedFileDetails, setStagedFileDetails] = useState({})
  const [isLoadingPageContent, setIsLoadingPageContent] = useState(true)
  const [uploadPath, setUploadPath] = useState("")
  const [leftNavPages, setLeftNavPages] = useState([])
  const [resourceRoomName, setResourceRoomName] = useState("")
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)

  const mdeRef = useRef()

  const siteParams = {
    // temporary until we standardize on collectionName and subCollectionName
    ...match.params,
    collectionName: match.params.folderName,
    subCollectionName: match.params.subfolderName,
  }

  const { data: pageData } = usePageHook(siteParams)
  const { mutateAsync: updatePageHandler } = useUpdatePageHook(siteParams)
  const { mutateAsync: deletePageHandler } = useDeletePageHook(siteParams, {
    onSuccess: () => history.goBack(),
  })

  const { data: cspData } = useCspHook(siteParams)
  const { data: dirData } = useCollectionHook(siteParams)
  const { data: siteColorsData } = useSiteColorsHook(siteParams)

  useEffect(() => {
    if (!siteColorsData) return
    createPageStyleSheet(
      siteName,
      siteColorsData.primaryColor,
      siteColorsData.secondaryColor
    )
  }, [siteColorsData])

  useEffect(() => {
    let _isMounted = true

    const loadPageDetails = async () => {
      if (!pageData || (isCollectionPage && !dirData) || !cspData) return

      if (_isMounted) {
        setCsp(cspData)
        setEditorValue(pageData.content.pageBody)
        setLeftNavPages(
          dirData.map((name) => ({
            fileName: name.includes("/") ? name.split("/")[1] : name,
            third_nav_title: name.includes("/") ? name.split("/")[0] : null,
          }))
        )
        setResourceRoomName(resourceRoomName || "")
        setIsLoadingPageContent(false)
      }
    }

    loadPageDetails()
    return () => {
      _isMounted = false
    }
  }, [pageData, dirData, cspData])

  useEffect(() => {
    async function loadChunk() {
      const html = marked(editorValue)
      const {
        isCspViolation: checkedIsCspViolation,
        sanitisedHtml: processedSanitisedHtml,
      } = checkCSP(csp, html)
      const processedChunk = await prependImageSrc(
        siteName,
        processedSanitisedHtml
      )
      setIsCspViolation(checkedIsCspViolation)
      setChunk(processedChunk)
    }
    loadChunk()
  }, [editorValue])

  useEffect(() => {
    if (pageData) setHasChanges(pageData.content.pageBody !== editorValue)
  }, [pageData, editorValue])

  const onEditorChange = (value) => {
    setEditorValue(value)
  }

  const toggleImageAndSettingsModal = (newFileName) => {
    // insert image into editor
    const cm = mdeRef.current.simpleMde.codemirror
    if (newFileName) {
      cm.replaceSelection(
        `${
          MEDIA_PLACEHOLDER_TEXT[insertingMediaType]
        }${`(/${insertingMediaType}/${
          uploadPath ? `${uploadPath}/` : ""
        }${newFileName})`.replaceAll(" ", "%20")}`
      )
      // set state so that rerender is triggered and image is shown
      setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    }
    setInsertingMediaType("")
    setIsFileStagedForUpload(!isFileStagedForUpload)
  }

  const onHyperlinkOpen = () => {
    const cm = mdeRef.current.simpleMde.codemirror
    setSelectionText(cm.getSelection() || "")
    setIsInsertingHyperlink(true)
  }

  const onHyperlinkSave = (text, link) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setIsInsertingHyperlink(false)
    setSelectionText("")
  }

  const onHyperlinkClose = () => {
    setIsInsertingHyperlink(false)
    setSelectionText("")
  }

  const onMediaSelect = (path) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(
      `${MEDIA_PLACEHOLDER_TEXT[insertingMediaType]}(${path.replaceAll(
        " ",
        "%20"
      )})`
    )
    // set state so that rerender is triggered and image is shown
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setInsertingMediaType("")
    setShowMediaModal(false)
  }

  const stageFileForUpload = (fileName, fileData) => {
    const baseFolder = insertingMediaType
    setStagedFileDetails({
      path: `${baseFolder}%2F${fileName}`,
      content: fileData,
      fileName,
    })
    setIsFileStagedForUpload(true)
  }

  const readFileToStageUpload = async (event) => {
    const fileReader = new FileReader()
    const fileName = event.target.files[0].name
    fileReader.onload = () => {
      /** Github only requires the content of the image
       * fileReader returns  `data:application/pdf;base64, {fileContent}`
       * hence the split
       */

      const fileData = fileReader.result.split(",")[1]
      stageFileForUpload(fileName, fileData)
    }
    fileReader.readAsDataURL(event.target.files[0])
    setShowMediaModal((prevState) => !prevState)
  }

  return (
    <>
      <Header
        siteName={siteName}
        title={title}
        shouldAllowEditPageBackNav={!hasChanges}
        isEditPage
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        {/* Inserting Medias */}
        {showMediaModal && insertingMediaType && (
          <MediaModal
            siteName={siteName}
            onClose={() => {
              setShowMediaModal(false)
              setInsertingMediaType("")
            }}
            onMediaSelect={onMediaSelect}
            type={insertingMediaType}
            readFileToStageUpload={readFileToStageUpload}
            setUploadPath={setUploadPath}
          />
        )}
        {isFileStagedForUpload && insertingMediaType && (
          <MediaSettingsModal
            type={insertingMediaType}
            siteName={siteName}
            customPath={uploadPath}
            onClose={() => {
              setIsFileStagedForUpload(false)
              setInsertingMediaType("")
            }}
            onSave={toggleImageAndSettingsModal}
            media={stagedFileDetails}
            isPendingUpload
          />
        )}
        {isInsertingHyperlink && (
          <HyperlinkModal
            text={selectionText}
            onSave={onHyperlinkSave}
            onClose={onHyperlinkClose}
          />
        )}
        {
          <div
            className={`${editorStyles.pageEditorSidebar} ${
              isLoadingPageContent || resourceType === "file"
                ? editorStyles.pageEditorSidebarLoading
                : null
            }`}
          >
            {resourceType === "file" ? (
              <>
                <div
                  className={`text-center ${editorStyles.pageEditorSidebarDisabled}`}
                >
                  Editing is disabled for downloadable files.
                </div>
              </>
            ) : isLoadingPageContent ? (
              <div
                className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`}
              />
            ) : (
              ""
            )}
            <SimpleMDE
              id="simplemde-editor"
              className="h-100"
              onChange={onEditorChange}
              ref={mdeRef}
              value={editorValue}
              options={{
                toolbar: [
                  headingButton,
                  boldButton,
                  italicButton,
                  strikethroughButton,
                  "|",
                  codeButton,
                  quoteButton,
                  unorderedListButton,
                  orderedListButton,
                  "|",
                  {
                    name: "image",
                    action: async () => {
                      setShowMediaModal(true)
                      setInsertingMediaType("images")
                    },
                    className: "fa fa-picture-o",
                    title: "Insert Image",
                    default: true,
                  },
                  {
                    name: "file",
                    action: async () => {
                      setShowMediaModal(true)
                      setInsertingMediaType("files")
                    },
                    className: "fa fa-file-pdf-o",
                    title: "Insert File",
                    default: true,
                  },
                  {
                    name: "link",
                    action: async () => {
                      onHyperlinkOpen()
                    },
                    className: "fa fa-link",
                    title: "Insert Link",
                    default: true,
                  },
                  tableButton,
                  guideButton,
                ],
              }}
            />
          </div>
        }
        <div className={editorStyles.pageEditorMain}>
          {isCollectionPage && dirData ? (
            <LeftNavPage
              chunk={chunk}
              dirData={dirData}
              fileName={fileName}
              title={title}
              collection={deslugifyDirectory(folderName)}
            />
          ) : (
            <SimplePage
              chunk={chunk}
              title={title}
              date={date}
              isResourcePage={isResourcePage}
              resourceRoomName={deslugifyDirectory(resourceRoomName)}
              collection={resourceName}
            />
          )}
        </div>
      </div>
      <div className={editorStyles.pageEditorFooter}>
        <button
          type="button"
          className={elementStyles.warning}
          onClick={() => setCanShowDeleteWarningModal(true)}
        >
          Delete
        </button>
        <LoadingButton
          label="Save"
          disabledStyle={elementStyles.disabled}
          disabled={isCspViolation}
          className={
            isCspViolation ? elementStyles.disabled : elementStyles.blue
          }
          callback={() =>
            updatePageHandler({
              frontMatter: pageData.content.frontMatter,
              sha: pageData.sha,
              pageBody: editorValue,
            })
          }
        />
      </div>
      {canShowDeleteWarningModal && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={() => {
            deletePageHandler({
              sha: pageData.sha,
            })
            setCanShowDeleteWarningModal(false)
          }}
          type={isResourcePage ? "resource" : "page"}
        />
      )}
    </>
  )
}

export default EditPageV2

EditPageV2.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      fileName: PropTypes.string,
      newFileName: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
  isCollectionPage: PropTypes.bool.isRequired,
  isResourcePage: PropTypes.bool.isRequired,
}
