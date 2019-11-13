import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { prettifyResourceFileName } from '../utils';
import ResourceCard from '../components/ResourceCard';
import ResourceCategoryModal from '../components/ResourceCategoryModal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

export default class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceCategories: [],
      resourcePages: [],
      newPageName: null,
      categoryModalIsActive: false,
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
      const { resources: resourceCategories } = resourcesResp.data;

      // Obtain the title, date, type, fileName, category for resource pages across all categories
      const resourcePagesArray = await Bluebird.map(resourceCategories, async (category) => {
        const resourcePagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category.dirName}`, {
          withCredentials: true,
        });
        const { resourcePages } = resourcePagesResp.data;

        if (resourcePages.length > 0) {
          return resourcePages.map((resourcePage) => {
            const { title, date, type } = prettifyResourceFileName(resourcePage.fileName);
            return {
              title,
              date,
              type,
              fileName: resourcePage.fileName,
              category: category.dirName,
            };
          });
        }

        return undefined;
      }, { concurrency: 10 });

      const resourcePages = _.compact(_.flattenDeep(resourcePagesArray));

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
      categoryModalIsActive: !currState.categoryModalIsActive,
    }));
  }

  render() {
    const {
      resourceCategories, resourcePages, newPageName, categoryModalIsActive,
    } = this.state;
    const { match, location } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <Header />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Resources</h1>
              <button type="button" className={elementStyles.blue}>Create New Page</button>
            </div>

            <div className={contentStyles.contentContainerBars}>
              <ResourceCategoryModal
                siteName={siteName}
                resourceCategories={resourceCategories}
                categoryModalToggle={this.categoryModalToggle}
                categoryModalIsActive={categoryModalIsActive}
              />
              {/* Display resource cards */}
              {resourcePages.length > 0
                ? (
                  <>
                    {resourcePages.map((resourcePage) => (
                      <ResourceCard
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
                )
                : null}
              <ResourceCard
                siteName={siteName}
                resourceCategories={resourceCategories}
                isNewPost
              />
            </div>
          </div>
          {/* main section ends here */}
        </div>
      </>
    );
  }
}

Resources.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
