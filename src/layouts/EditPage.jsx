import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
import ImagesModal from '../components/ImagesModal';
import MediaSettingsModal from '../components/media/SettingsModal';

import {
  frontMatterParser, concatFrontMatterMdBody, prependImageSrc, prettifyPageFileName,
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

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: null,
      editorValue: '',
      frontMatter: '',
      canShowDeleteWarningModal: false,
      images: [],
      isSelectingImage: false,
      pendingImageUpload: null
    };
    this.mdeRef = React.createRef();
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;

      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
      this.setState({
        sha,
        editorValue: mdBody.trim(),
        frontMatter,
      });
    } catch (err) {
      console.log(err);
    }
  }

  getImages = async (siteName) => {
    const { data: { images } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
      withCredentials: true,
    });
    this.setState({ images });
  }

  updatePage = async () => {
    try {
      const { match } = this.props;
      const { siteName, fileName } = match.params;
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
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, {
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
      const { match, history } = this.props;
      const { siteName, fileName } = match.params;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
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

  onImageClick = (filePath) => {
    const path = `/${filePath}`;
    const cm = this.mdeRef.current.simpleMde.codemirror;
    cm.replaceSelection(`![](${path})`);
    // set state so that rerender is triggered and image is shown
    this.setState({
      editorValue: this.mdeRef.current.simpleMde.codemirror.getValue(),
      isSelectingImage: false,
    });
  }

  uploadImage = async (imageName, imageContent) => {
    try {
      // toggle state so that image renaming modal appears
      this.setState({
        pendingImageUpload: {
          fileName: imageName,
          path: `images%2F${imageName}`,
          content: imageContent,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  readImageToUpload = async (event) => {
    const imgReader = new FileReader();
    const imgName = event.target.files[0].name;
    imgReader.onload = (() => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];
      this.uploadImage(imgName, imgData);
    });
    imgReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const { match } = this.props;
    const { siteName, fileName } = match.params;
    const { editorValue, canShowDeleteWarningModal, images, isSelectingImage, pendingImageUpload } = this.state;
    return (
      <>
        <Header
          title={prettifyPageFileName(fileName)}
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <div className={elementStyles.wrapper}>
          { isSelectingImage && (
            <ImagesModal
              siteName={siteName}
              onClose={() => this.setState({ isSelectingImage: false })}
              images={images}
              onImageSelect={this.onImageClick}
              readImageToUpload={this.readImageToUpload}
            />
          )}
          <div className={editorStyles.pageEditorSidebar}>
            <SimpleMDE
              id="simplemde-editor"
              onChange={this.onEditorChange}
              ref={this.mdeRef}
              value={editorValue}
              options={{
                toolbar: [
                  boldButton,
                  italicButton,
                  strikethroughButton,
                  headingButton,
                  '|',
                  codeButton,
                  quoteButton,
                  unorderedListButton,
                  orderedListButton,
                  '|',
                  {
                    name: 'image',
                    action: async () => {
                      await this.getImages(siteName);
                      this.setState({ isSelectingImage: true })
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
            <SimplePage chunk={prependImageSrc(siteName, marked(editorValue))} title={prettifyPageFileName(fileName)} />
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
          pendingImageUpload
          && (
          <MediaSettingsModal
            type="image"
            media={pendingImageUpload}
            siteName={siteName}
            // eslint-disable-next-line react/jsx-boolean-value
            isPendingUpload={true}
            onClose={() => {
              this.getImages(siteName);
              this.setState({ pendingImageUpload: null });
            }}
            toReload={false}
          />
          )
        }
        {
          canShowDeleteWarningModal
          && (
          <DeleteWarningModal
            onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
            onDelete={this.deletePage}
            type="page"
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
};
