// not completely refactored yet, to finish after Media and Resources
// should create separate display component Card without functionality

import React, { useEffect, useRef, useState } from "react"
import { Link, useRouteMatch } from "react-router-dom"
import PropTypes from "prop-types"
import { MenuDropdown } from "../MenuDropdown"
import useRedirectHook from "../../hooks/useRedirectHook"

import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../../styles/isomer-cms/pages/Content.module.scss"
import { prettifyPageFileName } from "../../utils"

export const FolderCard = ({
  displayText,
  itemIndex,
  pageType,
  siteName,
  category,
  selectedIndex,
  linkPath,
  onClick,
}) => {
  const [canShowDropdown, setCanShowDropdown] = useState(false)

  const dropdownRef = useRef(null)
  const { setRedirectToPage } = useRedirectHook()

  const { url } = useRouteMatch()

  useEffect(() => {
    if (canShowDropdown) dropdownRef.current.focus()
  }, [canShowDropdown])

  const generateLink = () => {
    switch (pageType) {
      case "homepage":
        return `/sites/${siteName}/homepage`
      case "collection":
        return `/sites/${siteName}/folders/${category}`
      case "resources":
        return `/sites/${siteName}/resources/${category}`
      case "contact-us":
        return `/sites/${siteName}/contact-us`
      case "nav":
        return `/sites/${siteName}/navbar`
      case "images":
      case "documents":
        return `/sites/${siteName}/${linkPath}`
      default:
        return ""
    }
  }

  const generateImage = (pageType) => {
    switch (pageType) {
      case "homepage":
        return "bxs-home-circle"
      case "contact-us":
        return "bxs-phone"
      case "nav":
        return "bxs-compass"
      case "file":
        return "bxs-file-blank"
      default:
        return "bxs-folder"
    }
  }

  const FolderCardContent = () => (
    <div id={itemIndex} className={`${contentStyles.folderInfo}`}>
      <i
        className={`bx bx-md text-dark ${generateImage(pageType)} ${
          contentStyles.componentIcon
        }`}
      />
      <span
        className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}
      >
        {displayText || prettifyPageFileName(category)}
      </span>
      {pageType === "homepage" ||
      pageType === "contact-us" ||
      pageType === "nav" ||
      pageType === "file" ? (
        ""
      ) : (
        <div className="position-relative mt-auto mb-auto">
          <button
            className={`${
              canShowDropdown
                ? contentStyles.optionsIconFocus
                : contentStyles.optionsIcon
            }`}
            type="button"
            id={`settings-folder-${itemIndex}`}
            onClick={(e) => {
              e.preventDefault()
              setCanShowDropdown(true)
            }}
          >
            <i
              id={`settingsIcon-${itemIndex}`}
              className="bx bx-dots-vertical-rounded"
            />
          </button>
          {canShowDropdown && (
            <MenuDropdown
              dropdownItems={[
                {
                  type: "edit",
                  handler: () =>
                    setRedirectToPage(`${url}/editFolderSettings/${category}`),
                },
                {
                  type: "delete",
                  handler: () =>
                    setRedirectToPage(`${url}/deleteFolder/${category}`),
                },
              ]}
              dropdownRef={dropdownRef}
              menuIndex={itemIndex}
              tabIndex={2}
              onBlur={() => setCanShowDropdown(false)}
            />
          )}
        </div>
      )}
    </div>
  )

  return (
    <>
      {generateLink() ? (
        <Link
          className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`}
          to={generateLink()}
        >
          {FolderCardContent()}
        </Link>
      ) : (
        <div
          id="folderCard-small"
          className={`${contentStyles.component} ${contentStyles.card} ${
            elementStyles.folderCard
          } ${selectedIndex ? `border border-primary` : ""}`}
          onClick={onClick}
        >
          {FolderCardContent()}
          {selectedIndex && (
            <div className={elementStyles.orderCircleContainer}>
              <div className={elementStyles.orderCircle}>{selectedIndex}</div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

FolderCard.propTypes = {
  displayText: PropTypes.string.isRequired,
  settingsToggle: PropTypes.func.isRequired,
  itemIndex: PropTypes.number,
  pageType: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  category: PropTypes.string,
  linkPath: PropTypes.string,
  mediaCustomPath: PropTypes.string,
}
