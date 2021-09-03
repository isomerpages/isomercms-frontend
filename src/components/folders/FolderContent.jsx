import React, { useState, useEffect, useRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"
import PropTypes from "prop-types"

import { MenuDropdown } from "../MenuDropdown"

import useRedirectHook from "../../hooks/useRedirectHook"

// Import styles
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../../styles/isomer-cms/pages/Content.module.scss"

const FolderItem = ({ item, itemIndex, isDisabled }) => {
  const { url } = useRouteMatch()
  const { setRedirectToPage } = useRedirectHook()

  const { name, type, children } = item
  const dropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const generateLink = ({ type, name }, url) =>
    type === "dir" ? `${url}/subfolders/${name}` : `${url}/editPage/${name}`

  const generateDropdownItems = ({ type, name }, url) => {
    const dropdownItems = [
      {
        type: "edit",
        handler: () => {
          type === "dir"
            ? setRedirectToPage(`${url}/editSubfolderSettings/${name}`)
            : setRedirectToPage(`${url}/editPageSettings/${name}`)
        },
      },
      {
        type: "move",
        handler: () => setRedirectToPage(`${url}/movePage/${name}`),
      },
      {
        type: "delete",
        handler: () => {
          type === "dir"
            ? setRedirectToPage(`${url}/deleteSubfolder/${name}`)
            : setRedirectToPage(`${url}/deletePage/${name}`)
        },
      },
    ]
    if (type === "file") return dropdownItems
    return dropdownItems.filter((dropdownItem) => dropdownItem.type !== "move")
  }

  useEffect(() => {
    if (showDropdown) dropdownRef.current.focus()
  }, [showDropdown])

  return (
    <Link
      className={`${contentStyles.component} ${contentStyles.card}`}
      to={isDisabled ? "#" : generateLink(item, url)}
    >
      <div
        type="button"
        className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.folderItem}`}
      >
        <div className={contentStyles.contentContainerFolderRow}>
          {type === "file" ? (
            <i
              className={`bx bxs-file-blank ${elementStyles.folderItemIcon}`}
            />
          ) : (
            <i className={`bx bxs-folder ${elementStyles.folderItemIcon}`} />
          )}
          <span className={`${elementStyles.folderItemText} mr-auto`}>
            {name}
          </span>
          {children ? (
            <span className={`${elementStyles.folderItemText} mr-5`}>
              {children.length} item{children.length === 1 ? "" : "s"}
            </span>
          ) : null}
          {!isDisabled && (
            <div className="position-relative mt-auto mb-auto">
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
                  setShowDropdown((prevState) => !prevState)
                }}
              >
                <i className="bx bx-dots-vertical-rounded" />
              </button>
              {showDropdown && (
                <MenuDropdown
                  menuIndex={itemIndex}
                  dropdownItems={generateDropdownItems(item, url)}
                  dropdownRef={dropdownRef}
                  tabIndex={2}
                  onBlur={() => setShowDropdown(false)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

const FolderContent = ({ dirData }) => {
  return (
    <div className={`${contentStyles.contentContainerFolderColumn} mb-5`}>
      {dirData.map((item) => (
        <FolderItem key={item.name} item={item} />
      ))}
    </div>
  )
}

export { FolderContent, FolderItem }
