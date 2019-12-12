import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
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

/**
 * Action for drawing an img.
 */
// eslint-disable-next-line consistent-return
export function drawImage(editor) {
  const { codemirror: cm, options } = editor;
  const stat = getState(cm);
  _replaceSelection(cm, stat.image, options.insertTexts.image, 'abc.com');
}

export default class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: null,
      editorValue: '',
      frontMatter: '',
    };
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

  render() {
    const { match } = this.props;
    const { siteName, fileName } = match.params;
    const { editorValue } = this.state;
    return (
      <>
        <Header
          title={prettifyPageFileName(fileName)}
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.pageEditorSidebar}>
            <SimpleMDE
              id="simplemde-editor"
              onChange={this.onEditorChange}
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
                    action: drawImage,
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
