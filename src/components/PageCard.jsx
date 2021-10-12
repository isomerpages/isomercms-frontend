import React, { useEffect, useState, useRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"
import axios from "axios"
import PropTypes from "prop-types"
import { MenuDropdown } from "./MenuDropdown"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../styles/isomer-cms/pages/Content.module.scss"

import useRedirectHook from "../hooks/useRedirectHook"

// Import utils
import { prettifyDate, deslugifyDirectory } from "../utils"

// axios settings
axios.defaults.withCredentials = true

const PageCard = ({ item, itemIndex, isDisabled }) => {
  const {
    name,
    date,
    resourceRoomName,
    resourceCategoryName,
    resourceType,
  } = item
  const dropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const {
    url,
    params: { siteName },
  } = useRouteMatch()

  const { setRedirectToPage } = useRedirectHook()

  const generateLink = () => {
    const encodedName = encodeURIComponent(name)
    if (resourceRoomName) {
      return `/sites/${siteName}/resourceRoom/${resourceRoomName}/resources/${resourceCategoryName}/${encodedName}`
    }
    return `/sites/${siteName}/editPage/${encodedName}`
  }

  useEffect(() => {
    if (showDropdown) dropdownRef.current.focus()
  }, [showDropdown])

  const generateDropdownItems = ({ name }, url) => {
    const encodedName = encodeURIComponent(name)
    return [
      {
        type: "edit",
        handler: () =>
          setRedirectToPage(`${url}/editPageSettings/${encodedName}`),
      },
      {
        type: "move",
        handler: () => setRedirectToPage(`${url}/movePage/${encodedName}`),
      },
      {
        type: "delete",
        handler: () => setRedirectToPage(`${url}/deletePage/${encodedName}`),
      },
    ]
  }

  return (
    <Link
      className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`}
      to={
        showDropdown || isDisabled || resourceType === "file"
          ? "#"
          : generateLink()
      }
    >
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <div className={contentStyles.componentCategory}>
          {resourceCategoryName ? deslugifyDirectory(resourceCategoryName) : ""}
        </div>
        <h1
          className={
            resourceType === "file"
              ? contentStyles.componentTitle
              : contentStyles.componentTitleLink
          }
        >
          {name}
        </h1>
        <p className={contentStyles.componentDate}>{`${
          date ? prettifyDate(date) : ""
        }${resourceType ? `/${resourceType.toUpperCase()}` : ""}`}</p>
      </div>
      <div className="position-relative mt-auto">
        <button
          type="button"
          id={`settings-${itemIndex}`}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setShowDropdown(true)
          }}
          className={`${
            showDropdown
              ? contentStyles.optionsIconFocus
              : contentStyles.optionsIcon
          }`}
        >
          <i
            id={`settingsIcon-${itemIndex}`}
            className="bx bx-dots-vertical-rounded"
          />
        </button>
        {showDropdown && (
          <MenuDropdown
            dropdownItems={generateDropdownItems({ name }, url)}
            dropdownRef={dropdownRef}
            menuIndex={itemIndex}
            tabIndex={2}
            onBlur={() => setShowDropdown(false)}
          />
        )}
      </div>
    </Link>
  )
}

PageCard.propTypes = {
  item: PropTypes.shape({
    date: PropTypes.string,
    resourceCategoryName: PropTypes.string,
    name: PropTypes.string.isRequired,
    resourceType: PropTypes.oneOf(["file", "post", ""]),
  }),
  itemIndex: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool,
}

export default PageCard
