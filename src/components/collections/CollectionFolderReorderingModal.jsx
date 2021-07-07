import React from "react"
import PropTypes from "prop-types"
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd"
import update from "immutability-helper"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

import { FolderContentItem } from "../folders/FolderContent"
import LoadingButton from "../LoadingButton"

import { deslugifyDirectory } from "../../utils"

// Import styles
import adminStyles from "../../styles/isomer-cms/pages/Admin.module.scss"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../../styles/isomer-cms/pages/Content.module.scss"

const CollectionFolderReorderingModal = () => {
  return (
    <CollectionConsumer>
      {({
        collectionName,
        subcollectionName,
        directoryFileSha,
        collectionFolderOrderArray,
        setCollectionFolderOrderArray,
        parsedFolderContents,
        isRearrangeActive,
        setIsRearrangeActive,
        rearrangeFolder,
      }) => (
        <>
          {isRearrangeActive && (
            <ModalBody
              collectionName={collectionName}
              subcollectionName={subcollectionName}
              collectionFolderOrderArray={collectionFolderOrderArray}
              setCollectionFolderOrderArray={setCollectionFolderOrderArray}
              setIsRearrangeActive={setIsRearrangeActive}
              directoryFileSha={directoryFileSha}
              parsedFolderContents={parsedFolderContents}
              rearrangeFolder={rearrangeFolder}
            />
          )}
        </>
      )}
    </CollectionConsumer>
  )
}

const ModalBody = ({
  collectionName,
  subcollectionName,
  collectionFolderOrderArray,
  setCollectionFolderOrderArray,
  setIsRearrangeActive,
  rearrangeFolder,
}) => {
  const onDragEnd = (result) => {
    const { source, destination } = result

    // If the user dropped the draggable to no known droppable
    if (!destination) return

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const elem = collectionFolderOrderArray[source.index]
    const newFolderOrder = update(collectionFolderOrderArray, {
      $splice: [
        [source.index, 1], // Remove elem from its original position
        [destination.index, 0, elem], // Splice elem into its new position
      ],
    })
    setCollectionFolderOrderArray(newFolderOrder)
  }

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={`${elementStyles.fullscreenWrapper}`}>
          <div
            className={`${adminStyles.adminSidebar} ${elementStyles.wrappedContent} bg-transparent`}
          />
          <div
            className={`${contentStyles.mainSection} ${elementStyles.wrappedContent} bg-light`}
          >
            {/* Page title */}
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>{`Rearrange items in ${
                subcollectionName
                  ? deslugifyDirectory(subcollectionName)
                  : deslugifyDirectory(collectionName)
              }`}</h1>
            </div>
            <div className={contentStyles.segment}>
              <i className="bx bx-sm bx-bulb text-dark" />
              <span>
                <strong className="ml-1">Pro tip:</strong> Drag and drop the
                items below to rearrange their order in your site.
              </span>
            </div>
            {/* Segment divider  */}
            <div className={contentStyles.segmentDividerContainer}>
              <hr className="w-100 mt-3 mb-5" />
            </div>
            <br />
            <div className={contentStyles.segment}>
              <span>
                Workspace {">"}
                {subcollectionName ? (
                  <>
                    &nbsp;
                    {deslugifyDirectory(collectionName)}&nbsp;
                    <strong>
                      {">"}
                      {deslugifyDirectory(subcollectionName)}
                    </strong>
                    &nbsp;
                  </>
                ) : (
                  <strong> {deslugifyDirectory(collectionName)}</strong>
                )}
              </span>
            </div>
            {/* Pages */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="folder" type="folder">
                {(droppableProvided) => (
                  <div
                    className={`${contentStyles.contentContainerFolderColumn} mb-5`}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {collectionFolderOrderArray.map(
                      (folderContentItem, folderContentIndex) => (
                        <Draggable
                          draggableId={folderContentItem.fileName}
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
                                disableLink
                              />
                            </div>
                          )}
                        </Draggable>
                      )
                    )}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <div className={contentStyles.sectionFooter}>
            <LoadingButton
              label="Cancel"
              disabledStyle={elementStyles.disabled}
              className={`${elementStyles.warning}`}
              callback={() => setIsRearrangeActive(false)}
            />
            <LoadingButton
              label="Done"
              className={elementStyles.blue}
              callback={rearrangeFolder}
            />
          </div>
        </div>
      </div>
    </>
  )
}

ModalBody.propTypes = {
  siteName: PropTypes.string.isRequired,
  collectionName: PropTypes.string.isRequired,
  subcollectionName: PropTypes.string,
  collectionFolderOrderArray: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
  setIsRearrangeActive: PropTypes.func.isRequired,
  directoryFileSha: PropTypes.string.isRequired,
  parsedFolderContents: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default CollectionFolderReorderingModal
