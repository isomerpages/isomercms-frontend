import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { prettifyResourceFileName } from '../utils';
import '../styles/isomer-template.scss';
import TemplateResourceCard from '../templates/ResourceCard';

export default class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceCategories: [],
      resourcePages: [],
      newPageName: null,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;

      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources: resourceCategories } = resourcesResp.data

      const resourcePagesArray = await Bluebird.map(resourceCategories, async (resourceCategory) => {
        const resourcePagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory.dirName}`, {
          withCredentials: true,
        })
        const { resourcePages } = resourcePagesResp.data

        return resourcePages.map(resourcePage => {
          const { title, date, type } = prettifyResourceFileName(resourcePage.fileName)
          return { title, date, type, fileName: resourcePage.fileName, category: resourceCategory.dirName }
        })
      }, { concurrency: 10})
      
      const resourcePages = _.compact(_.flattenDeep(resourcePagesArray))

      this.setState({ resourceCategories, resourcePages });
    } catch (err) {
      console.log(err);
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault();
    this.setState({ newPageName: event.target.value });
  }

  settingsToggle = async (event) => {
    this.setState((currState) => ({
      settingsIsActive: !currState.settingsIsActive
    }))
  }

  render() {
    const { resourceCategories, resourcePages, newPageName } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;
    return (
      <div>
        <Link to="/sites">Back to Sites</Link>
        <hr />
        <h2>{siteName}</h2>
        <ul>
          <li>
            <Link to={`/sites/${siteName}/pages`}>Pages</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/collections`}>Collections</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/images`}>Images</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/files`}>Files</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/menus`}>Menus</Link>
          </li>
        </ul>
        <hr />
        <h3>Resource Pages</h3>
        {/* Display resource cards */}
        {resourcePages.length > 0 ?
          <>
          {resourcePages.map(resourcePage => (
            <TemplateResourceCard 
              type={resourcePage.type}
              category={resourcePage.category}
              title={resourcePage.title}
              date={resourcePage.date}
              fileName={resourcePage.fileName}
              siteName={siteName}
              resourceCategories={resourceCategories}
              isNewPost={false}
            />
          ))}
          </>
        :
          null
        }
        <TemplateResourceCard 
          siteName={siteName}
          resourceCategories={resourceCategories}
          isNewPost={true}
        />
        <br />
        <input placeholder="New page name" onChange={this.updateNewPageName} />
        <Link to={`/sites/${siteName}/pages/${newPageName}`}>Create new page</Link>
      </div>
    );
  }
}

Resources.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
