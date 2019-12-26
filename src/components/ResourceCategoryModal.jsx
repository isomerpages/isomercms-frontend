import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import update from 'immutability-helper';
import { prettifyResourceCategory, slugifyResourceCategory } from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField';
import LoadingButton from './LoadingButton';
import { validateResourceCategory } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';

// Constants
const RADIX_PARSE_INT = 10;
const NEW_CATEGORY_STR = 'newcategory';

export default class ResourceCategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prevResourceCategories: [],
      currResourceCategories: [],
      errors: {
        resourceCategories: [],
      },
      itemPendingForDeleteId: '',
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

    const errorMessage = validateResourceCategory(value);

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

      // If the category is a new one
      if (prevResourceCategory === NEW_CATEGORY_STR) {
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

  deleteHandler = async (id) => {
    try {
      const { siteName } = this.props;
      const { prevResourceCategories } = this.state;
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
        itemPendingForDeleteId: '',
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { prevResourceCategories, errors, itemPendingForDeleteId } = this.state;
    const { categoryModalToggle, categoryModalIsActive } = this.props;

    // Page settings form has errors - disable save button
    const hasErrors = _.some(errors.resourceCategories,
      (categoryError) => categoryError.length > 0);
    return (
      <>
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
                          <FormField
                            title={`Category ${index + 1}`}
                            id={`input-${index}`}
                            defaultValue={prettifyResourceCategory(prevResourceCategory)}
                            errorMessage={errors.resourceCategories[index]}
                            style={{ textTransform: 'uppercase' }}
                            isRequired
                            onFieldChange={this.changeHandler}
                          />
                          {/* <LoadingButton
                            label="Save"
                            disabled={hasErrors}
                            className={hasErrors ? elementStyles.disabled : elementStyles.blue}
                            id={`save-${index}`}
                            callback={this.saveHandler}
                          />
                          <LoadingButton
                            label="Delete"
                            className={elementStyles.warning}
                            id={`delete-${index}`}
                            callback={this.deleteHandler}
                          /> */}
                          <button type="button" className={hasErrors ? elementStyles.disabled : elementStyles.blue} id={`save-${index}`} disabled={hasErrors} onClick={this.saveHandler}>Save</button>
                          <button type="button" className={elementStyles.warning} id={`delete-${index}`} onClick={(event) => this.setState({ itemPendingForDeleteId: event.target.id })}>Delete</button>
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
        {
          itemPendingForDeleteId
          && (
            <DeleteWarningModal
              onCancel={() => this.setState({ itemPendingForDeleteId: '' })}
              onDelete={() => this.deleteHandler(itemPendingForDeleteId)}
              type="Resource Catgeory"
            />
          )
        }
      </>
    );
  }
}

ResourceCategoryModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  categoryModalIsActive: PropTypes.bool.isRequired,
  categoryModalToggle: PropTypes.func.isRequired,
};
