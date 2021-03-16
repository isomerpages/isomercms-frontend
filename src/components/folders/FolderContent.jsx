import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immutability-helper';

import { deslugifyPage } from '../../utils'
import MenuDropdown from '../MenuDropdown'

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const FolderContentItem = ({ 
    title,
    isFile,
    numItems,
    link,
    itemIndex,
    dropdownItems,
    setSelectedPage,
}) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        if (showDropdown) dropdownRef.current.focus()
    }, [showDropdown])

    return (
        <Link to={link}>
            <div type="button" className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}>
                <div className={contentStyles.contentContainerFolderRow}>
                    {
                        isFile
                        ? <i className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`} />
                        : <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
                    }
                    <span className={`${elementStyles.folderItemText} mr-auto`} >{deslugifyPage(title)}</span>
                    {
                        numItems
                        ? <span className={elementStyles.folderItemText}>{numItems} item{numItems === '1' ? '' : 's'}</span>
                        : null
                    }
                    { showDropdown &&
                        <MenuDropdown
                            menuIndex={itemIndex}
                            dropdownItems={dropdownItems}
                            setShowDropdown={setShowDropdown}
                            dropdownRef={dropdownRef}
                            tabIndex={2}
                            onBlur={()=>setShowDropdown(false)}
                        />
                    }
                    <button
                        className={`${contentStyles.componentIcon} ml-5 mr-3`}
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            setSelectedPage(title)
                            setShowDropdown(true)
                        }}
                    >
                    <i className="bx bx-dots-vertical-rounded" />     
                    </button>
                </div>
            </div>
        </Link>
    )
}

const FolderContent = ({ 
    folderOrderArray,
    setFolderOrderArray,
    siteName,
    folderName,
    enableDragDrop,
    dropdownItems,
    setSelectedPage,
}) => {
    const generateLink = (folderContentItem) => {
        if (folderContentItem.type === 'dir') return `/sites/${siteName}/folder/${folderName}/subfolder/${folderContentItem.name}`
        return `/sites/${siteName}/folder/${folderName}/${folderContentItem.path.includes('/') ? `subfolder/` : ''}${folderContentItem.path}`
    }

    const onDragEnd = (result) => {
        const { source, destination } = result;

        // If the user dropped the draggable to no known droppable
        if (!destination) return;

        // The draggable elem was returned to its original position
        if (
            destination.droppableId === source.droppableId
            && destination.index === source.index
        ) return;

        const elem = folderOrderArray[source.index]
        const newFolderOrderArray = update(folderOrderArray, {
            $splice: [
                [source.index, 1], // Remove elem from its original position
                [destination.index, 0, elem], // Splice elem into its new position
            ],
        });
        setFolderOrderArray(newFolderOrderArray)
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable 
                droppableId="folder" 
                type="folder" 
                isDropDisabled={!enableDragDrop}
            >
                {(droppableProvided) => (        
                    <div 
                        className={`${contentStyles.contentContainerFolderColumn} mb-5`}
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                    >
                        {
                            folderOrderArray.map((folderContentItem, folderContentIndex) => (
                                <Draggable
                                    draggableId={`folder-${folderContentIndex}-draggable`}
                                    index={folderContentIndex}
                                    isDragDisabled={!enableDragDrop}
                                    key={folderContentItem.name}
                                >
                                    {(draggableProvided) => (
                                        <div
                                            key={folderContentIndex}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                            ref={draggableProvided.innerRef}
                                        >        
                                            <FolderContentItem
                                                key={folderContentItem.name}
                                                title={folderContentItem.name}
                                                numItems={folderContentItem.type === 'dir' ? folderContentItem.children.length : null}
                                                isFile={folderContentItem.type === 'dir' ? false: true}
                                                link={generateLink(folderContentItem)}
                                                itemIndex={folderContentIndex}
                                                dropdownItems={dropdownItems}
                                                setSelectedPage={setSelectedPage}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        {droppableProvided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default FolderContent