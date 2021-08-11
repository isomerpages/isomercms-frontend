import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import marked from "marked"

import SimplePage from "../templates/SimplePage"
import LeftNavPage from "../templates/LeftNavPage"

import {
  usePageHook,
  useUpdatePageHook,
  useDeletePageHook,
} from "../hooks/pageHooks"

import { useCollectionHook } from "../hooks/collectionHooks"
import { useCspHook, useSiteColorsHook } from "../hooks/settingsHooks"

import {
  prependImageSrc,
  deslugifyDirectory,
  getBackButtonInfo,
  extractMetadataFromFilename,
} from "../utils"

import checkCSP from "../utils/cspUtils"
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
import MarkdownEditor from "../components/pages/MarkdownEditor"

// axios settings
axios.defaults.withCredentials = true

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditPageV2 = ({ match, isResourcePage, isCollectionPage, history }) => {
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
  const [resourceRoomName, setResourceRoomName] = useState("") // broken
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

  const { backButtonLabel, backButtonUrl } = getBackButton(siteParams)

  const { data: pageData, isLoading: isLoadingPage } = usePageHook(siteParams)
  const { mutateAsync: updatePageHandler } = useUpdatePageHook(siteParams)
  const { mutateAsync: deletePageHandler } = useDeletePageHook(siteParams, {
    onSuccess: () => history.goBack(),
  })

  const { data: csp } = useCspHook(siteParams)
  const { data: dirData } = useCollectionHook(siteParams)
  const { data: siteColorsData } = useSiteColorsHook(siteParams)

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
  /*         Hyperlink Modal         */
  /** ******************************** */

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

  /** ******************************** */
  /*           Media Modal           */
  /** ******************************** */

  const toggleMediaAndSettingsModal = (newFileName) => {
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
            onSave={toggleMediaAndSettingsModal}
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
        <MarkdownEditor
          mdeRef={mdeRef}
          onChange={(value) => setEditorValue(value)}
          value={editorValue}
          customOptions={{
            imageAction: async () => {
              setShowMediaModal(true)
              setInsertingMediaType("images")
            },
            fileAction: async () => {
              setShowMediaModal(true)
              setInsertingMediaType("files")
            },
            linkAction: async () => {
              onHyperlinkOpen()
            },
          }}
          isDisabled={resourceType === "file"}
          isLoading={isLoadingPage}
        />
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
