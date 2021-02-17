import React from 'react';

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';


const FolderOptionButton = ({ isSelected, option }) => {
    return (
        <button
            type="button"
            className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderOption} ${isSelected ? elementStyles.folderOptionSelected : ''}`}
        >
            <i className={`bx bx-sort ${isSelected ? 'text-white' : ''}`} />
            <span>abc</span>
        </button>
    )
}

export default FolderOptionButton