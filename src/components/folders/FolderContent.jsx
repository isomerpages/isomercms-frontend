import React from 'react';
import { Link } from 'react-router-dom';

import { deslugifyPage } from '../../utils'

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const FolderContentItem = ({ title, isFile, numItems, link }) => {
    return (
        <Link to={link}>
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
        </Link>
    )
}

const FolderContent = ({ data, siteName, folderName }) => {
    return (
        <div className={`${contentStyles.contentContainerFolderColumn} mb-5`}>
            {
                data.map((folderContentItem) => (
                    <FolderContentItem
                        key={folderContentItem.title}
                        title={deslugifyPage(folderContentItem.title)}
                        numItems={folderContentItem.type === 'dir' ? folderContentItem.children.length : null}
                        isFile={folderContentItem.type === 'dir' ? false: true}
                        link={folderContentItem.type === 'dir' ? `/sites/${siteName}/folder/${folderName}/${folderContentItem.title}` : `/sites/${siteName}/collections/${folderName}/${folderContentItem.path}`}
                    />
                ))
            }
        </div>
    )
}

export default FolderContent