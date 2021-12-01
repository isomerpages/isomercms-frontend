import axios from "axios"
import { MenuDropdown } from "components/MenuDropdown"
import PropTypes from "prop-types"
import React, { useEffect, useState, useRef } from "react"
import { Link, useRouteMatch } from "react-router-dom"

import useRedirectHook from "hooks/useRedirectHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

// Import utils
import { prettifyDate, pageFileNameToTitle } from "utils"

// axios settings
axios.defaults.withCredentials = true

const PageCard = ({ item, itemIndex }) => {
  const { title, name, date, resourceType } = item
  const dropdownRef = useRef(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const {
    url,
    params: { siteName, resourceRoomName },
  } = useRouteMatch()

  const { setRedirectToPage } = useRedirectHook()

  const generateLink = () => {
    if (resourceType === "file")
      // TODO: implement file preview on CMS
      return "#"
    const encodedName = encodeURIComponent(name)
    if (resourceType || resourceRoomName) {
      // use resourceRoomName in case resourcePage does not have format Date-Type-Name.md
      // for resourcePages that are not migrated
      return `${url}/editPage/${encodedName}`
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
      className={`${contentStyles.component} ${
        resourceType === "file"
          ? contentStyles.cardDisabled
          : contentStyles.card
      } ${elementStyles.card}`}
      to={generateLink()}
    >
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <h1
          className={
            resourceType === "file"
              ? contentStyles.componentTitle
              : contentStyles.componentTitleLink
          }
        >
          {pageFileNameToTitle(name, !!resourceType)}
        </h1>
        <p className={contentStyles.componentDate}>{`${
          date ? prettifyDate(date) : ""
        }${resourceType ? `/${resourceType.toUpperCase()}` : ""}`}</p>
      </div>
      <div className="position-relative mt-auto">
        <button
          type="button"
          id={`pageCard-dropdown-${name}-${itemIndex}`}
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
}

export default PageCard
