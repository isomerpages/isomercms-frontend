import React, { useState } from "react"
import PropTypes from "prop-types"
import Breadcrumb from "./folders/Breadcrumb"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import { useGetDirectoryHook } from "../hooks/directoryHooks"
import SaveDeleteButtons from "./SaveDeleteButtons"

import { getLastItemType, getNextItemType, deslugifyDirectory } from "../utils"

const MoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState(
    (({ fileName, ...p }) => p)(queryParams)
  )
  const [moveTo, setMoveTo] = useState(moveQuery)

  const { data: dirData } = useGetDirectoryHook(moveQuery)

  /** ******************************** */
  /*     subcomponents    */
  /** ******************************** */

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
          {deslugifyDirectory(name)}
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

  const MoveMenuBackButton = () => {
    const lastItemType = getLastItemType(moveQuery)
    const isEnabled = Object.keys(moveQuery).length > 1
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
            lastItemType != "siteName" && "bx bx-sm bx-arrow-back text-white"
          }`}
        />
        {lastItemType === "siteName"
          ? "Workspace"
          : deslugifyDirectory(decodeURIComponent(moveQuery[lastItemType]))}
      </div>
    )
  }

  const MoveMenu = () => (
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
          {/* pages */}
          {dirData
            .filter((item) => item.type === "file")
            .filter((item) => item.name != params.fileName)
            .map((item, itemIndex) => (
              <MoveMenuItem item={item} id={itemIndex} />
            ))}
        </>
      ) : dirData ? (
        <div
          className={`${elementStyles.dropdownItemDisabled} d-flex justify-content-center`}
        >
          No pages here yet.
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

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Move Page</h1>
          <button id="settings-CLOSE" type="button" onClick={onClose}>
            <i id="settingsIcon-CLOSE" className="bx bx-x" />
          </button>
        </div>
        <div className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            Moving a page to a different folder might lead to user confusion.
            You may wish to change the permalink for this page afterwards.
            <br />
            <br />
            Current location of page: <br />
            <Breadcrumb params={params} title={params.fileName} />
            <MoveMenu />
            Moving page to: <br />
            <Breadcrumb params={moveTo} title={params.fileName} />
          </div>
          <SaveDeleteButtons
            hasDeleteButton={false}
            saveCallback={() =>
              onProceed({
                target: (({ siteName, ...p }) => p)(moveTo),
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
