import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
import LeftNavPage from '../templates/LeftNavPage';

import {
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
import MediasModal from '../components/media/MediaModal';
import MediaSettingsModal from '../components/media/MediaSettingsModal';

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

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    const { match, isResourcePage, isCollectionPage } = this.props;
    const { collectionName, fileName, siteName, resourceName } = match.params;
    this.state = {
      sha: null,
      originalMdValue: '',
      editorValue: '',
      frontMatter: '',
      canShowDeleteWarningModal: false,
      images: [],
      isSelectingImage: false,
      pendingImageUpload: null,
      selectedImage: '',
      isFileStagedForUpload: false,
      stagedFileDetails: {},
    };
    this.mdeRef = React.createRef();
    this.apiEndpoint = getApiEndpoint(isResourcePage, isCollectionPage, { collectionName, fileName, siteName, resourceName })
  }

  async componentDidMount() {
    try {
      const resp = await axios.get(this.apiEndpoint, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;

      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));

      let leftNavPages
      if (this.props.isCollectionPage) {
        const collectionPagesResp = await axios.get(getCollectionsApiEndpoint(this.apiEndpoint), {
          withCredentials: true,
        });
        leftNavPages = collectionPagesResp.data?.collectionPages;
      }

      this.setState({
        sha,
        originalMdValue: mdBody.trim(),
        editorValue: mdBody.trim(),
        frontMatter,
        leftNavPages,
      });
    } catch (err) {
      console.log(err);
    }
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
      const resp = await axios.post(this.apiEndpoint, params, {
        withCredentials: true,
      });
      const { sha } = resp.data;
      this.setState({ sha });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  deletePage = async () => {
    try {
      const { history } = this.props;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(this.apiEndpoint, {
        data: params,
        withCredentials: true,
      });
      history.goBack();
    } catch (err) {
      console.log(err);
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
    const { siteName, fileName } = match.params;
    const { title, date } = extractMetadataFromFilename(isResourcePage, isCollectionPage, fileName)
    const {
      originalMdValue,
      editorValue,
      canShowDeleteWarningModal,
      isSelectingImage,
      isFileStagedForUpload,
      stagedFileDetails,
      leftNavPages,
    } = this.state;
    return (
      <>
        <Header
          title={title}
          shouldAllowEditPageBackNav={originalMdValue === editorValue}
          isEditPage="true"
          backButtonText={`Back to ${isResourcePage ? 'Resources' : 'Pages'}`}
          backButtonUrl={isResourcePage ?`/sites/${siteName}/resources` : `/sites/${siteName}/pages`}
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
          <div className={editorStyles.pageEditorSidebar}>
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
                  linkButton,
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
                  chunk={prependImageSrc(siteName, marked(editorValue))}
                  leftNavPages={leftNavPages}
                  fileName={fileName}
                  title={title}
                />
              ) : (
                <SimplePage
                  chunk={prependImageSrc(siteName, marked(editorValue))}
                  title={title}
                  date={date}
                />
              )
            }
          </div>
        </div>
        <div className={editorStyles.pageEditorFooter}>
          <LoadingButton
            label="Save"
            disabledStyle={elementStyles.disabled}
            className={elementStyles.blue}
            callback={this.updatePage}
          />
          <button type="button" className={elementStyles.warning} onClick={() => this.setState({ canShowDeleteWarningModal: true })}>Delete</button>
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
