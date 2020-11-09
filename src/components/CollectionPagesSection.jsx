import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Import components
import OverviewCard from '../components/OverviewCard';
import ComponentSettingsModal from '../components/ComponentSettingsModal'

// Import styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Constants
const RADIX_PARSE_INT = 10;

const CollectionPagesSection = ({ collectionName, pages, siteName, isResource }) => {
    const [isComponentSettingsActive, setIsComponentSettingsActive] = useState(false)
    const [selectedFile, setSelectedFile] = useState('')
    const [createNewPage, setCreateNewPage] = useState(false)

    const generateNewPageText = () => {
        if (isResource) {
            return `Add a new resource`
        } else {
            return `Add a new ${collectionName ? 'collection ' : ''}page`
        }
    }

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
                        modalTitle={isResource ? "Resource Settings" : "Page Settings"}
                        settingsToggle={settingsToggle}
                        category={collectionName}
                        siteName={siteName}
                        fileName={selectedFile ? selectedFile.fileName : ''}
                        isNewFile={createNewPage}
                        type={isResource ? "resource" : "page"}
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
                { pages && pages.length > 0
                    ? (
                    <div className={contentStyles.boxesContainer}>
                        <button
                            type="button"
                            id="settings-NEW"
                            onClick={settingsToggle}
                            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
                        >
                            <i id="settingsIcon-NEW" className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`} />
                            <h2 id="settingsText-NEW">{generateNewPageText()}</h2>
                        </button>
                        {
                            pages.map((page, pageIdx) => (
                                <OverviewCard
                                    key={page.fileName}
                                    itemIndex={pageIdx}
                                    settingsToggle={settingsToggle}
                                    category={collectionName}
                                    siteName={siteName}
                                    fileName={page.fileName}
                                    title={page.title}
                                    date={page.date}
                                    isResource={isResource}
                                />
                            ))
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
