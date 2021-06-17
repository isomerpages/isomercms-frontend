import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

import { deslugifyPage } from "../../utils"
import { MenuDropdown } from "../MenuDropdown"
import FileMoveMenuDropdown from "../FileMoveMenuDropdown"

// Import styles
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../../styles/isomer-cms/pages/Content.module.scss"

const FolderContentItem = ({
  folderContentItem,
  disableLink,
  siteName,
  folderName,
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
  const parseFolderContentItem = (folderContentItem) => {
    const { fileName, children, type, path } = folderContentItem
    const numItems =
      type === "dir"
        ? children.filter((name) => !name.includes(".keep")).length
        : null
    const isFile = type !== "dir"
    const link =
      type === "dir"
        ? `/sites/${siteName}/folder/${folderName}/subfolder/${fileName}`
        : `/sites/${siteName}/folder/${folderName}/${
            path.includes("/") ? `subfolder/` : ""
          }${path}`
    const title = deslugifyPage(fileName)
    return {
      fileName,
      numItems,
      isFile,
      link,
      title,
    }
  }

  const { numItems, isFile, link, title, fileName } = parseFolderContentItem(
    folderContentItem
  )

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
        type: "edit",
        handler: () => {
          if (isFile) setIsPageSettingsActive(true)
          else {
            setIsFolderModalOpen(true)
          }
        },
      },
      {
        type: "move",
        handler: toggleDropdownModals,
      },
      {
        type: "delete",
        handler: () => setIsDeleteModalActive(true),
      },
    ]
    if (isFile) return dropdownItems
    return dropdownItems.filter((item) => item.type !== "move")
  }

  const FolderItemContent = (
    <div
      type="button"
      className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}
    >
      <div className={contentStyles.contentContainerFolderRow}>
        {isFile ? (
          <i className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`} />
        ) : (
          <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
        )}
        <span className={`${elementStyles.folderItemText} mr-auto`}>
          {title}
        </span>
        {numItems !== null ? (
          <span className={`${elementStyles.folderItemText} mr-5`}>
            {numItems} item{numItems === 1 ? "" : "s"}
          </span>
        ) : null}
        <div className="position-relative mt-auto mb-auto">
          {!disableLink && (
            <button
              className={`${
                showDropdown
                  ? contentStyles.optionsIconFocus
                  : contentStyles.optionsIcon
              }`}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setSelectedPage(fileName)
                setShowDropdown(true)
              }}
            >
              <i className="bx bx-dots-vertical-rounded" />
            </button>
          )}
          {showDropdown && (
            <MenuDropdown
              menuIndex={itemIndex}
              dropdownItems={generateDropdownItems()}
              dropdownRef={dropdownRef}
              tabIndex={2}
              onBlur={() => setShowDropdown(false)}
            />
          )}
          {showFileMoveDropdown && (
            <FileMoveMenuDropdown
              dropdownItems={allCategories}
              dropdownRef={fileMoveDropdownRef}
              menuIndex={itemIndex}
              onBlur={handleBlur}
              rootName="Workspace"
              moveDropdownQuery={moveDropdownQuery}
              setMoveDropdownQuery={setMoveDropdownQuery}
              backHandler={toggleDropdownModals}
              moveHandler={() => {
                setSelectedPath(`${moveDropdownQuery || "pages"}`)
                setIsMoveModalActive(true)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )

  return !showFileMoveDropdown && !showDropdown && !disableLink ? (
    <Link
      className={`${contentStyles.component} ${contentStyles.card}`}
      to={link}
    >
      {FolderItemContent}
    </Link>
  ) : (
    <div className={`${contentStyles.component} ${contentStyles.card}`}>
      {FolderItemContent}
    </div>
  )
}

const FolderContent = ({ folderOrderArray, ...rest }) => (
  <div className={`${contentStyles.contentContainerFolderColumn} mb-5`}>
    {folderOrderArray.map((folderContentItem, folderContentIndex) => (
      <FolderContentItem
        key={folderContentItem.fileName}
        folderContentItem={folderContentItem}
        itemIndex={folderContentIndex}
        {...rest}
      />
    ))}
  </div>
)

export { FolderContent, FolderContentItem }

FolderContentItem.propTypes = {
  folderContentItem: PropTypes.shape({
    fileName: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    sha: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  itemIndex: PropTypes.number.isRequired,
  disableLink: PropTypes.bool,
  allCategories: PropTypes.arrayOf(PropTypes.string),
  setSelectedPage: PropTypes.func,
  setSelectedPath: PropTypes.func,
  setIsPageSettingsActive: PropTypes.func,
  setIsFolderModalOpen: PropTypes.func,
  setIsMoveModalActive: PropTypes.func,
  setIsDeleteModalActive: PropTypes.func,
  moveDropdownQuery: PropTypes.string,
  setMoveDropdownQuery: PropTypes.func,
  clearMoveDropdownQueryState: PropTypes.func,
}

FolderContent.propTypes = {
  folderOrderArray: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      type: PropTypes.string,
    })
  ).isRequired,
  rest: PropTypes.object,
}
