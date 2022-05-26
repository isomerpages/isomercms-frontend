import { IconButton } from "@opengovsg/design-system-react"
import { MenuDropdown } from "components/MenuDropdown"
import PropTypes from "prop-types"
import { useState, useRef, useEffect } from "react"
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

  const generateDropdownItems = () => {
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
    <button
      type="button"
      className={`${isSelected ? mediaStyles.selectedMediaCard : ""} ${
        mediaStyles.mediaCard
      }`}
      key={name}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        if (onClick) {
          onClick()
        } else
          setRedirectToPage(
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
            <IconButton
              variant="clear"
              id={`${name}-settings-${mediaItemIndex}`}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowDropdown(true)
              }}
            >
              <i className="bx bx-dots-vertical-rounded" />
            </IconButton>
            {showDropdown && (
              <MenuDropdown
                menuIndex={mediaItemIndex}
                dropdownItems={generateDropdownItems({ name }, url)}
                dropdownRef={dropdownRef}
                onBlur={() => setShowDropdown(false)}
              />
            )}
          </div>
        )}
      </div>
    </button>
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
