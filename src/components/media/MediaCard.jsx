import { MenuDropdown } from "components/MenuDropdown"
import PropTypes from "prop-types"
import React, { useState, useRef, useEffect } from "react"
import { useRouteMatch } from "react-router-dom"

import useRedirectHook from "hooks/useRedirectHook"

import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

const MediaCard = ({
  type,
  media,
  mediaItemIndex,
  onClick,
  showSettings = true,
  isSelected = false,
}) => {
  const { name, mediaUrl } = media
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const {
    url,
    params: { mediaRoom },
  } = useRouteMatch()

  const { setRedirectToPage } = useRedirectHook()

  useEffect(() => {
    if (showDropdown) dropdownRef.current.focus()
  }, [showDropdown])

  const generateDropdownItems = ({ name }, url) => {
    const encodedName = encodeURIComponent(name)
    return [
      {
        type: "edit",
        handler: () =>
          setRedirectToPage(`${url}/editMediaSettings/${encodedName}`),
      },
      {
        type: "move",
        handler: () => setRedirectToPage(`${url}/moveMedia/${encodedName}`),
      },
      {
        type: "delete",
        handler: () => setRedirectToPage(`${url}/deleteMedia/${encodedName}`),
      },
    ]
  }

  return (
    <div
      className={
        isSelected ? mediaStyles.selectedMediaCard : mediaStyles.mediaCard
      }
      key={name}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        onClick
          ? onClick()
          : setRedirectToPage(
              `${url}/editMediaSettings/${encodeURIComponent(name)}`
            )
      }}
    >
      {(type === "images" || mediaRoom === "images") && (
        <div className={mediaStyles.mediaCardImagePreviewContainer}>
          <img
            className={mediaStyles.mediaCardImage}
            alt={name}
            // The sanitise parameter is for SVGs. It converts the raw svg data into an image
            src={mediaUrl || "/placeholder_no_image.png"}
          />
        </div>
      )}
      {(mediaRoom === "files" || type === "files") && (
        <div className={mediaStyles.mediaCardFilePreviewContainer}>
          <p>{name.split(".").pop().toUpperCase()}</p>
        </div>
      )}
      <div
        className={`${mediaStyles.mediaCardDescription} ${contentStyles.card} ${contentStyles.component}`}
      >
        <div className={mediaStyles.mediaCardName}>{name}</div>
        {/* Settings dropdown */}
        {showSettings && (
          <div className="position-relative mt-auto mb-auto">
            <button
              className={`${
                showDropdown
                  ? contentStyles.optionsIconFocus
                  : contentStyles.optionsIcon
              }`}
              type="button"
              id={`${name}-settings-${mediaItemIndex}`}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowDropdown(true)
              }}
            >
              <i className="bx bx-dots-vertical-rounded" />
            </button>
            {showDropdown && (
              <MenuDropdown
                menuIndex={mediaItemIndex}
                dropdownItems={generateDropdownItems({ name }, url)}
                dropdownRef={dropdownRef}
                tabIndex={2}
                onBlur={() => setShowDropdown(false)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

MediaCard.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
    mediaUrl: PropTypes.string,
  }).isRequired,
  mediaItemIndex: PropTypes.number,
}

export default MediaCard
