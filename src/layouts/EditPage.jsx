import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import marked from "marked"
import Policy from "csp-parse"

import SimplePage from "../templates/SimplePage"
import LeftNavPage from "../templates/LeftNavPage"

import checkCSP from "../utils/cspUtils"

// Isomer components
import {
  prependImageSrc,
  deslugifyDirectory,
  getBackButtonInfo,
  prettifyPageFileName,
} from "../utils"

import "easymde/dist/easymde.min.css"
import "../styles/isomer-template.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import editorStyles from "../styles/isomer-cms/pages/Editor.module.scss"
import Header from "../components/Header"
import DeleteWarningModalState from "../components/DeleteWarningModalState"
import LoadingButton from "../components/LoadingButton"
import HyperlinkModal from "../components/HyperlinkModal"
import MediaModal from "../components/media/MediaModal"
import MediaSettingsModal from "../components/media/MediaSettingsModal"
import PageEditor from "../components/pages/PageEditor"

// Import hooks
import useSiteColorsHook from "../hooks/useSiteColorsHook"

// Import API
import { usePageHook, useUpdatePageHook } from "../hooks/pageHooks"
import { useCollectionHook } from "../hooks/collectionHooks"
import { useCSPHook } from "../hooks/useCSPHook"

// axios settings
axios.defaults.withCredentials = true

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditPage = ({ match, pageParams, history }) => {
  const { isResourcePage, isCollectionPage } = pageParams // figure out if we can pass this via URL

  const {
    folderName,
    fileName,
    siteName,
    resourceName,
    resourceRoomName = "", // to pass via URL, broken and needs to be fixed!
  } = match.params

  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(match.params)

  const [csp, setCsp] = useState(new Policy())
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [editorValue, setEditorValue] = useState("")
  const [chunk, setChunk] = useState("")
  const [leftNavPages, setLeftNavPages] = useState([])
  const [hasChanges, setHasChanges] = useState(false)

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

  const mdeRef = useRef()

  const siteParams = {
    // temporary until we standardize on collectionName and subCollectionName
    ...match.params,
    collectionName: match.params.folderName,
    subCollectionName: match.params.subfolderName,
  }

  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()
  const { data: pageData } = usePageHook(siteParams)
  const { data: cspData } = useCSPHook(siteParams)
  const { data: dirData } = useCollectionHook(siteParams)

  const { mutateAsync: updatePageHandler } = useUpdatePageHook(siteParams)

  useEffect(() => {
    if (pageData && !hasChanges) setEditorValue(pageData.content.pageBody)
  }, [pageData, hasChanges])

  useEffect(() => {
    if (cspData)
      setCsp(
        new Policy(cspData.netlifyTomlHeaderValues["Content-Security-Policy"])
      )
  }, [cspData])

  useEffect(() => {
    if (pageData) setHasChanges(pageData.content.pageBody !== editorValue)
  }, [pageData, editorValue])

  useEffect(() => {
    // sanitise, check CSP and render html
    async function processEditorValue() {
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
    processEditorValue()
  }, [editorValue])

  useEffect(() => {
    // to be cleaned
    const loadPageDetails = async () => {
      // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      if (_.isEmpty(pageData)) return
    }
    loadPageDetails()
  })

  useEffect(() => {
    if (!isCollectionPage) return
    if (!dirData) return
    setLeftNavPages(
      dirData.map((name) => ({
        // to be cleaned
        fileName: name.includes("/") ? name.split("/")[1] : name,
        third_nav_title: name.includes("/") ? name.split("/")[0] : null,
      }))
    )
  }, [dirData])

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
        title={prettifyPageFileName(fileName)}
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
        {canShowDeleteWarningModal && (
          <DeleteWarningModalState
            siteParams={siteParams}
            onClose={() => {
              setCanShowDeleteWarningModal(false)
            }}
          />
        )}
        <PageEditor
          mdeRef={mdeRef}
          onChange={(v) => setEditorValue(v)}
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
          isDisabled={false}
        />
        <div className={editorStyles.pageEditorMain}>
          {isCollectionPage && leftNavPages.length > 0 ? (
            <LeftNavPage
              chunk={chunk}
              leftNavPages={leftNavPages}
              fileName={fileName}
              collection={deslugifyDirectory(folderName)}
            />
          ) : (
            <SimplePage
              chunk={chunk}
              fileName={fileName}
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
          callback={() => {
            updatePageHandler({
              frontMatter: pageData.content.frontMatter,
              sha: pageData.sha,
              pageBody: editorValue,
            })
          }}
        />
      </div>
    </>
  )
}

export default EditPage

EditPage.propTypes = {
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
