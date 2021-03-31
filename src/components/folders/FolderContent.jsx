import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import update from 'immutability-helper';

import { deslugifyPage } from '../../utils'
import { MenuDropdown } from '../MenuDropdown'
import FileMoveMenuDropdown from '../FileMoveMenuDropdown'

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
    allCategories,
    setSelectedPage,
    setSelectedPath,
    setIsPageSettingsActive,
    setIsFolderModalOpen,
    setIsMoveModalActive,
    setIsDeleteModalActive,
    moveDropdownQuery,
    setMoveDropdownQuery,
    clearMoveDropdownQueryState,
}) => {
    const [showDropdown, setShowDropdown] = useState(false)
    const [showFileMoveDropdown, setShowFileMoveDropdown] = useState(false)
    const dropdownRef = useRef(null)
    const fileMoveDropdownRef = useRef(null)

    useEffect(() => {
        if (showDropdown) dropdownRef.current.focus()
        if (showFileMoveDropdown) fileMoveDropdownRef.current.focus()
    }, [showDropdown, showFileMoveDropdown])

    const handleBlur = (event) => {
        // if the blur was because of outside focus
        // currentTarget is the parent element, relatedTarget is the clicked element
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setShowFileMoveDropdown(false)
            clearMoveDropdownQueryState()
        }
    }

    const toggleDropdownModals = () => {
        setShowFileMoveDropdown(!showFileMoveDropdown)
        setShowDropdown(!showDropdown)
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
                handler: toggleDropdownModals
            },
            {
                type: 'delete',
                handler: () => setIsDeleteModalActive(true)
            },
        ]
        if (isFile) return dropdownItems
        return dropdownItems.filter(item => item.type !== 'move')
    }

    const FolderItemContent = (
        <div type="button" className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}>
            <div className={contentStyles.contentContainerFolderRow}>
                {
                    isFile
                    ? <i className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`} />
                    : <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
                }
                <span className={`${elementStyles.folderItemText} mr-auto`} >{deslugifyPage(title)}</span>
                {
                    numItems !== null
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
                        <FileMoveMenuDropdown 
                            dropdownItems={allCategories}
                            dropdownRef={fileMoveDropdownRef}
                            menuIndex={itemIndex}
                            onBlur={handleBlur}
                            moveDropdownQuery={moveDropdownQuery}
                            setMoveDropdownQuery={setMoveDropdownQuery}
                            backHandler={toggleDropdownModals}
                            moveHandler={() => {
                                setSelectedPath(`${moveDropdownQuery.folderName ? moveDropdownQuery.folderName : 'pages'}${moveDropdownQuery.subfolderName ? `/${moveDropdownQuery.subfolderName}` : ''}`)
                                setIsMoveModalActive(true)
                            }}
                        />
                    }
                </div>
            </div>
        </div>
    )

    return (
        !showFileMoveDropdown && !showDropdown
        ? 
            <Link className={`${contentStyles.component} ${contentStyles.card}`} to={link}>
                {FolderItemContent}
            </Link>
        :
            <div className={`${contentStyles.component} ${contentStyles.card}`}>
                {FolderItemContent}
            </div>
    )
}

const FolderContent = ({ 
    folderOrderArray,
    setFolderOrderArray,
    siteName,
    folderName,
    enableDragDrop,
    allCategories,
    setSelectedPath,
    setSelectedPage,
    setIsPageSettingsActive,
    setIsFolderModalOpen,
    setIsMoveModalActive,
    setIsDeleteModalActive,
    moveDropdownQuery,
    setMoveDropdownQuery,
    clearMoveDropdownQueryState,
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
                                                setSelectedPage={setSelectedPage}
                                                setSelectedPath={setSelectedPath}
                                                setIsPageSettingsActive={setIsPageSettingsActive}
                                                setIsFolderModalOpen={setIsFolderModalOpen}
                                                setIsMoveModalActive={setIsMoveModalActive}
                                                setIsDeleteModalActive={setIsDeleteModalActive}
                                                moveDropdownQuery={moveDropdownQuery}
                                                setMoveDropdownQuery={setMoveDropdownQuery}
                                                clearMoveDropdownQueryState={clearMoveDropdownQueryState}
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