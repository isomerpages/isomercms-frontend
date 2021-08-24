import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import { useQuery, useMutation, useQueryClient } from "react-query"
import PropTypes from "prop-types"
import SimpleMDE from "react-simplemde-editor"
import marked from "marked"
import Policy from "csp-parse"

import DOMPurify from "dompurify"
import SimplePage from "../templates/SimplePage"
import LeftNavPage from "../templates/LeftNavPage"

import checkCSP from "../utils/cspUtils"
import { successToast, errorToast } from "../utils/toasts"

// Isomer components
import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  concatFrontMatterMdBody,
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
import {
  PAGE_CONTENT_KEY,
  DIR_CONTENT_KEY,
  CSP_CONTENT_KEY,
} from "../constants"
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
import GenericWarningModal from "../components/GenericWarningModal"

// Import hooks
import useSiteColorsHook from "../hooks/useSiteColorsHook"
import useRedirectHook from "../hooks/useRedirectHook"

// Import API
import {
  getEditPageData,
  updatePageData,
  deletePageData,
  getCsp,
  getDirectoryFile,
} from "../api"

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

DOMPurify.setConfig({
  ADD_TAGS: ["iframe", "#comment"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "scrolling",
    "marginheight",
    "marginwidth",
  ],
})

const EditPage = ({ match, isResourcePage, isCollectionPage, history }) => {
  // Instantiate queryClient
  const queryClient = useQueryClient()

  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()
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
  const [sha, setSha] = useState(null)
  const [originalMdValue, setOriginalMdValue] = useState("")
  const [editorValue, setEditorValue] = useState("")
  const [frontMatter, setFrontMatter] = useState("")
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
  const [isXSSViolation, setIsXSSViolation] = useState(false)
  const [showXSSWarning, setShowXSSWarning] = useState(false)
  const [chunk, setChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)

  const mdeRef = useRef()

  // get page data
  const { data: pageData } = useQuery(
    [PAGE_CONTENT_KEY, match.params],
    () => getEditPageData(match.params),
    {
      enabled: !hasChanges,
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(
            `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`
          )
        }
      },
    }
  )

  // get directory data
  const { data: dirData } = useQuery(
    [DIR_CONTENT_KEY, siteName, folderName, subfolderName],
    () => getDirectoryFile(siteName, folderName),
    {
      enabled: !hasChanges,
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(
            `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`
          )
        }
      },
    }
  )

  // get csp data
  const { data: cspData } = useQuery(
    [CSP_CONTENT_KEY, siteName],
    () => getCsp(siteName),
    {
      enabled: !hasChanges,
      retry: false,
      onError: (err) => {
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(
            `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`
          )
        }
      },
    }
  )

  // update page data
  const { mutateAsync: saveHandler } = useMutation(
    () =>
      updatePageData(
        match.params,
        concatFrontMatterMdBody(frontMatter, DOMPurify.sanitize(editorValue)),
        sha
      ),
    {
      onError: () =>
        errorToast(
          `There was a problem saving your page. ${DEFAULT_RETRY_MSG}`
        ),
      onSuccess: () => {
        queryClient.invalidateQueries([PAGE_CONTENT_KEY, match.params])
        successToast("Successfully saved page content")
      },
    }
  )

  // delete page data
  const { mutateAsync: deleteHandler } = useMutation(
    () => deletePageData(match.params, sha),
    {
      onError: () =>
        errorToast(
          `There was a problem deleting your page. ${DEFAULT_RETRY_MSG}`
        ),
      onSuccess: () => history.goBack(),
    }
  )

  useEffect(() => {
    let _isMounted = true

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
    return () => {
      _isMounted = false
    }
  })

  useEffect(() => {
    let _isMounted = true

    const loadPageDetails = async () => {
      if (!pageData || (isCollectionPage && !dirData) || !cspData) return
      const { pageContent, pageSha, resourceRoomName } = pageData
      const { netlifyTomlHeaderValues } = cspData
      if (!pageContent) return

      const {
        frontMatter: retrievedFrontMatter,
        mdBody: retrievedMdBody,
      } = frontMatterParser(pageContent)
      const retrievedCsp = new Policy(
        netlifyTomlHeaderValues["Content-Security-Policy"]
      )

      let generatedLeftNavPages
      if (isCollectionPage) {
        const { content: dirContent } = dirData
        const { order: parsedFolderContents } = parseDirectoryFile(dirContent)
        // Filter out placeholder files
        const filteredFolderContents = parsedFolderContents.filter(
          (name) => !name.includes(".keep")
        )
        generatedLeftNavPages = filteredFolderContents.map((name) => ({
          fileName: name.includes("/") ? name.split("/")[1] : name,
          third_nav_title: name.includes("/") ? name.split("/")[0] : null,
        }))
      }

      if (_isMounted) {
        setCsp(retrievedCsp)
        setSha(pageSha)
        setOriginalMdValue(retrievedMdBody.trim())
        setEditorValue(retrievedMdBody.trim())
        setFrontMatter(retrievedFrontMatter)
        setLeftNavPages(generatedLeftNavPages)
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
      const { isCspViolation, sanitisedHtml: CSPSanitisedHtml } = checkCSP(
        csp,
        html
      )
      const cleanedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
      const processedChunk = await prependImageSrc(siteName, cleanedHtml)
      setIsXSSViolation(DOMPurify.removed.length > 0)
      setIsCspViolation(isCspViolation)
      setChunk(processedChunk)
    }
    loadChunk()
  }, [editorValue])

  useEffect(() => {
    setHasChanges(originalMdValue === editorValue)
  }, [originalMdValue, editorValue])

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
        shouldAllowEditPageBackNav={hasChanges}
        isEditPage
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        {isXSSViolation && showXSSWarning && (
          <GenericWarningModal
            displayTitle="Warning"
            // DOMPurify removed object format taken from https://github.com/cure53/DOMPurify/blob/dd63379e6354f66d4689bb80b30cb43a6d8727c2/src/purify.js
            displayText={`There is unauthorised JS detected in the following snippet${
              DOMPurify.removed.length > 1 ? "s" : ""
            }:
            ${DOMPurify.removed.map(
              (elem, i) =>
                `<br/><code>${i}</code>: <code>${
                  elem.attribute?.textContent || elem.element?.textContent
                    ? (
                        elem.attribute?.textContent || elem.element?.textContent
                      ).replace("<", "&lt;")
                    : elem
                }</code>`
            )}
            <br/><br/>Before saving, the editor input will be automatically sanitised to prevent security vulnerabilities.
            <br/><br/>To save the sanitised editor input, press Acknowledge. To return to the editor without sanitising, press Cancel.`}
            onProceed={() => {
              setIsXSSViolation(false)
              setShowXSSWarning(false)
              saveHandler()
            }}
            onCancel={() => {
              setShowXSSWarning(false)
            }}
            cancelText="Cancel"
            proceedText="Acknowledge"
          />
        )}
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
          {isCollectionPage && leftNavPages.length > 0 ? (
            <LeftNavPage
              chunk={chunk}
              leftNavPages={leftNavPages}
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
          callback={
            isXSSViolation ? () => setShowXSSWarning(true) : saveHandler
          }
        />
      </div>
      {canShowDeleteWarningModal && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
          type={isResourcePage ? "resource" : "page"}
        />
      )}
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
