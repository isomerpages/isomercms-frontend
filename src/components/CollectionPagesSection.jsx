import React from 'react';
import PropTypes from 'prop-types';

// Import components
import OverviewCard from '../components/OverviewCard';

// Import styles
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import { prettifyPageFileName } from '../utils';

const CollectionPagesSection = ({ pages, siteName }) => {
    return (
        <div className={contentStyles.contentContainerBoxes}>
            {/* Display loader if pages have not been retrieved from API call */}
            { pages
                ? (
                <div className={contentStyles.boxesContainer}>
                    {
                        pages.length > 0
                        ? pages.map((page, pageIdx) => (
                            <OverviewCard
                                title={prettifyPageFileName(page.fileName)}
                                key={page.fileName}
                                itemIndex={pageIdx}
                                settingsToggle={() => {}}
                                category={page.collectionName ? page.collectionName : ''}
                                siteName={siteName}
                                fileName={page.fileName}
                                collectionName={page.collectionName}
                            />
                        ))
                        : null
                    }
                </div>
                )
                : 'Loading Pages...'
            }
        </div>
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
