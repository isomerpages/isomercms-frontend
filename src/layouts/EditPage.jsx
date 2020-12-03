import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import Bluebird from 'bluebird';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
import LeftNavPage from '../templates/LeftNavPage';
import { checkCSP } from '../utils/cspUtils';
import Policy from 'csp-parse';
import { toast } from 'react-toastify';
import Toast from '../components/Toast';

import {
  DEFAULT_ERROR_TOAST_MSG,
  frontMatterParser,
  concatFrontMatterMdBody,
  prependImageSrc,
  prettifyPageFileName,
  prettifyCollectionPageFileName,
  retrieveResourceFileMetadata,
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
  linkButton,
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
import MediasModal from '../components/media/MediaModal';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

// axios settings
axios.defaults.withCredentials = true

const getApiEndpoint = (isResourcePage, isCollectionPage, { collectionName, fileName, siteName, resourceName }) => {
  if (isCollectionPage) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${fileName}`
  }
  if (isResourcePage) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`
}

const extractMetadataFromFilename = (isResourcePage, isCollectionPage, fileName) => {
  if (isResourcePage) {
    return retrieveResourceFileMetadata(fileName)
  }
  if (isCollectionPage) {
    return { title: prettifyCollectionPageFileName(fileName), date: '' }
  }
  return { title: prettifyPageFileName(fileName), date: '' }
}

// Remove `/pages/${fileName}' from api endpoint
const getCollectionsApiEndpoint = (endpoint) => {
  const endpointArr = endpoint.split('/')
  return endpointArr.slice(0, endpointArr.length - 2).join('/')
}

const getBackButtonInfo = (resourceCategory, collectionName, siteName) => {
  if (resourceCategory) return {
    backButtonLabel: resourceCategory,
    backButtonUrl: `/sites/${siteName}/resources/${resourceCategory}`,
  }
  if (collectionName) return {
    backButtonLabel: collectionName,
    backButtonUrl: `/sites/${siteName}/collections/${collectionName}`,
  }
  return {
    backButtonLabel: 'My Workspace',
    backButtonUrl: `/sites/${siteName}/workspace`,
  }
}

export default class EditPage extends Component {
  _isMounted = true 

  constructor(props) {
    super(props);
    const { match, isResourcePage, isCollectionPage } = this.props;
    const { collectionName, fileName, siteName, resourceName } = match.params;
    this.state = {
      csp: new Policy(),
      sha: null,
      originalMdValue: '',
      editorValue: '',
      frontMatter: '',
      canShowDeleteWarningModal: false,
      images: [],
      isSelectingImage: false,
      isInsertingHyperlink: false,
      pendingImageUpload: null,
      selectedImage: '',
      selectionText: '',
      isFileStagedForUpload: false,
      stagedFileDetails: {},
      isLoadingPageContent: true,
      shouldRedirect: false,
    };
    this.mdeRef = React.createRef();
    this.apiEndpoint = getApiEndpoint(isResourcePage, isCollectionPage, { collectionName, fileName, siteName, resourceName })
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const resp = await axios.get(this.apiEndpoint);
      const { content, sha } = resp.data;

      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
     
      const { match } = this.props;
      const { siteName } = match.params;
      
      // retrieve CSP
      const cspResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`);
      const { netlifyTomlHeaderValues } = cspResp.data;
      const csp = new Policy(netlifyTomlHeaderValues['Content-Security-Policy']);

      let leftNavPages
      if (this.props.isCollectionPage) {
        const collectionsApiEndpoint = getCollectionsApiEndpoint(this.apiEndpoint)
        const collectionPagesResp = await axios.get(collectionsApiEndpoint);
        const collectionResp = collectionPagesResp.data?.collectionPages;

        // Retrieve third_nav_title from collection pages
        leftNavPages = await Bluebird.map(collectionResp, async (collectionPage) => {
          const collectionPageResp = await axios.get(`${collectionsApiEndpoint}/pages/${collectionPage.fileName}`)
          const { content } = collectionPageResp.data;
          const { frontMatter } = frontMatterParser(Base64.decode(content));
          return {
            ...collectionPage,
            third_nav_title: frontMatter.third_nav_title,
          }
        });
      }

      if (this._isMounted) this.setState({
        csp,
        sha,
        originalMdValue: mdBody.trim(),
        editorValue: mdBody.trim(),
        frontMatter,
        leftNavPages,
        isLoadingPageContent: false,
      });
    } catch (err) {
      console.log(err);
      this.setState({ shouldRedirect: true })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updatePage = async () => {
    try {
      const { state } = this;
      const { editorValue, frontMatter } = state;

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, editorValue);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const params = {
        content: base64Content,
        sha: state.sha,
      };
      const resp = await axios.post(this.apiEndpoint, params);
      const { sha } = resp.data;
      this.setState({ sha });

      window.location.reload();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem saving your page. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
      console.log(err);
      this.setState({ shouldRedirect: true })
    }
  }

  deletePage = async () => {
    try {
      const { history } = this.props;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(this.apiEndpoint, {
        data: params,
      });
      history.goBack();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem deleting your page. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
      console.log(err);
      this.setState({ shouldRedirect: true })
    }
  }

  onEditorChange = (value) => {
    this.setState({ editorValue: value });
  }

  toggleImageModal = () => {
    this.setState((currState) => ({
      isSelectingImage: !currState.isSelectingImage,
    }));
  }

  toggleImageAndSettingsModal = () => {
    this.setState((currState) => ({
      isSelectingImage: !currState.isSelectingImage,
      isFileStagedForUpload: !currState.isFileStagedForUpload,
    }));
  }

  onHyperlinkOpen = () => {
    const cm = this.mdeRef.current.simpleMde.codemirror;
    this.setState({
      selectionText: cm.getSelection() || '', 
      isInsertingHyperlink: true,
    });
  }

  onHyperlinkSave = (text, link) => {
    const cm = this.mdeRef.current.simpleMde.codemirror;
    cm.replaceSelection(`[${text}](${link})`);
    // set state so that rerender is triggered and path is shown
    this.setState({
      editorValue: this.mdeRef.current.simpleMde.codemirror.getValue(),
      isInsertingHyperlink: false,
      selectionText: '',
    });
  }

  onHyperlinkClose = () => {
    this.setState({
      isInsertingHyperlink: false,
      selectionText: '',
    });
  }

  onImageClick = (path) => {
    const cm = this.mdeRef.current.simpleMde.codemirror;
    cm.replaceSelection(`![](${path})`);
    // set state so that rerender is triggered and image is shown
    this.setState({
      editorValue: this.mdeRef.current.simpleMde.codemirror.getValue(),
      isSelectingImage: false,
    });
  }

  stageFileForUpload = (fileName, fileData) => {
    const { type } = this.props;
    const baseFolder = type === 'file' ? 'files' : 'images';
    this.setState({
      isFileStagedForUpload: true,
      stagedFileDetails: {
        path: `${baseFolder}%2F${fileName}`,
        content: fileData,
        fileName,
      },
    });
  }

  readFileToStageUpload = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the image
         * fileReader returns  `data:application/pdf;base64, {fileContent}`
         * hence the split
         */

      const fileData = fileReader.result.split(',')[1];
      this.stageFileForUpload(fileName, fileData);
    });
    fileReader.readAsDataURL(event.target.files[0]);
    this.toggleImageModal()
  }

  render() {
    const { match, isCollectionPage, isResourcePage } = this.props;
    const { siteName, fileName, collectionName, resourceName } = match.params;
    const { title, date } = extractMetadataFromFilename(isResourcePage, isCollectionPage, fileName)
    const { backButtonLabel, backButtonUrl } = getBackButtonInfo(resourceName, collectionName, siteName)
    const {
      csp,
      originalMdValue,
      editorValue,
      canShowDeleteWarningModal,
      isSelectingImage,
      isInsertingHyperlink,
      isFileStagedForUpload,
      stagedFileDetails,
      leftNavPages,
      selectionText,
      isLoadingPageContent,
    } = this.state;

    const html = marked(editorValue)
    const { isCspViolation, sanitisedHtml } = checkCSP(csp, html)
    const chunk = prependImageSrc(siteName, sanitisedHtml)

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
            <MediasModal
              type="image"
              siteName={siteName}
              onMediaSelect={this.onImageClick}
              toggleImageModal={this.toggleImageModal}
              readFileToStageUpload={this.readFileToStageUpload}
              onClose={() => this.setState({ isSelectingImage: false })}
            />
            )
          }
          {
            isFileStagedForUpload && (
              <MediaSettingsModal
                type="image"
                siteName={siteName}
                onClose={() => this.setState({ isFileStagedForUpload: false })}
                onSave={this.toggleImageAndSettingsModal}
                media={stagedFileDetails}
                isPendingUpload="true"
              />
            )
          }
          {
            isInsertingHyperlink && (
            <HyperlinkModal
              text={selectionText}
              onSave={this.onHyperlinkSave}
              onClose={this.onHyperlinkClose}
            />
            )
          }
          <div className={`${editorStyles.pageEditorSidebar} ${isLoadingPageContent ? editorStyles.pageEditorSidebarLoading : null}`} >
            {
              isLoadingPageContent
              ? (
                <div className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`} />
              ) : ''
            }
            <SimpleMDE
              id="simplemde-editor"
              className="h-100"
              onChange={this.onEditorChange}
              ref={this.mdeRef}
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
                      this.setState({ isSelectingImage: true });
                    },
                    className: 'fa fa-picture-o',
                    title: 'Insert Image',
                    default: true,
                  },
                  {
                    name: 'link',
                    action: async () => { 
                      this.onHyperlinkOpen() 
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
          <div className={editorStyles.pageEditorMain}>
            {
              isCollectionPage && leftNavPages
              ? (
                <LeftNavPage
                  chunk={chunk}
                  leftNavPages={leftNavPages}
                  fileName={fileName}
                  title={title}
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
          <button type="button" className={elementStyles.warning} onClick={() => this.setState({ canShowDeleteWarningModal: true })}>Delete</button>
          <LoadingButton
            label="Save"
            disabledStyle={elementStyles.disabled}
            disabled={isCspViolation}
            className={isCspViolation ? elementStyles.disabled : elementStyles.blue}
            callback={this.updatePage}
          />
        </div>
        {
          canShowDeleteWarningModal
          && (
          <DeleteWarningModal
            onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
            onDelete={this.deletePage}
            type={isResourcePage ? 'resource' : 'page'}
          />
          )
        }
        {
          this.state.shouldRedirect &&
          <Redirect
            to={{
                pathname: '/not-found'
            }}
          />
        }
      </>
    );
  }
}

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
