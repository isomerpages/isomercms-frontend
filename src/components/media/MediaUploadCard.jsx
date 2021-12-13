import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

const MediaUploadCard = ({ onClick, type }) => (
  <button
    type="button"
    id="settings-NEW"
    onClick={onClick}
    className={`${elementStyles.card} ${contentStyles.card} ${elementStyles.addNew}`}
  >
    <i
      id="settingsIcon-NEW"
      className={`bx bx-plus-circle ${elementStyles.bxPlusCircle}`}
    />
    <h2 id="settingsText-NEW">Upload {type}</h2>
  </button>
)

MediaUploadCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  type: PropTypes.oneOf(["images", "files"]).isRequired,
}

export default MediaUploadCard
