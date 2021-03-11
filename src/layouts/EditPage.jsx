import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Bluebird from 'bluebird';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
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
  prettifyCollectionPageFileName,
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

// axios settings
axios.defaults.withCredentials = true

const getApiEndpoint = (isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName) => {
  if (isCollectionPage) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${fileName}`)}`
  }
  if (isResourcePage) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`
}

const extractMetadataFromFilename = (isResourcePage, isCollectionPage, fileName) => {
  if (isResourcePage) {
    const resourceMetadata = retrieveResourceFileMetadata(fileName)
    return {
      ...resourceMetadata,
      date: prettifyDate(resourceMetadata.date)
    }
  }
  if (isCollectionPage) {
    return { title: prettifyCollectionPageFileName(fileName), date: '' }
  }
  return { title: prettifyPageFileName(fileName), date: '' }
}

const getBackButtonInfo = (resourceCategory, collectionName, siteName) => {
  if (resourceCategory) return {
    backButtonLabel: resourceCategory,
    backButtonUrl: `/sites/${siteName}/resources/${resourceCategory}`,
  }
  if (collectionName) return {
    backButtonLabel: collectionName,
    backButtonUrl: `/sites/${siteName}/folder/${collectionName}`,
  }
  return {
    backButtonLabel: 'My Workspace',
    backButtonUrl: `/sites/${siteName}/workspace`,
  }
}

const EditPage = ({ match, isResourcePage, isCollectionPage, history, type }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()
  const { setRedirectToNotFound } = useRedirectHook()

  const { collectionName, fileName, siteName, resourceName, subfolderName } = match.params;
  const apiEndpoint = getApiEndpoint(isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName)
  const { title, type: resourceType, date } = extractMetadataFromFilename(isResourcePage, isCollectionPage, fileName)
  const { backButtonLabel, backButtonUrl } = getBackButtonInfo(resourceName, collectionName, siteName)

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
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState('')

  const mdeRef = useRef()

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

      let content, sha
      try {
        const resp = await axios.get(apiEndpoint);
        const { content:pageContent, sha:pageSha } = resp.data;
        content = pageContent
        sha = pageSha
      } catch (error) {
        if (error?.response?.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast(`There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`)
        }
        console.log(error)
      }
      
      if (!content) return
      
      try {
        // split the markdown into front matter and content
        const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
        
        // retrieve CSP
        const cspResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`);
        const { netlifyTomlHeaderValues } = cspResp.data;
        const csp = new Policy(netlifyTomlHeaderValues['Content-Security-Policy']);

        let leftNavPages
        if (isCollectionPage) {
          const dirResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/collection.yml`)
          const { content:dirContent, sha:dirSha } = dirResp.data
          const parsedFolderContents = parseDirectoryFile(dirContent)
          leftNavPages = parsedFolderContents.map((name) => 
            ({
              fileName: name.includes('/') ? name.split('/')[1] : name,
              third_nav_title: name.includes('/') ? name.split('/')[0] : null,
            })
          )
        }

        if (_isMounted) {
          setCsp(csp)
          setSha(sha)
          setOriginalMdValue(mdBody.trim())
          setEditorValue(mdBody.trim())
          setFrontMatter(frontMatter)
          setLeftNavPages(leftNavPages)
          setIsLoadingPageContent(false)
        }
      } catch (err) {
        errorToast(`There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`);
        console.log(err);
      }
    }

    loadPageDetails()
    return () => {
      _isMounted = false
    }
  }, [])

  useEffect(() => {
    const html = marked(editorValue)
    const { isCspViolation, sanitisedHtml } = checkCSP(csp, html)
    const chunk = prependImageSrc(siteName, sanitisedHtml)
    setIsCspViolation(isCspViolation)
    setChunk(chunk)
  }, [editorValue])

  const updatePage = async () => {
    try {
      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, editorValue);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const params = {
        content: base64Content,
        sha,
      };
      await axios.post(apiEndpoint, params);
      window.location.reload();
    } catch (err) {
      errorToast(`There was a problem saving your page. ${DEFAULT_RETRY_MSG}`);
      console.log(err);
    }
  }

  const deletePage = async () => {
    try {
      const params = { sha };
      await axios.delete(apiEndpoint, {
        data: params,
      });
      history.goBack();
    } catch (err) {
      errorToast(`There was a problem deleting your page. ${DEFAULT_RETRY_MSG}`);
      console.log(err);
    }
  }

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
    setIsFileStagedForUpload(true)
    setStagedFileDetails({
      path: `${baseFolder}%2F${fileName}`,
      content: fileData,
      fileName,
    })
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
        title={title}
        shouldAllowEditPageBackNav={originalMdValue === editorValue}
        isEditPage="true"
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        {
          isSelectingImage && (
          <MediaModal
            type="image"
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
              type="image"
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
                collection={deslugifyDirectory(collectionName)}
              />
            ) : (
              <SimplePage
                chunk={chunk}
                title={title}
                date={date}
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
          callback={updatePage}
        />
      </div>
      {
        canShowDeleteWarningModal
        && (
        <DeleteWarningModal
          onCancel={() => setCanShowDeleteWarningModal(false)}
          onDelete={deletePage}
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