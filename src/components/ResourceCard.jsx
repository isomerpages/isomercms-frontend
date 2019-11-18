import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import {
  prettifyResourceCategory,
  slugifyResourceCategory,
  frontMatterParser,
  concatFrontMatterMdBody,
  enquoteString,
  dequoteString,
  generateResourceFileName,
} from '../utils';

const ResourceCardModal = ({
  title,
  category,
  date,
  permalink,
  fileUrl,
  resourceCategories,
  changeHandler,
  saveHandler,
  deleteHandler,
  permalinkFileUrlToggle,
  isNewPost,
}) => (
  <div>
    <p>Category</p>
    <select id="category" defaultValue={slugifyResourceCategory(category)} onChange={changeHandler}>
      {
        resourceCategories.map((resourceCategory) => (
          <option
            value={slugifyResourceCategory(resourceCategory.dirName)}
            label={prettifyResourceCategory(resourceCategory.dirName)}
          />
        ))
      }
    </select>
    <p>Title</p>
    <input value={dequoteString(title)} id="title" onChange={changeHandler} />
    <p>Date</p>
    <input value={date} id="date" onChange={changeHandler} />
    <button type="button" onClick={permalinkFileUrlToggle}>{permalink ? 'Switch to download' : 'Switch to post'}</button>
    {permalink
      ? (
        <>
          <p>Permalink</p>
          <input value={permalink} id="permalink" onChange={changeHandler} />
        </>
      )
      : (
        <>
          <p>File URL</p>
          <input value={fileUrl} id="fileUrl" onChange={changeHandler} />
        </>
      )}
    <button type="button" onClick={saveHandler}>Save</button>
    { !isNewPost
      ? <button type="button" onClick={deleteHandler}>Delete</button>
      : null}
  </div>
);

export default class ResourceCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      permalink: null,
      fileUrl: null,
      date: '',
      settingsIsActive: false,
      mdBody: null,
      category: null,
      sha: '',
    };
  }

  async componentDidMount() {
    try {
      const {
        category, siteName, fileName, isNewPost,
      } = this.props;
      if (isNewPost) {
        const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
          withCredentials: true,
        });
        const { resources: resourceCategories } = resourcesResp.data;

        this.setState({
          title: 'TITLE',
          permalink: 'PERMALINK',
          date: 'DATE',
          mdBody: '',
          category: resourceCategories[0].dirName,
        });
      } else {
        const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
          withCredentials: true,
        });

        const { content, sha } = resp.data;
        const base64DecodedContent = Base64.decode(content);
        const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
        const {
          title, permalink, file_url: fileUrl, date,
        } = frontMatter;

        this.setState({
          title, permalink, fileUrl, date, sha, mdBody, category,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  settingsToggle = () => {
    this.setState((currState) => ({
      settingsIsActive: !currState.settingsIsActive,
    }));
  }

  permalinkFileUrlToggle = () => {
    const { permalink } = this.state;
    if (permalink) {
      this.setState({ permalink: null, fileUrl: 'FILE_URL' });
    } else {
      this.setState({ permalink: 'PERMALINK', fileUrl: null });
    }
  }

  deleteHandler = async () => {
    try {
      const { sha } = this.state;
      const { category, fileName, siteName } = this.props;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async () => {
    try {
      const {
        title, permalink, fileUrl, date, mdBody, sha, category,
      } = this.state;
      const { fileName, siteName, isNewPost } = this.props;

      const frontMatter = { title: enquoteString(title), date };
      let type = '';
      if (permalink) {
        frontMatter.permalink = permalink;
        type = 'post';
      }
      if (fileUrl) {
        frontMatter.file_url = fileUrl;
        type = 'download';
      }

      const content = concatFrontMatterMdBody(frontMatter, mdBody);
      const base64EncodedContent = Base64.encode(content);

      const newFileName = generateResourceFileName(dequoteString(title), type, date);
      let params = {};

      if (newFileName !== fileName) {
        // We'll need to create a new .md file with a new filename
        params = {
          content: base64EncodedContent,
          pageName: newFileName,
        };

        // If it is an existing post, delete the existing page
        if (!isNewPost) {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, {
            data: {
              sha,
            },
            withCredentials: true,
          });
        }

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages`, params, {
          withCredentials: true,
        });
      } else {
        // Save to existing .md file
        params = {
          content: base64EncodedContent,
          sha,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      }

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  render() {
    const {
      type,
      category,
      title,
      date,
      siteName,
      fileName,
      resourceCategories,
      isNewPost,
    } = this.props;
    const {
      settingsIsActive,
      title: stateTitle,
      category: stateCategory,
      date: stateDate,
      permalink: statePermalink,
      fileUrl: stateFileUrl,
    } = this.state;
    return (
      <div>
        { isNewPost
          ? 
          <>
            <button type="button" onClick={this.settingsToggle}>Create New Post</button>
          </>
          : (
            <>
              <p>
Category:
                {prettifyResourceCategory(category)}
              </p>
              <p>
Title:
                {title}
              </p>
              <p>
Date:
                {date}
              </p>
              <p>
Type:
                {type}
              </p>
              <button type="button" onClick={this.settingsToggle}>Settings</button>
              <Link to={`/sites/${siteName}/resources/${category}/${fileName}`}>Edit</Link>
            </>
          )}
        {settingsIsActive
          ? (
            <ResourceCardModal
              title={stateTitle}
              category={stateCategory}
              date={stateDate}
              permalink={statePermalink}
              fileUrl={stateFileUrl}
              resourceCategories={resourceCategories}
              changeHandler={this.changeHandler}
              saveHandler={this.saveHandler}
              deleteHandler={this.deleteHandler}
              permalinkFileUrlToggle={this.permalinkFileUrlToggle}
              isNewPost={isNewPost}
            />
          )
          : null}
      </div>
    );
  }
}

ResourceCardModal.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  permalink: PropTypes.string.isRequired,
  fileUrl: PropTypes.string.isRequired,
  resourceCategories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  changeHandler: PropTypes.func.isRequired,
  saveHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  permalinkFileUrlToggle: PropTypes.func.isRequired,
  isNewPost: PropTypes.bool.isRequired,
};

ResourceCard.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  resourceCategories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  isNewPost: PropTypes.bool.isRequired,
};
