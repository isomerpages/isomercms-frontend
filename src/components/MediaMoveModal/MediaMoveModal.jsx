import { Breadcrumb } from "components/folders/Breadcrumb"
import { MoveMenuBackButton, MoveMenuItem } from "components/move"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import PropTypes from "prop-types"
import { useState } from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, getMediaDirectoryName } from "utils"

export const MediaMoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState((({ ...p }) => p)(queryParams))
  const [moveTo, setMoveTo] = useState(params)
  const { data: dirData } = useGetDirectoryHook(moveQuery)

  const MenuItems = () => {
    if (dirData && dirData.length)
      return (
        <>
          {/* directories */}
          {dirData
            .filter((item) => item.type === "dir")
            .map((item, itemIndex) => (
              <MoveMenuItem
                item={item}
                id={itemIndex}
                isItemSelected={
                  getMediaDirectoryName(moveTo.mediaDirectoryName, {
                    splitOn: "/",
                  }) === `${moveQuery.mediaDirectoryName}%2F${item.name}`
                }
                onItemSelect={() =>
                  setMoveTo({
                    ...moveQuery,
                    mediaDirectoryName: `${getMediaDirectoryName(
                      moveQuery.mediaDirectoryName,
                      { joinOn: "/", decode: true }
                    )}/${item.name}`,
                  })
                }
                onForward={() => {
                  setMoveTo({
                    ...moveQuery,
                    mediaDirectoryName: `${getMediaDirectoryName(
                      moveQuery.mediaDirectoryName,
                      { joinOn: "/", decode: true }
                    )}/${item.name}`,
                  })
                  setMoveQuery((prevState) => ({
                    ...prevState,
                    mediaDirectoryName: `${
                      moveQuery.mediaDirectoryName
                    }%2F${encodeURIComponent(item.name)}`,
                  }))
                }}
              />
            ))}
          {/* files */}
          {dirData
            .filter((item) => item.type === "file")
            .map((item, itemIndex) => (
              <MoveMenuItem item={item} id={itemIndex} />
            ))}
        </>
      )

    return (
      <div
        className={`${elementStyles.dropdownItemDisabled} d-flex justify-content-center`}
      >
        {dirData ? (
          `No ${moveQuery.mediaRoom} here yet.`
        ) : (
          <div className="spinner-border text-primary" role="status" />
        )}
      </div>
    )
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>{`Move ${moveQuery.mediaRoom.slice(0, -1)}`}</h1>
          <button id="settings-CLOSE" type="button" onClick={onClose}>
            <i id="settingsIcon-CLOSE" className="bx bx-x" />
          </button>
        </div>
        <div className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            {`Moving ${
              moveQuery.mediaRoom
            } to a different folder might lead to user confusion.
            You may wish to change the permalink or references to this ${moveQuery.mediaRoom.slice(
              0,
              -1
            )} afterwards.`}
            <br />
            <br />
            Current location: <br />
            <Breadcrumb
              params={params}
              title={pageFileNameToTitle(
                params.fileName,
                !!params.resourceRoomName
              )}
            />
            <div className={`${elementStyles.moveModal}`}>
              <MoveMenuBackButton
                onBack={() => {
                  setMoveQuery({
                    ...moveQuery,
                    mediaDirectoryName: getMediaDirectoryName(
                      moveQuery.mediaDirectoryName,
                      { end: -1 }
                    ),
                  })
                  setMoveTo({
                    ...moveQuery,
                    mediaDirectoryName: getMediaDirectoryName(
                      moveQuery.mediaDirectoryName,
                      { end: -1, joinOn: "/", decode: true }
                    ),
                  })
                }}
                isDisabled={
                  moveQuery.mediaDirectoryName.split("%2F").length <= 1
                } // images%2Fdir%2Fdir2
                backButtonText={getMediaDirectoryName(
                  moveQuery.mediaDirectoryName,
                  { start: -1, decode: true }
                )}
              />
              <MenuItems />
            </div>
            Moving to: <br />
            <Breadcrumb
              params={moveTo}
              title={pageFileNameToTitle(params.fileName)}
            />
          </div>
          <SaveDeleteButtons
            hasDeleteButton={false}
            saveCallback={() =>
              onProceed({
                target: { directoryName: moveTo.mediaDirectoryName },
                items: [{ name: params.fileName, type: "file" }],
              })
            }
            saveLabel="Move Here"
          />
        </div>
      </div>
    </div>
  )
}

export default MediaMoveModal

MediaMoveModal.propTypes = {
  queryParams: PropTypes.shape({
    siteName: PropTypes.string,
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({
    siteName: PropTypes.string,
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  onProceed: PropTypes.func,
  onClose: PropTypes.func,
}
