import { Breadcrumb } from "components/folders/Breadcrumb"
import { FolderItem } from "components/folders/FolderContent"
import LoadingButton from "components/LoadingButton"
import update from "immutability-helper"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd"

// Import styles

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import adminStyles from "styles/isomer-cms/pages/Admin.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { deslugifyDirectory } from "utils"

const ReorderingModal = ({ params, dirData, onProceed, onClose }) => {
  const { collectionName, subCollectionName } = params
  const [dirOrder, setDirOrder] = useState([])

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (dirData) setDirOrder(dirData)
  }, [dirData])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

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

    const elem = dirOrder[source.index]
    const newDirOrder = update(dirOrder, {
      $splice: [
        [source.index, 1], // Remove elem from its original position
        [destination.index, 0, elem], // Splice elem into its new position
      ],
    })
    setDirOrder(newDirOrder)
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
                subCollectionName
                  ? deslugifyDirectory(subCollectionName)
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
            {/* Breadcrumb */}
            <div className={contentStyles.segment}>
              <Breadcrumb params={params} />
            </div>
            {/* Directory data */}
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="folder" type="folder">
                {(droppableProvided) => (
                  <div
                    className={`${contentStyles.contentContainerFolderColumn} mb-5`}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {dirOrder.map((folderContentItem, folderContentIndex) => (
                      <Draggable
                        draggableId={folderContentItem.name}
                        index={folderContentIndex}
                        key={folderContentItem.name}
                      >
                        {(draggableProvided) => (
                          <div
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            <FolderItem
                              key={folderContentItem.name}
                              item={folderContentItem}
                              itemIndex={folderContentIndex}
                              isDisabled
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
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
              callback={onClose}
            />
            <LoadingButton
              label="Save"
              className={elementStyles.blue}
              callback={() =>
                onProceed({
                  items: dirOrder,
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ReorderingModal

ReorderingModal.propTypes = {
  siteName: PropTypes.string.isRequired,
  folderName: PropTypes.string.isRequired,
  subfolderName: PropTypes.string,
  folderOrderArray: PropTypes.arrayOf(
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
  isFolderLive: PropTypes.bool.isRequired,
}
