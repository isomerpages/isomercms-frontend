import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import Policy from 'csp-parse';

import SimplePage from '../templates/SimplePage';
import LeftNavPage from '../templates/LeftNavPage';

import { checkCSP } from '../utils/cspUtils';
import { errorToast } from '../utils/toasts';

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
} from '../utils';
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
} from '../utils/markdownToolbar';
import {
  PAGE_CONTENT_KEY,
  DIR_CONTENT_KEY,
  CSP_CONTENT_KEY,
} from '../constants'
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';
import DeleteWarningModal from '../components/DeleteWarningModal';
import LoadingButton from '../components/LoadingButton';
import HyperlinkModal from '../components/HyperlinkModal';
import MediaModal from '../components/media/MediaModal';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

// Import hooks
import useSiteColorsHook from '../hooks/useSiteColorsHook';
import useRedirectHook from '../hooks/useRedirectHook';

// Import API
import { getEditPageData, updatePageData, deletePageData, getCsp, getDirectoryFile } from '../api';

// axios settings
axios.defaults.withCredentials = true

const extractMetadataFromFilename = (isResourcePage, fileName) => {
  if (isResourcePage) {
    const resourceMetadata = retrieveResourceFileMetadata(fileName)
    return {
      ...resourceMetadata,
      date: prettifyDate(resourceMetadata.date)
    }
  }
  return { title: prettifyPageFileName(fileName), date: '' }
}

const getBackButtonInfo = (resourceCategory, folderName, siteName, subfolderName) => {
  if (resourceCategory) return {
    backButtonLabel: deslugifyDirectory(resourceCategory),
    backButtonUrl: `/sites/${siteName}/resources/${resourceCategory}`,
  }
  if (folderName) {
    if (subfolderName) return {
      backButtonLabel: deslugifyDirectory(subfolderName),
      backButtonUrl: `/sites/${siteName}/folder/${folderName}/subfolder/${subfolderName}`,
    }
    return {
      backButtonLabel: deslugifyDirectory(folderName),
      backButtonUrl: `/sites/${siteName}/folder/${folderName}`,
    }
  }
  return {
    backButtonLabel: 'My Workspace',
    backButtonUrl: `/sites/${siteName}/workspace`,
  }
}

const EditPage = ({ match, isResourcePage, isCollectionPage, history, type }) => {
  // Instantiate queryClient
  const queryClient = useQueryClient()

  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()
  const { setRedirectToNotFound } = useRedirectHook()

  const { folderName, fileName, siteName, resourceName, subfolderName } = match.params;
  const { title, type: resourceType, date } = extractMetadataFromFilename(isResourcePage, fileName)
  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(resourceName, folderName, siteName, subfolderName)

  const [csp, setCsp] = useState(new Policy())
  const [sha, setSha] = useState(null)
  const [originalMdValue, setOriginalMdValue] = useState('')
  const [editorValue, setEditorValue] = useState('')
  const [frontMatter, setFrontMatter] = useState('')
  const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)
  const [isSelectingImage, setIsSelectingImage] = useState(false)
  const [isInsertingHyperlink, setIsInsertingHyperlink] = useState(false)
  const [selectionText, setSelectionText] = useState('')
  const [isFileStagedForUpload, setIsFileStagedForUpload] = useState(false)
  const [stagedFileDetails, setStagedFileDetails] = useState({})
  const [isLoadingPageContent, setIsLoadingPageContent] = useState(true)
  const [mediaSearchTerm, setMediaSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState('')
  const [leftNavPages, setLeftNavPages] = useState([])
  const [resourceRoomName, setResourceRoomName] = useState('')
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState('')

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
          errorToast(`There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`)
        }
      },
    },
  );

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
          errorToast(`There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`)
        }
      },
    },
  );

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
          errorToast(`There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`)
        }
      },
    },
  );

  // update page data
  const { mutateAsync: saveHandler } = useMutation(
    () => updatePageData(match.params, concatFrontMatterMdBody(frontMatter, editorValue), sha),
    {
      onError: () => errorToast(`There was a problem saving your page. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => {
        queryClient.invalidateQueries([PAGE_CONTENT_KEY, match.params])
        window.location.reload()
      },
    },
  )

  // delete page data
  const { mutateAsync: deleteHandler } = useMutation(
    () => deletePageData(match.params, sha),
    {
      onError: () => errorToast(`There was a problem deleting your page. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => history.goBack(),
    },
  )

  useEffect(() => {
    let _isMounted = true

    const loadPageDetails = async () => {
      // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err);
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
      const {
        pageContent,
        pageSha,
        resourceRoomName,
      } = pageData
      const {
        netlifyTomlHeaderValues
      } = cspData
      if (!pageContent) return
      
      const { frontMatter: retrievedFrontMatter, mdBody: retrievedMdBody } = frontMatterParser(pageContent);
      const retrievedCsp = new Policy(netlifyTomlHeaderValues['Content-Security-Policy']);

      let generatedLeftNavPages
      if (isCollectionPage) {
        const {
          content: dirContent,
        } = dirData
        const { order: parsedFolderContents } = parseDirectoryFile(dirContent)
        // Filter out placeholder files
        const filteredFolderContents = parsedFolderContents.filter(name => !name.includes('.keep'))
        generatedLeftNavPages = filteredFolderContents.map((name) => 
          ({
            fileName: name.includes('/') ? name.split('/')[1] : name,
            third_nav_title: name.includes('/') ? name.split('/')[0] : null,
          })
        )
      }

      if (_isMounted) {
        setCsp(retrievedCsp)
        setSha(pageSha)
        setOriginalMdValue(retrievedMdBody.trim())
        setEditorValue(retrievedMdBody.trim())
        setFrontMatter(retrievedFrontMatter)
        setLeftNavPages(generatedLeftNavPages)
        setResourceRoomName(resourceRoomName || '')
        setIsLoadingPageContent(false)
      }
    }

    loadPageDetails()
    return () => {
      _isMounted = false
    }
  }, [pageData, dirData, cspData])

  useEffect(() => {
    const html = marked(editorValue)
    const { isCspViolation: checkedIsCspViolation, sanitisedHtml: processedSanitisedHtml } = checkCSP(csp, html)
    const processedChunk = prependImageSrc(siteName, processedSanitisedHtml)
    setIsCspViolation(checkedIsCspViolation)
    setChunk(processedChunk)
  }, [editorValue])

  useEffect(() => {
    setHasChanges(originalMdValue === editorValue)
  }, [originalMdValue, editorValue])

  const onEditorChange = (value) => {
    setEditorValue(value);
  }

  const toggleImageAndSettingsModal = (newFileName) => {
    // insert image into editor
    let editorValue
    if (newFileName) {
      const cm = mdeRef.current.simpleMde.codemirror;
      cm.replaceSelection(`![](/images/${newFileName})`);

      // set state so that rerender is triggered and image is shown
      editorValue = mdeRef.current.simpleMde.codemirror.getValue()
    }

    setIsFileStagedForUpload(!isFileStagedForUpload)
    if (editorValue) {
      setEditorValue(editorValue)
    }
  }

  const onHyperlinkOpen = () => {
    const cm = mdeRef.current.simpleMde.codemirror;
    setSelectionText(cm.getSelection() || '')
    setIsInsertingHyperlink(true)
  }

  const onHyperlinkSave = (text, link) => {
    const cm = mdeRef.current.simpleMde.codemirror;
    cm.replaceSelection(`[${text}](${link})`);
    // set state so that rerender is triggered and path is shown
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setIsInsertingHyperlink(false)
    setSelectionText('')
  }

  const onHyperlinkClose = () => {
    setIsInsertingHyperlink(false)
    setSelectionText('')
  }

  const onImageClick = (path) => {
    const cm = mdeRef.current.simpleMde.codemirror;
    cm.replaceSelection(`![](${path.replaceAll(' ', '%20')})`);
    // set state so that rerender is triggered and image is shown
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setIsSelectingImage(false)
  }

  const stageFileForUpload = (fileName, fileData) => {
    const baseFolder = type === 'file' ? 'files' : 'images';
    setStagedFileDetails({
      path: `${baseFolder}%2F${fileName}`,
      content: fileData,
      fileName,
    })
    setIsFileStagedForUpload(true)
  }

  const readFileToStageUpload = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the image
         * fileReader returns  `data:application/pdf;base64, {fileContent}`
         * hence the split
         */

      const fileData = fileReader.result.split(',')[1];
      stageFileForUpload(fileName, fileData);
    });
    fileReader.readAsDataURL(event.target.files[0]);
    setIsSelectingImage((prevState) => !prevState)
  }

  return (
    <>
      <Header
        siteName={siteName}
        title={title}
        shouldAllowEditPageBackNav={hasChanges}
        isEditPage={true}
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        {
          isSelectingImage && (
          <MediaModal
            type="images"
            siteName={siteName}
            onMediaSelect={onImageClick}
            toggleImageModal={() => setIsSelectingImage(!isSelectingImage)}
            readFileToStageUpload={readFileToStageUpload}
            onClose={() => setIsSelectingImage(false)}
            mediaSearchTerm={mediaSearchTerm}
            setMediaSearchTerm={setMediaSearchTerm}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
          )
        }
        {
          isFileStagedForUpload && (
            <MediaSettingsModal
              type="images"
              siteName={siteName}
              onClose={() => setIsFileStagedForUpload(false)}
              onSave={toggleImageAndSettingsModal}
              media={stagedFileDetails}
              isPendingUpload
            />
          )
        }
        {
          isInsertingHyperlink && (
          <HyperlinkModal
            text={selectionText}
            onSave={onHyperlinkSave}
            onClose={onHyperlinkClose}
          />
          )
        }
        {
          <div className={`${editorStyles.pageEditorSidebar} ${isLoadingPageContent || resourceType === 'file' ? editorStyles.pageEditorSidebarLoading : null}`} >
            {
              resourceType === 'file'
              ?
              <>
                <div className={`text-center ${editorStyles.pageEditorSidebarDisabled}`}>
                  Editing is disabled for downloadable files.
                </div>
              </>
              :
              isLoadingPageContent
              ? (
                <div className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`} />
              ) : ''
            }
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
                  '|',
                  codeButton,
                  quoteButton,
                  unorderedListButton,
                  orderedListButton,
                  '|',
                  {
                    name: 'image',
                    action: async () => {
                      setIsSelectingImage(true);
                    },
                    className: 'fa fa-picture-o',
                    title: 'Insert Image',
                    default: true,
                  },
                  {
                    name: 'link',
                    action: async () => { 
                      onHyperlinkOpen() 
                    },
                    className: 'fa fa-link',
                    title: 'Insert Link',
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
          {
            isCollectionPage && leftNavPages.length > 0
            ? (
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
            )
          }
        </div>
      </div>
      <div className={editorStyles.pageEditorFooter}>
        <button type="button" className={elementStyles.warning} onClick={() => setCanShowDeleteWarningModal(true)}>Delete</button>
        <LoadingButton
          label="Save"
          disabledStyle={elementStyles.disabled}
          disabled={isCspViolation}
          className={isCspViolation ? elementStyles.disabled : elementStyles.blue}
          callback={saveHandler}
        />
      </div>
      {
        canShowDeleteWarningModal
        && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deleteHandler}
          type={isResourcePage ? 'resource' : 'page'}
        />
        )
      }
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
};