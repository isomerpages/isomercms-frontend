import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import { useMutation } from 'react-query';
import update from 'immutability-helper';

import { FolderContentItem } from './folders/FolderContent'
import LoadingButton from '../components/LoadingButton';

import { 
  DEFAULT_RETRY_MSG,
  deslugifyDirectory,
  convertSubfolderArray,
  updateDirectoryFile,
  convertArrayToFolderOrder,
} from "../utils"

import { errorToast, successToast } from '../utils/toasts';

import { setDirectoryFile } from '../api'
  

// Import styles
import adminStyles from '../styles/isomer-cms/pages/Admin.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const FolderReorderingModal = ({
  siteName,
  folderName,
  subfolderName,
  folderOrderArray,
  setIsRearrangeActive,
  directoryFileSha,
  parsedFolderContents,
  parsedFolderOutput,
}) => {
  const [folderOrder, setFolderOrder] = useState(folderOrderArray)

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
        destination.droppableId === source.droppableId
        && destination.index === source.index
    ) return;

    const elem = folderOrder[source.index]
    const newFolderOrder = update(folderOrder, {
        $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, elem], // Splice elem into its new position
        ],
    });
    setFolderOrder(newFolderOrder)
  }

  // REORDERING
  // save file-reordering
  const { mutateAsync: rearrangeFolder } = useMutation(
    payload => setDirectoryFile(siteName, folderName, payload),
    {
      onError: () => errorToast(`Your file reordering could not be saved. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => successToast('Successfully updated page order'),
      onSettled: () => setIsRearrangeActive((prevState) => !prevState),
    }
  )
  
  // REORDERING utils
  const saveHandler =  async () => {  
    // drag and drop complete, save new order 
    let newFolderOrder
    if (subfolderName) {
      newFolderOrder = convertSubfolderArray(folderOrder, parsedFolderContents, subfolderName)
    } else {
      newFolderOrder = convertArrayToFolderOrder(folderOrder)
    }
    if (JSON.stringify(newFolderOrder) === JSON.stringify(parsedFolderContents)) { 
      // no change in file order
      setIsRearrangeActive((prevState) => !prevState)
      return
    }

    const updatedDirectoryFile = updateDirectoryFile(folderName, parsedFolderOutput, newFolderOrder)

    const payload = {
      content: updatedDirectoryFile,
      sha: directoryFileSha,
    } 
    await rearrangeFolder(payload) // setIsRearrangeActive(false) handled by mutate
  }
  
  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={`${elementStyles.fullscreenWrapper}`}>
          <div className={`${adminStyles.adminSidebar} ${elementStyles.wrappedContent} bg-transparent`} />
          <div className={`${contentStyles.mainSection} ${elementStyles.wrappedContent} bg-light`}>
            {/* Page title */}
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>{`Rearrange items in ${subfolderName? deslugifyDirectory(subfolderName) : deslugifyDirectory(folderName)}`}</h1>
            </div>
            <div className={contentStyles.segment}>
              <i className="bx bx-sm bx-bulb text-dark" />
              <span><strong className="ml-1">Pro tip:</strong> Drag and drop to rearrange pages</span>
            </div>
            {/* Segment divider  */}
            <div className={contentStyles.segmentDividerContainer}>
              <hr className="w-100 mt-3 mb-5" />
            </div>
            <br/>
            <div className={contentStyles.segment}>
              <span>
                Workspace > 
                {
                  subfolderName  
                    ? <> {deslugifyDirectory(folderName)} <strong> > {deslugifyDirectory(subfolderName)}</strong> </>
                    : <strong> {deslugifyDirectory(folderName)}</strong>
                }
              </span>
            </div>
            {/* Pages */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable 
                droppableId="folder" 
                type="folder" 
              >
                {(droppableProvided) => (        
                  <div 
                    className={`${contentStyles.contentContainerFolderColumn} mb-5`}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {
                      folderOrder.map((folderContentItem, folderContentIndex) => (
                        <Draggable
                          draggableId={`folder-${folderContentIndex}-draggable`}
                          index={folderContentIndex}
                          key={folderContentItem.fileName}
                        >
                          {(draggableProvided) => (
                            <div
                              key={folderContentIndex}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              ref={draggableProvided.innerRef}
                            >        
                              <FolderContentItem
                                key={folderContentItem.fileName}
                                folderContentItem={folderContentItem}
                                itemIndex={folderContentIndex}
                                disableButton={true}
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
          </div>
          <div className={contentStyles.sectionFooter}>
            <LoadingButton
              label={`Done`}
              className={elementStyles.blue}
              callback={saveHandler}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default FolderReorderingModal

FolderReorderingModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  folderName: PropTypes.string.isRequired,
  subfolderName: PropTypes.string,
  folderOrderArray: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      type: PropTypes.string,
    }),
  ).isRequired,
  setIsRearrangeActive: PropTypes.func.isRequired,
  directoryFileSha: PropTypes.string.isRequired,
  parsedFolderContents: PropTypes.arrayOf(PropTypes.string).isRequired,
  parsedFolderOutput: PropTypes.bool.isRequired,
};