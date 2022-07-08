import { CloseButton, HStack } from "@chakra-ui/react"
import { Breadcrumb } from "components/folders/Breadcrumb"
import { LoadingButton } from "components/LoadingButton"
import { MoveMenuHeader, DirMenuItem, FileMenuItem } from "components/move"
import _ from "lodash"
import PropTypes from "prop-types"
import { useState } from "react"

import { useGetDirectoryHook } from "hooks/directoryHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, getMediaDirectoryName } from "utils"

export const MediaMoveModal = ({ queryParams, params, onProceed, onClose }) => {
  const [moveQuery, setMoveQuery] = useState(_.omit(queryParams, "fileName"))
  const [moveTo, setMoveTo] = useState(params)
  console.log(params, queryParams)
  const { data: dirData } = useGetDirectoryHook(moveQuery)

  const MenuItems = () => {
    if (dirData && dirData.length)
      return (
        <>
          {/* directories */}
          {dirData
            .filter(({ type }) => type === "dir")
            .map(({ name }, itemIndex) => (
              <DirMenuItem
                name={name}
                id={itemIndex}
                onClick={() => {
                  setMoveTo({
                    ...moveQuery,
                    mediaDirectoryName: `${getMediaDirectoryName(
                      moveQuery.mediaDirectoryName,
                      { joinOn: "/", decode: true }
                    )}/${name}`,
                  })
                  setMoveQuery((prevState) => ({
                    ...prevState,
                    mediaDirectoryName: `${
                      moveQuery.mediaDirectoryName
                    }%2F${encodeURIComponent(name)}`,
                  }))
                }}
              />
            ))}
          {/* files */}
          {dirData
            .filter(({ type }) => type === "file")
            .map(({ name }, itemIndex) => (
              <FileMenuItem name={name} id={itemIndex} />
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
          <CloseButton id="settings-CLOSE" onClick={onClose} />
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
              <MoveMenuHeader
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
          <HStack w="100%" justify="flex-end" paddingInlineEnd={1}>
            <LoadingButton
              onClick={() =>
                onProceed({
                  target: { directoryName: moveTo.mediaDirectoryName },
                  items: [{ name: params.fileName, type: "file" }],
                })
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

export default MediaMoveModal

MediaMoveModal.propTypes = {
  queryParams: PropTypes.shape({
    siteName: PropTypes.string,
    mediaDirectoryName: PropTypes.string,
    mediaRoom: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  params: PropTypes.shape({
    siteName: PropTypes.string,
    mediaDirectoryName: PropTypes.string,
    mediaRoom: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  onProceed: PropTypes.func,
  onClose: PropTypes.func,
}
