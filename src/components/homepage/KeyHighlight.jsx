import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

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
    {shouldDisplay && (
      <>
        <div className={elementStyles.cardContent}>
          <FormContext isRequired hasError={!!errors.title}>
            <FormTitle>Highlight title</FormTitle>
            <FormField
              placeholder="Highlight title"
              id={`highlight-${highlightIndex}-title`}
              value={title}
              onChange={onFieldChange}
            />
            <FormError>{errors.title}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.description}>
            <FormTitle>Highlight description</FormTitle>
            <FormField
              placeholder="Highlight description"
              id={`highlight-${highlightIndex}-description`}
              value={description}
              onChange={onFieldChange}
            />
            <FormError>{errors.description}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.url}>
            <FormTitle>Highlight URL</FormTitle>
            <FormField
              placeholder="Insert permalink or external URL"
              id={`highlight-${highlightIndex}-url`}
              value={url}
              onChange={onFieldChange}
            />
            <FormError>{errors.url}</FormError>
          </FormContext>
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
    )}
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
