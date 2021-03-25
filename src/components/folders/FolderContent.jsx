import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immutability-helper';

import FolderModal from '../FolderModal';

import { deslugifyPage } from '../../utils'
import MenuDropdown from '../MenuDropdown'

// Import styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const FolderContentItem = ({
    siteName,
    title,
    folderName,
    isFile,
    numItems,
    link,
    itemIndex,
    queryFolderName,
    allCategories,
    setQueryFolderName,
    setSelectedPage,
    setSelectedFolder,
    setIsPageSettingsActive,
    setIsFolderModalOpen,
    setIsMoveModalActive,
    setIsDeleteModalActive
}) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [showFileMoveDropdown, setShowFileMoveDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const fileMoveDropdownRef = useRef(null)

    useEffect(() => {
        if (showDropdown) dropdownRef.current.focus()
        if (showFileMoveDropdown) fileMoveDropdownRef.current.focus()
    }, [showDropdown])

    const handleBlur = (event) => {
        // if the blur was because of outside focus
        // currentTarget is the parent element, relatedTarget is the clicked element
        // if (!event.currentTarget.contains(event.relatedTarget)) {
        //   setShowFileMoveDropdown(false)
        // }
    }

    const generateDropdownItems = () => {
        const dropdownItems = [
            {
                type: 'edit',
                handler: () => {
                    if (isFile) setIsPageSettingsActive(true)
                    else {
                        setIsFolderModalOpen(true)
                    }
                }
            },
            {
                type: 'move',
                handler: () => setShowFileMoveDropdown(true), // to be added in separate PR
            },
            {
                type: 'delete',
                handler: () => setIsDeleteModalActive(true)
            },
        ]
        if (isFile) return dropdownItems
        return dropdownItems.filter(item => item.itemId !== 'move')
    }
    return (
        <Link className={`${contentStyles.component} ${contentStyles.card}`} to={link}>
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
                        ? <span className={`${elementStyles.folderItemText} mr-5`}>{numItems} item{numItems === 1 ? '' : 's'}</span>
                        : null
                    }
                    <div className={`position-relative mt-auto mb-auto`}>
                        <button
                            className={`${showDropdown ? contentStyles.optionsIconFocus : contentStyles.optionsIcon}`}
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
                        { showDropdown &&
                            <MenuDropdown
                                menuIndex={itemIndex}
                                dropdownItems={generateDropdownItems()}
                                dropdownRef={dropdownRef}
                                tabIndex={2}
                                onBlur={()=>setShowDropdown(false)}
                            />
                        }
                        { showFileMoveDropdown &&
                            <MenuDropdown 
                                dropdownItems={[
                                    {
                                        itemName: `Move to`,
                                        itemId: `move`,
                                        iconClassName: "bx bx-sm bx-arrow-back",
                                        handler: () => {
                                            if (queryFolderName) { setQueryFolderName(''); setShowFileMoveDropdown(true) }
                                            else { setShowDropdown(true); setShowFileMoveDropdown(false) }
                                        },
                                    },
                                    ...allCategories.map(categoryName => ({
                                        itemName: categoryName,
                                        itemId: categoryName,
                                        handler: () => { setSelectedFolder(`${queryFolderName ? `${queryFolderName}/` : ''}${categoryName}`); setIsMoveModalActive(true) },
                                        children: queryFolderName === '' && <button
                                            id={`${categoryName}-more`}
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setQueryFolderName(categoryName)}}
                                            className={elementStyles.dropdownItemChildButton}
                                        >
                                            <i className="bx bx-sm bx-chevron-right ml-auto"/>   
                                        </button>, 
                                    })),
                                    queryFolderName === '' && {
                                        itemName: 'Unlinked pages',
                                        itemId: `unlinked-pages`,
                                        handler: () => { setSelectedFolder(`pages`); setIsMoveModalActive(true) },
                                    },
                                    allCategories.length === 0 && queryFolderName && {
                                        itemName: 'No subfolders, move here',
                                        itemId: `move-here`,
                                        handler: () => { setSelectedFolder(`${queryFolderName}/`); setIsMoveModalActive(true) }
                                    },
                                ]}
                                setShowDropdown={showFileMoveDropdown}
                                dropdownRef={fileMoveDropdownRef}
                                menuIndex={itemIndex}
                                tabIndex={1}
                                onBlur={handleBlur}
                            />
                        }
                    </div>
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
    allCategories,
    queryFolderName,
    setSelectedFolder,
    setQueryFolderName,
    setSelectedPage,
    setIsPageSettingsActive,
    setIsFolderModalOpen,
    setIsMoveModalActive,
    setIsDeleteModalActive,
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
                                                siteName={siteName}
                                                title={folderContentItem.name}
                                                folderName={folderName}
                                                numItems={folderContentItem.type === 'dir' ? folderContentItem.children.filter(name => !name.includes('.keep')).length : null}
                                                isFile={folderContentItem.type === 'dir' ? false: true}
                                                link={generateLink(folderContentItem)}
                                                allCategories={allCategories}
                                                itemIndex={folderContentIndex}
                                                queryFolderName={queryFolderName}
                                                setQueryFolderName={setQueryFolderName}
                                                setSelectedPage={setSelectedPage}
                                                setSelectedFolder={setSelectedFolder}
                                                setIsPageSettingsActive={setIsPageSettingsActive}
                                                setIsFolderModalOpen={setIsFolderModalOpen}
                                                setIsMoveModalActive={setIsMoveModalActive}
                                                setIsDeleteModalActive={setIsDeleteModalActive}
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