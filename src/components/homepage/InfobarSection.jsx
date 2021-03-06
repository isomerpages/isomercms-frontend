import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import FormField from "../FormField"
import { isEmpty } from "../../utils"

/* eslint
  react/no-array-index-key: 0
 */

const EditorInfobarSection = ({
  title,
  subtitle,
  description,
  button,
  url,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div
    className={`${elementStyles.card} ${
      !shouldDisplay && !isEmpty(errors) ? elementStyles.error : ""
    } move`}
  >
    <div className={elementStyles.cardHeader}>
      <h2>Infobar section: {title}</h2>
      <button
        className="pl-3"
        type="button"
        id={`section-${sectionIndex}`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`section-${sectionIndex}-icon`}
        />
      </button>
    </div>
    {shouldDisplay ? (
      <>
        <div className={elementStyles.cardContent}>
          <FormField
            title="Infobar subtitle"
            id={`section-${sectionIndex}-infobar-subtitle`}
            value={subtitle}
            errorMessage={errors.subtitle}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Infobar title"
            id={`section-${sectionIndex}-infobar-title`}
            value={title}
            errorMessage={errors.title}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Infobar description"
            id={`section-${sectionIndex}-infobar-description`}
            value={description}
            errorMessage={errors.description}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Infobar button name"
            id={`section-${sectionIndex}-infobar-button`}
            value={button}
            errorMessage={errors.button}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Infobar button URL"
            placeholder="Insert permalink or external URL"
            id={`section-${sectionIndex}-infobar-url`}
            value={url}
            errorMessage={errors.url}
            isRequired
            onFieldChange={onFieldChange}
          />
        </div>
        <div className={elementStyles.inputGroup}>
          <button
            type="button"
            id={`section-${sectionIndex}`}
            className={`ml-auto ${elementStyles.warning}`}
            onClick={deleteHandler}
          >
            Delete section
          </button>
        </div>
      </>
    ) : null}
  </div>
)

export default EditorInfobarSection

EditorInfobarSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string,
  url: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
}
