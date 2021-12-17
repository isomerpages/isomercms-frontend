import { Breadcrumb } from "components/folders/Breadcrumb"
import { MoveMenuBackButton, MoveMenuItem } from "components/move"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import React, { useState } from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, getLastItemType, getNextItemType } from "utils"

export const PageMoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState(
    (({ fileName, ...p }) => p)(queryParams)
  )
  const [moveTo, setMoveTo] = useState(params)
  const { data: dirData } = useGetDirectoryHook(moveQuery)

  const nextItemType = getNextItemType(moveQuery)
  const lastItemType = getLastItemType(moveQuery)

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Move page</h1>
          <button id="settings-CLOSE" type="button" onClick={onClose}>
            <i id="settingsIcon-CLOSE" className="bx bx-x" />
          </button>
        </div>
        <div className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            {`Moving pages to a different folder might lead to user confusion.
            You may wish to change the permalink or references to this page afterwards.`}
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
                  setMoveQuery(
                    (({ [lastItemType]: unused, ...p }) => p)(moveQuery)
                  )
                  setMoveTo(
                    (({ [lastItemType]: unused, ...p }) => p)(moveQuery)
                  )
                }}
                isDisabled={
                  moveQuery.resourceRoomName
                    ? Object.keys(moveQuery).length <= 2 // { siteName, resourceRoomName }
                    : Object.keys(moveQuery).length <= 1 // { siteName }
                }
                backButtonText={
                  lastItemType === "siteName"
                    ? "Workspace"
                    : decodeURIComponent(moveQuery[lastItemType])
                }
              />
              {dirData && dirData.length ? (
                <>
                  {/* directories */}
                  {dirData
                    .filter((item) => item.type === "dir")
                    .map((item, itemIndex) => (
                      <MoveMenuItem
                        item={item}
                        id={itemIndex}
                        isItemSelected={
                          moveTo[getLastItemType(moveTo)] === item.name
                        }
                        onItemSelect={() =>
                          setMoveTo({
                            ...moveQuery,
                            [nextItemType]: item.name,
                          })
                        }
                        onForward={() => {
                          setMoveTo({
                            ...moveQuery,
                            [nextItemType]: item.name,
                          })
                          setMoveQuery((prevState) => ({
                            ...prevState,
                            [nextItemType]: encodeURIComponent(item.name),
                          }))
                        }}
                        isResource={!!moveQuery.resourceRoomName}
                      />
                    ))}
                  {/* files */}
                  {dirData
                    .filter((item) => item.type === "file")
                    .map((item, itemIndex) => (
                      <MoveMenuItem
                        item={item}
                        id={itemIndex}
                        isResource={!!moveQuery.resourceRoomName}
                      />
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
                target: (({ siteName, fileName, ...p }) => p)(moveTo),
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
