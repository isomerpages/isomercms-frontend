import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Import components
import OverviewCard from '../components/OverviewCard';
import ComponentSettingsModal from '../components/ComponentSettingsModal'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { prettifyPageFileName } from '../utils';

// Constants
const RADIX_PARSE_INT = 10;

const CollectionPagesSection = ({ collectionName, pages, siteName }) => {
    const [isComponentSettingsActive, setIsComponentSettingsActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState('')
    const [createNewPage, setCreateNewPage] = useState(false)

    const settingsToggle = (event) => {
        const { id } = event.target;
        const idArray = id.split('-');

        // Create new page
        if (idArray[1] === 'NEW') {
            setIsComponentSettingsActive((prevState) => !prevState)
            setSelectedFile('')
            setCreateNewPage(true)
        } else {
          // Modify existing page frontmatter
          const pageIndex = parseInt(idArray[1], RADIX_PARSE_INT);

          setIsComponentSettingsActive((prevState) => !prevState)
          setSelectedFile(() => {
              return isComponentSettingsActive ? null : pages[pageIndex]
          })
          setCreateNewPage(false)
        }
    }

    return (
        <>
            {
                isComponentSettingsActive
                && (
                    <ComponentSettingsModal
                        modalTitle={"Page Settings"}
                        settingsToggle={settingsToggle}
                        category={collectionName}
                        siteName={siteName}
                        fileName={selectedFile ? selectedFile.fileName : ''}
                        isNewFile={createNewPage}
                        type="page"
                        pageFilenames={
                            _.chain(pages)
                                .map((page) => page.fileName)
                                .value()
                        }
                    />
                )
            }
            <div className={contentStyles.contentContainerBoxes}>
                {/* Display loader if pages have not been retrieved from API call */}
                { pages
                    ? (
                    <div className={contentStyles.boxesContainer}>
                        <button
                            type="button"
                            id="settings-NEW"
                            onClick={settingsToggle}
                            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
                        >
                            <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
                            <h2 id="settingsText-NEW">Add a new {collectionName ? 'collection' : ''} page</h2>
                        </button>
                        {
                            pages.length > 0
                            ? pages.map((page, pageIdx) => (
                                <OverviewCard
                                    title={prettifyPageFileName(page.fileName)}
                                    key={page.fileName}
                                    itemIndex={pageIdx}
                                    settingsToggle={settingsToggle}
                                    category={page.collectionName ? page.collectionName : ''}
                                    siteName={siteName}
                                    fileName={page.fileName}
                                    collectionName={collectionName}
                                />
                            ))
                            : null
                        }
                    </div>
                    )
                    : 'Loading Pages...'
                }
            </div>
        </>
    )
}

export default CollectionPagesSection

CollectionPagesSection.propTypes = {
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            fileName: PropTypes.string.isRequired,
            path: PropTypes.string.isRequired,
            sha: PropTypes.string.isRequired,
        }),
    ),
    siteName: PropTypes.string.isRequired,
};
