import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { prettifyResourceCategory, slugifyResourceCategory } from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// Constants
const RADIX_PARSE_INT = 10;
const NEW_CATEGORY_STR = 'newcategory';

export default class ResourceCategoryModal extends Component {
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
      const { resources } = resourcesResp.data;
      const resourceCategories = resources.map((resource) => resource.dirName);

      this.setState({ resourceCategories });
    } catch (err) {
      console.log(err);
    }
  }

  // Create new category
  createHandler = () => {
    this.setState((currState) => ({
      resourceCategories: update(currState.resourceCategories, {
        $push: [NEW_CATEGORY_STR],
      }),
    }));
  }

  // Save changes to the resource category
  saveHandler = async (event) => {
    try {
      const { siteName } = this.props;
      const { resourceCategories } = this.state;
      const { id } = event.target;
      const idArray = id.split('-');
      const categoryIndex = parseInt(idArray[1], RADIX_PARSE_INT);
      const resourceCategory = slugifyResourceCategory(resourceCategories[categoryIndex]);
      const newResourceCategory = slugifyResourceCategory(this.currInputValues[categoryIndex].value); // eslint-disable-line max-len

      // If the category is a new one
      if (resourceCategory === NEW_CATEGORY_STR) {
        const params = {
          resourceName: newResourceCategory,
        };
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, params, {
          withCredentials: true,
        });
      } else {
        // Rename resource category
        const params = {};
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}/rename/${newResourceCategory}`, params, {
          withCredentials: true,
        });
      }

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async (event) => {
    try {
      const { siteName } = this.props;
      const { resourceCategories } = this.state;
      const { id } = event.target;
      const idArray = id.split('-');
      const categoryIndex = parseInt(idArray[1], RADIX_PARSE_INT);
      const resourceCategory = slugifyResourceCategory(resourceCategories[categoryIndex]);

      // Check if there are resourcePages in the category; if there are, do not allow deletion
      const resourcesPagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}`, {
        withCredentials: true,
      });
      const { resourcePages } = resourcesPagesResp.data;
      if (resourcePages.length > 0) throw new Error('There is at least one post or download associated with the resource category');

      // Delete resource category
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceCategory}`, {
        data: {},
        withCredentials: true,
      });

      // Get updated resourceCategories to set in state
      const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, {
        withCredentials: true,
      });
      const { resources } = resourcesResp.data;
      const newResourceCategories = resources.map((resource) => resource.dirName);

      this.setState({ resourceCategories: newResourceCategories });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { resourceCategories } = this.state;
    const { categoryModalToggle, categoryModalIsActive } = this.props;
    return (
      <div>
        <button type="button" className={elementStyles.blue} onClick={categoryModalToggle}>Edit Categories</button>
        {categoryModalIsActive
          ? (
            <div className={elementStyles.overlay}>
              <div className={elementStyles.modal}>
                <div className={elementStyles.modalHeader}>
                  <h1>Edit Resource Categories</h1>
                  <button id="settings-CLOSE" type="button" onClick={categoryModalToggle}>
                    <i id="settingsIcon-CLOSE" className="bx bx-x" />
                  </button>
                </div>
                <div className={elementStyles.modalContent}>
                {resourceCategories.length > 0
                  ? resourceCategories.map((resourceCategory, index) => (
                    <div key={resourceCategory}>
                      <input
                        type="text"
                        id={`input-${index}`}
                        defaultValue={prettifyResourceCategory(resourceCategory)}
                        style={{ textTransform: 'uppercase' }}
                        ref={(node) => { this.currInputValues[index] = node; }}
                      />
                      <button type="button" className={elementStyles.blue} id={`save-${index}-${resourceCategory}`} onClick={this.saveHandler}>Save</button>
                      <button type="button" className={elementStyles.blue} id={`delete-${index}-${resourceCategory}`} onClick={this.deleteHandler}>Delete</button>
                    </div>
                  ))
                  : null}
                <button type="button" onClick={this.createHandler}>Create Category</button>
                </div>
              </div>
            </div>
          )
          : null}
      </div>
    );
  }
}

ResourceCategoryModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  categoryModalIsActive: PropTypes.bool.isRequired,
  categoryModalToggle: PropTypes.func.isRequired,
};
