import React from "react"

import PropTypes from "prop-types"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"

import FormField from "@components/FormField"

/* eslint
  react/no-array-index-key: 0
 */

const KeyHighlight = ({
  title,
  description,
  url,
  highlightIndex,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  deleteHandler,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>{title}</h2>
      <button
        className="pl-3"
        type="button"
        id={`highlight-${highlightIndex}-toggle`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`highlight-${highlightIndex}-icon`}
        />
      </button>
    </div>
    {/* Core highlight fields */}
    {shouldDisplay ? (
      <>
        <div className={elementStyles.cardContent}>
          <FormField
            title="Highlight title"
            id={`highlight-${highlightIndex}-title`}
            value={title}
            errorMessage={errors.title}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Highlight description"
            id={`highlight-${highlightIndex}-description`}
            value={description}
            errorMessage={errors.description}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Highlight URL"
            placeholder="Insert permalink or external URL"
            id={`highlight-${highlightIndex}-url`}
            value={url}
            errorMessage={errors.url}
            isRequired
            onFieldChange={onFieldChange}
          />
        </div>
        <div className={elementStyles.inputGroup}>
          <button
            type="button"
            id={`highlight-${highlightIndex}-delete`}
            className={`ml-auto ${elementStyles.warning}`}
            onClick={deleteHandler}
            key={`${highlightIndex}-delete`}
          >
            Delete highlight
          </button>
        </div>
      </>
    ) : null}
  </div>
)

export default KeyHighlight

KeyHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  highlightIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}
