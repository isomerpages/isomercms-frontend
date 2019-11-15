import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { prettifyResourceCategory, slugifyResourceCategory } from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// Constants
const RADIX_PARSE_INT = 10;
const NEW_CATEGORY_STR = 'newcategory';
const CATEGORY_MIN_LENGTH = 2;
const CATEGORY_MAX_LENGTH = 30;
const CATEGORY_REGEX = '^(([a-zA-Z0-9]+([\\s][a-zA-Z0-9]+)*)+)$';
const categoryRegexTest = RegExp(CATEGORY_REGEX);

export default class ResourceCategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevResourceCategories: [],
      currResourceCategories: [],
      errors: {
        resourceCategories: [],
      },
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

      this.setState({
        prevResourceCategories: resourceCategories,
        currResourceCategories: resourceCategories,
        errors: {
          resourceCategories: Array(resources.length).fill(''),
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  // Create new category
  createHandler = () => {
    this.setState((currState) => ({
      prevResourceCategories: update(currState.prevResourceCategories, {
        $push: [NEW_CATEGORY_STR],
      }),
      errors: {
        resourceCategories: update(currState.errors.resourceCategories, {
          $push: [''],
        }),
      },
    }));
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    const idArray = id.split('-');
    const categoryIndex = parseInt(idArray[1], RADIX_PARSE_INT);

    let errorMessage = '';
    // Resource category is too short
    if (value.length < CATEGORY_MIN_LENGTH) {
      errorMessage = `The resource category should be longer than ${CATEGORY_MIN_LENGTH} characters.`;
    }
    // Resource category is too long
    if (value.length > CATEGORY_MAX_LENGTH) {
      errorMessage = `The resource category should be shorter than ${CATEGORY_MAX_LENGTH} characters.`;
    }
    // Resource category fails regex
    if (!categoryRegexTest.test(value)) {
      errorMessage = 'The resource category should only have alphanumeric characters separated by whitespace.';
    }

    this.setState((currState) => ({
      currResourceCategories: update(currState.currResourceCategories, {
        $splice: [[categoryIndex, 1, slugifyResourceCategory(value)]],
      }),
      errors: {
        resourceCategories: update(currState.errors.resourceCategories, {
          $splice: [[categoryIndex, 1, errorMessage]],
        }),
      },
    }));
  }

  // Save changes to the resource category
  saveHandler = async (event) => {
    try {
      const { siteName } = this.props;
      const { prevResourceCategories, currResourceCategories } = this.state;
      const { id } = event.target;
      const idArray = id.split('-');
      const categoryIndex = parseInt(idArray[1], RADIX_PARSE_INT);
      const prevResourceCategory = slugifyResourceCategory(prevResourceCategories[categoryIndex]);
      const newResourceCategory = slugifyResourceCategory(currResourceCategories[categoryIndex]); // eslint-disable-line max-len

      console.log(categoryIndex, prevResourceCategory, newResourceCategory, 'here');
      // If the category is a new one
      if (prevResourceCategory === NEW_CATEGORY_STR) {
        console.log('newcategory', prevResourceCategory);
        const params = {
          resourceName: newResourceCategory,
        };
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`, params, {
          withCredentials: true,
        });
      } else {
        // Rename resource category
        const params = {};
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${prevResourceCategory}/rename/${newResourceCategory}`, params, {
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
      const { prevResourceCategories } = this.state;
      const { id } = event.target;
      const idArray = id.split('-');
      const categoryIndex = parseInt(idArray[1], RADIX_PARSE_INT);
      const resourceCategory = slugifyResourceCategory(prevResourceCategories[categoryIndex]);

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

      this.setState({
        prevResourceCategories: newResourceCategories,
        currResourceCategories: newResourceCategories,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { prevResourceCategories, errors } = this.state;
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
                  <div className={elementStyles.modalFormFields}>
                    {prevResourceCategories.length > 0
                      ? prevResourceCategories.map((prevResourceCategory, index) => (
                        <div key={prevResourceCategory}>
                          <input
                            type="text"
                            id={`input-${index}`}
                            defaultValue={prettifyResourceCategory(prevResourceCategory)}
                            style={{ textTransform: 'uppercase' }}
                            onChange={this.changeHandler}
                          />
                          <span
                            className={elementStyles.error}
                          >
                            {errors.resourceCategories[index]}
                          </span>
                          <button type="button" className={elementStyles.blue} id={`save-${index}`} onClick={this.saveHandler}>Save</button>
                          <button type="button" className={elementStyles.warning} id={`delete-${index}`} onClick={this.deleteHandler}>Delete</button>
                        </div>
                      ))
                      : null}
                  </div>
                  <div className={elementStyles.modalButtons}>
                    <button type="button" className={elementStyles.blue} onClick={this.createHandler}>Create Category</button>
                  </div>
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
