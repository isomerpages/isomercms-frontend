import { CloseButton, HStack } from "@chakra-ui/react"
import { Breadcrumb } from "components/folders/Breadcrumb"
import { LoadingButton } from "components/LoadingButton"
import { MoveMenuHeader, DirMenuItem, FileMenuItem } from "components/move"
import _ from "lodash"
import { useState } from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, getLastItemType, getNextItemType } from "utils"
// eslint-disable-next-line import/prefer-default-export
export const PageMoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState(_.omit(queryParams, "fileName"))
  const [moveTo, setMoveTo] = useState(params)
  const { data: dirData } = useGetDirectoryHook(moveQuery)

  const nextItemType = getNextItemType(moveQuery)
  const lastItemType = getLastItemType(moveQuery)

  const MenuItems = () => {
    // Directories
    if (dirData && dirData.length) {
      return (
        <>
          {dirData
            .filter(({ type }) => type === "dir")
            .map(({ name }, itemIndex) => (
              <DirMenuItem
                name={name}
                id={itemIndex}
                onClick={() => {
                  setMoveTo({
                    ...moveQuery,
                    [nextItemType]: name,
                  })
                  setMoveQuery((prevState) => ({
                    ...prevState,
                    [nextItemType]: encodeURIComponent(name),
                  }))
                }}
              />
            ))}
          {/* files */}
          {dirData
            .filter(({ type }) => type === "file")
            .map(({ name }, itemIndex) => (
              <FileMenuItem
                name={name}
                id={itemIndex}
                isResource={!!moveQuery.resourceRoomName}
              />
            ))}
        </>
      )
    }

    return (
      <div
        className={`${elementStyles.dropdownItemDisabled} d-flex justify-content-center`}
      >
        {dirData ? (
          "No pages here yet."
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
          <h1>Move page</h1>
          <CloseButton id="settings-CLOSE" onClick={onClose} />
        </div>
        <div className={elementStyles.modalContent}>
          <div>
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
              <MoveMenuHeader
                onBack={() => {
                  setMoveQuery(_.omit(moveQuery, lastItemType))
                  setMoveTo(_.omit(moveQuery, lastItemType))
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
              <MenuItems />
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
          <HStack w="100%" justify="flex-end" paddingInlineEnd={1}>
            <LoadingButton
              onClick={() =>
                onProceed({
                  target: _.omit(moveTo, ["siteName", "fileName"]),
                  items: [{ name: params.fileName, type: "file" }],
                })
              }
              isDisabled={
                moveTo.resourceRoomName && !moveTo.resourceCategoryName
              }
            >
              Move Here
            </LoadingButton>
          </HStack>
        </div>
      </div>
    </div>
  )
}
