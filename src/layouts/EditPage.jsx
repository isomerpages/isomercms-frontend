import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
import ImagesModal from '../components/ImagesModal';
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
import { getState, _replaceSelection } from '../utils/markdownUtils';
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: null,
      editorValue: '',
      frontMatter: '',
      imageUploadIsActive: false,
      imageUpload: {
        stateImage: '',
        optionsInsertText: '',
        selectedImage: '',
      },
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
      const { match } = this.props;
      const { siteName, fileName } = match.params;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  onEditorChange = (value) => {
    this.setState({ editorValue: value });
  }

  /**
   * Action for drawing an img.
   */
  // eslint-disable-next-line consistent-return
  drawImage = (editor) => {
    const { codemirror: cm, options } = editor;
    const stat = getState(cm);
    console.log(editor);
    this.toggleImageModal(stat.image, options.insertTexts.image.slice(0, 2));
  }

  toggleImageModal = (stateImage, optionsInsertText) => {
    this.setState((currState) => ({
      ...currState,
      imageUploadIsActive: !currState.imageUploadIsActive,
      imageUpload: {
        ...currState.imageUpload,
        stateImage,
        optionsInsertText,
      },
    }));
  }

  onImageClick = (filePath) => {
    const { imageUpload: { stateImage, optionsInsertText } } = this.state;
    const path = `/${filePath}`;
    _replaceSelection(this.mdeRef.current.simpleMde.codemirror, stateImage, optionsInsertText, path);
    this.toggleImageModal('', '');
    // set state so that rerender is triggered and image is shown
    this.setState((currState) => ({
      ...currState,
      editorValue: `${this.mdeRef.current.simpleMde.codemirror.getValue()}`,
    }));
  }

  render() {
    const { match } = this.props;
    const { siteName, fileName } = match.params;
    const { editorValue, imageUploadIsActive } = this.state;
    return (
      <>
        <Header
          title={prettifyPageFileName(fileName)}
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <div className={elementStyles.wrapper}>
          { imageUploadIsActive && (
            <ImagesModal
              siteName={siteName}
              onClose={() => this.toggleImageModal('', '')}
              onImageSelect={this.onImageClick}
            />
          )}
          <div className={editorStyles.pageEditorSidebar}>
            <SimpleMDE
              id="simplemde-editor"
              onChange={this.onEditorChange}
              ref={this.mdeRef}
              value={editorValue}
              options={{
                insertTexts: {
                  image: ['![](', '#url#)\n'],
                },
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
                    action: this.drawImage,
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
          <button type="button" className={elementStyles.blue} onClick={this.updatePage}>Save</button>
          <button type="button" className={elementStyles.warning} onClick={this.deletePage}>Delete</button>
        </div>
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
};
