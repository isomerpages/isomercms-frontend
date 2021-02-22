import React from 'react';

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const FolderContentItem = ({ title, isFile, numItems }) => {
    return (
        <div type="button" className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}>
            <div className={contentStyles.contentContainerFolderRow}>
                {
                    isFile
                    ? <i className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`} />
                    : <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
                }
                <span className={`${elementStyles.folderItemText} mr-auto`} >{title}</span>
                {
                    numItems
                    ? <span className={elementStyles.folderItemText}>{numItems} item{numItems === '1' ? 's' : ''}</span>
                    : null
                }
                <button
                  className={`${contentStyles.componentIcon} ml-5 mr-3`}
                  type="button"
                >
                  <i className="bx bx-dots-vertical-rounded" />
                </button>
            </div>
        </div>
    )
}

const FolderContent = ({ data }) => {
    return (
        <div className={`${contentStyles.contentContainerFolderColumn} mb-5`}>
            {
                data.map((folderContentItem) => (
                    <FolderContentItem
                        key={folderContentItem.title}
                        title={folderContentItem.title}
                        numItems={folderContentItem.children ? folderContentItem.children.length : null}
                        isFile={folderContentItem.type === 'dir' ? false : true} />
                ))
            }
        </div>
    )
}

export default FolderContent