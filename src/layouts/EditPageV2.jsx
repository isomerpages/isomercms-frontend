import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import SimpleMDE from "react-simplemde-editor"
import marked from "marked"

import SimplePage from "../templates/SimplePage"
import LeftNavPage from "../templates/LeftNavPage"

import checkCSP from "../utils/cspUtils"

import {
  useGetPageHook,
  useUpdatePageHook,
  useDeletePageHook,
} from "../hooks/pageHooks"

import { useCollectionHook } from "../hooks/collectionHooks"
import { useCspHook, useSiteColorsHook } from "../hooks/settingsHooks"
import useRedirectHook from "../hooks/useRedirectHook"

// Isomer components
import {
  prependImageSrc,
  getBackButton,
  extractMetadataFromFilename,
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

// axios settings
axios.defaults.withCredentials = true

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditPageV2 = ({ match, history }) => {
  const {
    subCollectionName,
    collectionName,
    resourceRoomName,
    resourceCategoryName,
    fileName,
    siteName,
  } = match.params

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

  const [uploadPath, setUploadPath] = useState("")
  const [leftNavPages, setLeftNavPages] = useState([])
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)
  const { setRedirectToNotFound } = useRedirectHook()

  const mdeRef = useRef()

  const { backButtonLabel, backButtonUrl } = getBackButton(match.params)
  const { title, type: resourceType, date } = extractMetadataFromFilename(
    match.params
  )

  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(
    match.params,
    {
      onError: () => setRedirectToNotFound(siteName),
    }
  )
  const { mutateAsync: updatePageHandler } = useUpdatePageHook(match.params)
  const { mutateAsync: deletePageHandler } = useDeletePageHook(match.params, {
    onSuccess: () => history.goBack(),
  })

  const { data: csp } = useCspHook(match.params)
  const { data: dirData } = useCollectionHook(match.params)
  const { data: siteColorsData } = useSiteColorsHook(match.params)

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (siteColorsData)
      createPageStyleSheet(
        siteName,
        siteColorsData.primaryColor,
        siteColorsData.secondaryColor
      )
  }, [siteColorsData])

  useEffect(() => {
    if (pageData && !hasChanges)
      setEditorValue(pageData.content.pageBody.trim())
  }, [pageData])

  useEffect(() => {
    if (pageData)
      setHasChanges(pageData.content.pageBody.trim() !== editorValue)
  }, [pageData, editorValue])

  useEffect(() => {
    if (dirData)
      setLeftNavPages(
        dirData.map((name) => ({
          fileName: name.includes("/") ? name.split("/")[1] : name,
          third_nav_title: name.includes("/") ? name.split("/")[0] : null,
        }))
      )
  }, [dirData])

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

  /** ******************************** */
  /*       Component functions      */
  /** ******************************** */

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
              isLoadingPage || resourceType === "file"
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
            ) : isLoadingPage ? (
              <div
                className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`}
              />
            ) : (
              ""
            )}
            <SimpleMDE
              id="simplemde-editor"
              className="h-100"
              onChange={(value) => setEditorValue(value)}
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
          {collectionName && leftNavPages.length > 0 ? (
            <LeftNavPage
              chunk={chunk}
              leftNavPages={leftNavPages}
              fileName={fileName}
              title={title}
              collection={deslugifyDirectory(collectionName)}
            />
          ) : resourceRoomName && resourceCategoryName ? (
            <SimplePage
              chunk={chunk}
              title={title}
              date={date}
              resourceRoomName={deslugifyDirectory(resourceRoomName)}
              collection={resourceCategoryName}
            />
          ) : (
            <SimplePage chunk={chunk} title={title} date={date} />
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
          onDelete={() =>
            deletePageHandler({
              sha: pageData.sha,
            })
          }
          type="page"
        />
      )}
    </>
  )
}

export default EditPageV2

EditPageV2.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subCollectionName: PropTypes.string,
      collectionName: PropTypes.string,
      resourceRoomName: PropTypes.string,
      resourceCategoryName: PropTypes.string,
      siteName: PropTypes.string,
      fileName: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
}
