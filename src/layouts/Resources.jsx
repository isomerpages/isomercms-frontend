import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import { retrieveResourceFileMetadata } from '../utils';
import ComponentSettingsModal from '../components/ComponentSettingsModal';
import ResourceCategoryModal from '../components/ResourceCategoryModal';
import MediasModal from '../components/media/MediaModal';
import MediaSettingsModal from '../components/media/MediaSettingsModal';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import OverviewCard from '../components/OverviewCard';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Constants
const RADIX_PARSE_INT = 10;

const ResourcePages = ({
  resourcePages, settingsToggle, siteName,
}) => (
  <>
    {/* Display resource cards */}
    <CreateResourceCard settingsToggle={settingsToggle} />
    {resourcePages.length > 0
      ? (
        <>
          {resourcePages.map((resourcePage, resourceIndex) => {
            const { fileName, category }= resourcePage
            const { title, date } = retrieveResourceFileMetadata(fileName);
            return (
            <OverviewCard
              category={category}
              settingsToggle={settingsToggle}
              itemIndex={resourceIndex}
              title={title}
              date={date}
              link={`/sites/${siteName}/resources/${category}/${fileName}`}
            />)
          })}
        </>
      )
      : null}
  </>
);

const CreateResourceCard = ({ settingsToggle }) => (
  <button
    type="button"
    id="settings-NEW"
    onClick={settingsToggle}
    className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
  >
    <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
    <h2 id="settingsText-NEW">Add a new resource</h2>
  </button>
);

export default class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceCategories: [],
      resourcePages: undefined,
      categoryModalIsActive: false,
      settingsIsActive: false,
      resourceRoomName: 'resource room',
      newResourceRoomName: '',
      selectedResourcePage: {
        isNewPost: true,
        category: '',
        fileName: '',
      },
      isSelectingFile: false,
      isFileStagedForUpload: false,
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
      const { resourceRoomName, resources: resourceCategories } = resourcesResp.data;

      if (resourceRoomName === undefined) {
        this.setState({ resourceRoomName });
      } else {
        // Obtain the title, date, fileName, category for resource pages across all categories
        const resourcePagesArray = await Bluebird.map(resourceCategories, async (category) => {
          const resourcePagesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category.dirName}`, {
            withCredentials: true,
          });
          const { resourcePages } = resourcePagesResp.data;

          if (resourcePages.length > 0) {
            return resourcePages.map((resourcePage) => {
              const { title, date } = retrieveResourceFileMetadata(resourcePage.fileName);
              return {
                title,
                date,
                fileName: resourcePage.fileName,
                category: category.dirName,
              };
            });
          }

          return undefined;
        }, { concurrency: 10 });

        const resourcePages = _.compact(_.flattenDeep(resourcePagesArray));

        this.setState({ resourceRoomName, resourceCategories, resourcePages });
      }
    } catch (err) {
      console.log(err);
    }
  }

  categoryModalToggle = () => {
    this.setState((currState) => ({
      categoryModalIsActive: !currState.categoryModalIsActive,
    }));
  }

  toggleFileModal = () => {
    this.setState((currState) => ({
      isSelectingFile: !currState.isSelectingFile,
    }));
  }

  toggleFileAndSettingsModal = () => {
    this.setState((currState) => ({
      isSelectingFile: !currState.isSelectingFile,
      isFileStagedForUpload: !currState.isFileStagedForUpload,
    }));
  }

  onFileClick = (path) => {
    this.setState({
      filePath: path,
      isSelectingFile: false,
    });
  }

  stageFileForUpload = (fileName, fileData) => {
    const { type } = this.props;
    const baseFolder = type === 'file' ? 'files' : 'images';
    this.setState({
      isFileStagedForUpload: true,
      stagedFileDetails: {
        path: `${baseFolder}%2F${fileName}`,
        content: fileData,
        fileName,
      },
    });
  }

  readFileToStageUpload = async (event) => {
    const fileReader = new FileReader();
    const fileName = event.target.files[0].name;
    fileReader.onload = (() => {
      /** Github only requires the content of the file
         * fileReader returns  `data:application/pdf;base64, {fileContent}`
         * hence the split
         */

      const fileData = fileReader.result.split(',')[1];
      this.stageFileForUpload(fileName, fileData);
    });
    fileReader.readAsDataURL(event.target.files[0]);
    this.toggleFileModal()
  }

  settingsToggle = (event) => {
    const { id } = event.target;
    const idArray = id.split('-');
    let resourcePageIndex = idArray[1];

    // User clicked on the "Create New Resource" button
    if (resourcePageIndex === 'NEW') {
      this.setState({
        settingsIsActive: true,
        selectedResourcePage: {
          isNewPost: true,
        },
      });
    } else if (resourcePageIndex === 'CLOSE') {
      // User clicked on the close button in the settings modal
      this.setState({ settingsIsActive: false });
    } else if (resourcePageIndex === '') {
      // User clicked on the file upload button
      this.setState({
        settingsIsActive: false,
        isSelectingFile: true
       });
    } else {
      // User clicked on the settings icon on an existing resource
      resourcePageIndex = parseInt(resourcePageIndex, RADIX_PARSE_INT);

      this.setState((currState) => ({
        settingsIsActive: true,
        selectedResourcePage: {
          isNewPost: false,
          category: currState.resourcePages[resourcePageIndex].category,
          fileName: currState.resourcePages[resourcePageIndex].fileName,
        },
      }));
    }
  }

  changeHandler = (event) => {
    const { value } = event.target;
    this.setState({ newResourceRoomName: value });
  }

  createResourceRoom = async () => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const { newResourceRoomName } = this.state;
      const params = { resourceRoom: newResourceRoomName };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resource-room`, params, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      resourceCategories,
      resourcePages,
      categoryModalIsActive,
      settingsIsActive,
      selectedResourcePage,
      resourceRoomName,
      newResourceRoomName,
      isSelectingFile,
      isFileStagedForUpload,
      stagedFileDetails,
    } = this.state;
    const { match, location } = this.props;
    const { siteName } = match.params;
    return (
      <>
        {/* Resource Room exists */}
        <Header />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />
          { settingsIsActive
            ? (
              <ComponentSettingsModal
                modalTitle={"Resource Settings"}
                siteName={siteName}
                isNewFile={selectedResourcePage.isNewPost}
                category={selectedResourcePage.category}
                fileName={selectedResourcePage.fileName}
                settingsToggle={this.settingsToggle}
                type="resource"
              />
            )
            : null}

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Resources</h1>
              { resourceRoomName
                ? (
                  <ResourceCategoryModal
                    siteName={siteName}
                    resourceCategories={resourceCategories}
                    categoryModalToggle={this.categoryModalToggle}
                    categoryModalIsActive={categoryModalIsActive}
                  />
                )
                : null }
            </div>

            <div className={contentStyles.contentContainerBoxes}>
              <div className={contentStyles.boxesContainer}>
                { !resourceRoomName
                  ? (
                    <>
                      {/* Resource Room does not exist */}
                      <p>Create Resource Room</p>
                      <input value={newResourceRoomName} onChange={this.changeHandler} />
                      <button type="button" onClick={this.createResourceRoom} className={elementStyles.blue}>Create Resource Room</button>
                    </>
                  )
                  : (
                    <>
                      { resourcePages
                        ? (
                          <ResourcePages
                            resourcePages={resourcePages}
                            siteName={siteName}
                            settingsToggle={this.settingsToggle}
                          />
                        )
                        : 'Loading resources...'}
                    </>
                  )}
              </div>
            </div>
          </div>
          {/* main section ends here */}
        </div>
        {
          isSelectingFile && (
          <MediasModal
            type="file"
            siteName={siteName}
            onMediaSelect={this.onFileClick}
            readFileToStageUpload={this.readFileToStageUpload}
            onClose={() => this.setState({ isSelectingFile: false, settingsIsActive: true })}
          />
          )
        }
        {
          isFileStagedForUpload && (
            <MediaSettingsModal
              type="file"
              siteName={siteName}
              onClose={() => this.setState({ isFileStagedForUpload: false })}
              onSave={this.toggleFileAndSettingsModal}
              media={stagedFileDetails}
              isPendingUpload="true"
            />
          )
        }
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

ResourcePages.propTypes = {
  settingsToggle: PropTypes.func.isRequired,
  resourcePages: PropTypes.arrayOf(
    PropTypes.shape({
      siteName: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  siteName: PropTypes.string.isRequired,
};

CreateResourceCard.propTypes = {
  settingsToggle: PropTypes.func.isRequired,
};
