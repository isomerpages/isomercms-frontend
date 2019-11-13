import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import {
  prettifyPageFileName, frontMatterParser, concatFrontMatterMdBody, generatePageFileName,
} from '../utils';

export default class PageCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: '',
      title: '',
      permalink: '',
      settingsIsActive: false,
      mdBody: null,
    };
  }

  async componentDidMount() {
    try {
      const { siteName, fileName } = this.props;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
        withCredentials: true,
      });
      const { sha, content } = resp.data;

      // split the markdown into front matter and content
      const { frontMatter, mdBody } = frontMatterParser(Base64.decode(content));
      const { title, permalink } = frontMatter;
      this.setState({
        sha, title, permalink, mdBody,
      });
    } catch (err) {
      console.log(err);
    }
  }

  saveHandler = async () => {
    try {
      const { siteName, fileName } = this.props;
      const {
        sha, title, permalink, mdBody,
      } = this.state;

      const frontMatter = { title, permalink };

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, mdBody);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const newFileName = generatePageFileName(title);

      // A new file does not need to be created; the title has not changed
      if (newFileName === fileName) {
        const params = {
          content: base64Content,
          sha,
        };

        // Update existing file
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, params, {
          withCredentials: true,
        });
      } else {
        // A new file needs to be created
        // Delete existing page
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
          data: { sha },
          withCredentials: true,
        });

        // Create new page
        const params = {
          pageName: newFileName,
          content: base64Content,
        };

        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages`, params, {
          withCredentials: true,
        });
      }

      // Refresh page
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async () => {
    try {
      const { siteName, fileName } = this.props;
      const { sha } = this.state;
      const params = { sha };
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  }

  settingsToggle = () => {
    this.setState((currState) => ({
      settingsIsActive: !currState.settingsIsActive,
    }));
  }

  render() {
    const { siteName, fileName } = this.props;
    const { settingsIsActive, title, permalink } = this.state;
    return (
      <li>
        <Link to={`/sites/${siteName}/pages/${fileName}`}>{prettifyPageFileName(fileName)}</Link>

        <button type="button" onClick={this.settingsToggle}>
          <i className="bx bx-cog" />
          {' '}
Settings
        </button>
        { settingsIsActive
          ? (
            <>
              <p>Title</p>
              <input defaultValue={title} id="title" onChange={this.changeHandler} />
              <p>Permalink</p>
              <input defaultValue={permalink} id="permalink" onChange={this.changeHandler} />
              <button type="button" onClick={this.saveHandler}>Save</button>
              <button type="button" onClick={this.deleteHandler}>Delete</button>
            </>
          )
          : null}
      </li>
    );
  }
}

PageCard.propTypes = {
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
};
