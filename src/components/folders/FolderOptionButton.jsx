import React from 'react';

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';


const FolderOptionButton = ({ isSelected, option }) => {
    return (
        <button
            type="button"
            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderOption}`}
        >
            <i id="settingsIcon-NEW" className={`bx bx-sort ${elementStyles.bxPlusCircle}`} />
            <span>abc</span>
        </button>
    )
}

export default FolderOptionButton