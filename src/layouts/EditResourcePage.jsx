import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import PropTypes from 'prop-types';
import SimpleMDE from 'react-simplemde-editor';
import marked from 'marked';
import { Base64 } from 'js-base64';
import SimplePage from '../templates/SimplePage';
import {
  frontMatterParser, concatFrontMatterMdBody, prependImageSrc, prettifyResourceFileName,
} from '../utils';
import 'easymde/dist/easymde.min.css';
import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';
import DeleteWarningModal from '../components/DeleteWarningModal';

export default class EditResourcePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: null,
      editorValue: '',
      frontMatter: '',
      canShowDeleteWarningModal: false,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName, resourceName, fileName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`, {
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
      const { siteName, resourceName, fileName } = match.params;
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
      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`, params, {
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
      const { match, history } = this.props;
      const { siteName, resourceName, fileName } = match.params;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`, {
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

  render() {
    const { match } = this.props;
    const { siteName, fileName, resourceName } = match.params;
    const { editorValue, canShowDeleteWarningModal } = this.state;
    return (
      <>
        <Header
          title={`${prettifyResourceFileName(fileName).title} in ${resourceName}`}
          backButtonText="Back to Resources"
          backButtonUrl={`/sites/${siteName}/resources`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.pageEditorSidebar}>
            <SimpleMDE
              onChange={this.onEditorChange}
              value={editorValue}
              options={{
                hideIcons: ['preview', 'side-by-side', 'fullscreen'],
                showIcons: ['code', 'table'],
              }}
            />
          </div>
          <div className={editorStyles.pageEditorMain}>
            <SimplePage chunk={prependImageSrc(siteName, marked(editorValue))} title={`${prettifyResourceFileName(fileName).title} in ${resourceName}`} />
          </div>
        </div>
        <div className={editorStyles.pageEditorFooter}>
          <button type="button" className={elementStyles.blue} onClick={this.updatePage}>Save</button>
          <button type="button" className={elementStyles.warning} onClick={() => this.setState({ canShowDeleteWarningModal: true })}>Delete</button>
        </div>
        {
          canShowDeleteWarningModal
          && (
            <DeleteWarningModal
              onCancel={() => this.setState({ canShowDeleteWarningModal: false })}
              onDelete={this.deletePage}
              type="resource"
            />
          )
        }
      </>
    );
  }
}

EditResourcePage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
      fileName: PropTypes.string,
      resourceName: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
};
