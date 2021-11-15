import PropTypes from "prop-types"
import React, { useState, useEffect, useRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"

import { MenuDropdown } from "components/MenuDropdown"

import useRedirectHook from "hooks/useRedirectHook"

// Import styles
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

const FolderItem = ({ item, itemIndex, isDisabled }) => {
  const { url } = useRouteMatch()
  const { setRedirectToPage } = useRedirectHook()

  const { name, type, children } = item
  const dropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const generateLink = ({ type, name }, url) => {
    const encodedName = encodeURIComponent(name)
    return type === "dir"
      ? `${url}/subfolders/${encodedName}`
      : `${url}/editPage/${encodedName}`
  }

  const generateDropdownItems = ({ type, name }, url) => {
    const encodedName = encodeURIComponent(name)
    const dropdownItems = [
      {
        type: "edit",
        handler: () => {
          type === "dir"
            ? setRedirectToPage(`${url}/editSubfolderSettings/${encodedName}`)
            : setRedirectToPage(`${url}/editPageSettings/${encodedName}`)
        },
      },
      {
        type: "move",
        handler: () => setRedirectToPage(`${url}/movePage/${encodedName}`),
      },
      {
        type: "delete",
        handler: () => {
          type === "dir"
            ? setRedirectToPage(`${url}/deleteSubfolder/${encodedName}`)
            : setRedirectToPage(`${url}/deletePage/${encodedName}`)
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
                id={`folderItem-dropdown-${name}`}
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
      {dirData && dirData.length ? (
        dirData.map((item) => <FolderItem key={item.name} item={item} />)
      ) : dirData && !dirData.length ? (
        <span className="d-flex justify-content-center">
          No pages here yet.
        </span>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
    </div>
  )
}

export { FolderContent, FolderItem }
