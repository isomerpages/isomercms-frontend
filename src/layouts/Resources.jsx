import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { prettifyResourceFileName } from '../utils';
import TemplateResourceCard from '../templates/ResourceCard';
import update from 'immutability-helper';

const NEW_CATEGORY_STR = "newcategory"

class ResourceCategoryModal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      resourceCategories: [],
    };
    this.currInputValues = {};
  }

  async componentDidMount() {
    try {
      const { siteName } = this.props;
      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources } = resourcesResp.data
      const resourceCategories = resources.map(resource => resource.dirName)

      this.setState({ resourceCategories });
    } catch (err) {
      console.log(err);
    }
  }

  // Create new category
  createHandler = () => {
    this.setState(currState => ({
      resourceCategories: update(currState.resourceCategories, {
        $push: [NEW_CATEGORY_STR]
      })
    }))
  }

  // Save changes to the resource category
  saveHandler = async(event) => {
    try {
      const { siteName } = this.props;
      const { id } = event.target
      const idArray = id.split('-')
      const categoryIndex = idArray[1]
      const resourceCategory = idArray[2]
      const newResourceCategory = this.currInputValues[categoryIndex].value

      console.log(resourceCategory, newResourceCategory)

      // If the category is a new one
      if (resourceCategory === NEW_CATEGORY_STR) {
        const params = {
          resourceName: newResourceCategory
        }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, params, {
          withCredentials: true,
        });
      } else {
        // Rename resource category
        const params = {}
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}/rename/${newResourceCategory}`, params, {
          withCredentials: true,
        });
      }

      this.setState(currState => ({
        resourceCategories: update(currState.resourceCategories, {
          $splice: [[categoryIndex, 1, newResourceCategory]]
        })
      }))
    } catch (err) {
      console.log(err)
    }
  }

  deleteHandler = async(event) => {
    try {
      const { siteName } = this.props;
      const { id } = event.target
      const idArray = id.split('-')
      const resourceCategory = idArray[2]

      // Check if there are resourcePages in the category; if there are, do not allow deletion
      const resourcesPagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}`, {
        withCredentials: true,
      });
      const { resourcePages } = resourcesPagesResp.data
      if (resourcePages.length > 0) throw new Error('There is at least one post or download associated with the resource category')

      // Delete resource category
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}`, {
        data: {},
        withCredentials: true,
      });

      // Get updated resourceCategories to set in state
      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources } = resourcesResp.data
      const resourceCategories = resources.map(resource => resource.dirName)

      this.setState({ resourceCategories });
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    const { resourceCategories } = this.state;
    const { categoryModalToggle, categoryModalIsActive } = this.props;
    return (
      <div>
        <button type="button" onClick={categoryModalToggle}>Edit Categories</button>
        {categoryModalIsActive ? 
          <>
            {resourceCategories.length > 0 ?
              resourceCategories.map((resourceCategory, index) => (
                <div key={resourceCategory}>
                  <input type="text" id={`input-${index}`} defaultValue={resourceCategory} ref={(node) => { this.currInputValues[index] = node;}} />
                  <button type="button" key={`save-${resourceCategory}`} id={`save-${index}-${resourceCategory}`} onClick={this.saveHandler}>Save</button>
                  <button type="button" key={`delete-${resourceCategory}`} id={`delete-${index}-${resourceCategory}`} onClick={this.deleteHandler}>Delete</button>
                </div>
              ))
            :
              null
            }
            <button type="button" onClick={this.createHandler}>Create Category</button>
          </>
        :
          null 
        }
      </div>
    )
  }
}


export default class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceCategories: [],
      resourcePages: [],
      newPageName: null,
      categoryModalIsActive: false
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;

      // Get the resource categories in the resource room
      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources: resourceCategories } = resourcesResp.data

      // Obtain the title, date, type, fileName, category for all resource pages across all categories
      const resourcePagesArray = await Bluebird.map(resourceCategories, async (resourceCategory) => {
        const resourcePagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory.dirName}`, {
          withCredentials: true,
        })
        const { resourcePages } = resourcePagesResp.data

        if (resourcePages.length > 0) {
          return resourcePages.map(resourcePage => {
            const { title, date, type } = prettifyResourceFileName(resourcePage.fileName)
            return { title, date, type, fileName: resourcePage.fileName, category: resourceCategory.dirName }
          })
        }
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

  categoryModalToggle = () => {
    this.setState((currState) => ({
      categoryModalIsActive: !currState.categoryModalIsActive
    }))
  }

  render() {
    const { resourceCategories, resourcePages, newPageName, categoryModalIsActive } = this.state;
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
        {/* Manage resource categories */}
        <ResourceCategoryModal 
          siteName={siteName}
          resourceCategories={resourceCategories}
          categoryModalToggle={this.categoryModalToggle}
          categoryModalIsActive={categoryModalIsActive}
        />
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
