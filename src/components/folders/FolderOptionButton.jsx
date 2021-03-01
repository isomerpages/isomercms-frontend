import React from 'react';

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const iconSelection = {
    'rearrange': 'bx-sort',
    'create-page': 'bx-file-blank',
    'create-sub': 'bx-folder',
}



const FolderOptionButton = ({ title, isSelected, onClick, option, isDisabled }) => {
    return (
        <button
            type="button"
            className={`
                ${elementStyles.card}
                ${contentStyles.card}
                ${isSelected ? elementStyles.folderOptionSelected : ''}
                ${isDisabled ? elementStyles.folderOptionDisabled : elementStyles.folderOption}
            `}
            disabled={isDisabled}
            onClick={onClick}
        >
            <div className={`${contentStyles.contentContainerFolderRow} justify-content-center`}>
                <i className={`bx ${iconSelection[option]} ${elementStyles.folderOptionIcon} ${isSelected ? 'text-white' : ''} ${isDisabled ? elementStyles.disabledIcon : ''} mr-2`} />
                <span className={`${elementStyles.folderOptionText} ml-2`}>{title}</span>
            </div>
        </button>
    )
}

export default FolderOptionButton