import Breadcrumb from "components/folders/Breadcrumb"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import PropTypes from "prop-types"
import React, { useState } from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import {
  pageFileNameToTitle,
  getLastItemType,
  getNextItemType,
  deslugifyDirectory,
} from "utils"

const MoveMenu = ({
  type,
  moveQuery,
  setMoveQuery,
  moveTo,
  setMoveTo,
  dirData,
}) => {
  /** ******************************** */
  /*     subcomponents    */
  /** ******************************** */

  const MoveMenuBackButton = () => {
    const lastItemType = getLastItemType(moveQuery)
    const isEnabled =
      moveQuery.resourceRoomName || moveQuery.mediaRoom
        ? Object.keys(moveQuery).length > 2
        : Object.keys(moveQuery).length > 1
    return (
      <div
        id="moveModal-backButton"
        className={`${elementStyles.dropdownHeader}`}
        onMouseDown={
          isEnabled
            ? () => {
                const newMoveQuery = (({ [lastItemType]: unused, ...p }) => p)(
                  moveQuery
                )
                setMoveQuery(newMoveQuery)
                setMoveTo(newMoveQuery)
              }
            : null
        }
      >
        <i
          className={`${elementStyles.dropdownIcon} ${
            isEnabled && "bx bx-sm bx-arrow-back text-white"
          }`}
        />
        {lastItemType === "siteName"
          ? "Workspace"
          : deslugifyDirectory(decodeURIComponent(moveQuery[lastItemType]))}
      </div>
    )
  }

  const MoveMenuItem = ({ item, id }) => {
    const { name, type } = item
    const nextItemType = getNextItemType(moveQuery)
    const isSelected = moveTo[getLastItemType(moveTo)] === name
    if (type === "file")
      return (
        <div
          id={id}
          data-cy={id}
          className={`
            ${elementStyles.dropdownItemDisabled}
          `}
        >
          <i
            className={`${elementStyles.dropdownIcon} ${elementStyles.disabledIcon} bx bx-sm bx-file-blank`}
          />
          {pageFileNameToTitle(name, !!moveQuery.resourceRoomName) ||
            deslugifyDirectory(name)}
        </div>
      )
    if (type === "dir")
      return (
        <div
          id={id}
          data-cy={id}
          onClick={() => {
            setMoveTo((moveQuery) => ({
              ...moveQuery,
              [nextItemType]: name,
            }))
          }}
          className={`
          ${elementStyles.dropdownItem} 
          ${isSelected ? elementStyles.dropdownItemFocus : ""}
        `}
        >
          <i className={`${elementStyles.dropdownIcon} bx bx-sm bx-folder`} />
          {deslugifyDirectory(name)}
          <i
            id={`moveModal-forwardButton-${name}`}
            className={`${elementStyles.dropdownItemButton} bx bx-sm bx-chevron-right ml-auto`}
            onMouseDown={() => {
              setMoveTo((moveQuery) => ({
                ...moveQuery,
                [nextItemType]: name,
              }))
              setMoveQuery((prevState) => ({
                ...prevState,
                [nextItemType]: encodeURIComponent(name),
              }))
            }}
          />
        </div>
      )
    return null
  }

  return (
    <div className={`${elementStyles.moveModal}`}>
      <MoveMenuBackButton />
      {dirData && dirData.length ? (
        <>
          {/* directories */}
          {dirData
            .filter((item) => item.type === "dir")
            .map((item, itemIndex) => (
              <MoveMenuItem item={item} id={itemIndex} />
            ))}
          {/* files */}
          {dirData
            .filter((item) => item.type === "file")
            .map((item, itemIndex) => (
              <MoveMenuItem item={item} id={itemIndex} />
            ))}
        </>
      ) : dirData ? (
        <div
          className={`${elementStyles.dropdownItemDisabled} d-flex justify-content-center`}
        >
          {`No ${type}s here yet.`}
        </div>
      ) : (
        <div
          className={`${elementStyles.dropdownItemDisabled} d-flex justify-content-center`}
        >
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
    </div>
  )
}

const MoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState(
    (({ fileName, ...p }) => p)(queryParams)
  )
  const [moveTo, setMoveTo] = useState(moveQuery)
  const { data: dirData } = useGetDirectoryHook(moveQuery)

  const type = moveQuery.mediaRoom ? moveQuery.mediaRoom.slice(0, -1) : "page"
  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>{`Move ${type}`}</h1>
          <button id="settings-CLOSE" type="button" onClick={onClose}>
            <i id="settingsIcon-CLOSE" className="bx bx-x" />
          </button>
        </div>
        <div className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            {`Moving a ${type} to a different folder might lead to user confusion.
            You may wish to change the permalink or references to this ${type} afterwards.`}
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
            <MoveMenu
              moveQuery={moveQuery}
              setMoveQuery={setMoveQuery}
              moveTo={moveTo}
              setMoveTo={setMoveTo}
              type={type}
              dirData={
                dirData
                  ? dirData.filter((item) => item.name != params.fileName)
                  : []
              }
            />
            Moving to: <br />
            <Breadcrumb
              params={moveTo}
              title={pageFileNameToTitle(
                params.fileName,
                !!params.resourceRoomName
              )}
            />
          </div>
          <SaveDeleteButtons
            isDisabled={moveTo.resourceRoomName && !moveTo.resourceCategoryName}
            hasDeleteButton={false}
            saveCallback={() =>
              onProceed({
                target: moveTo.mediaRoom
                  ? {
                      directoryName: `${moveTo.mediaRoom}/${moveTo.mediaDirectoryName}`,
                    }
                  : (({ siteName, ...p }) => p)(moveTo),
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

export default MoveModal

MoveModal.propTypes = {
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
