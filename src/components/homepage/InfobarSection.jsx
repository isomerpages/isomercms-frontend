import { FormError } from "components/Form"
import FormContext from "components/Form/FormContext"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { isEmpty } from "utils"

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
          <FormContext isRequired hasError={!!errors.subtitle}>
            <FormTitle>Infobar subtitle</FormTitle>
            <FormField
              placeholder="Infobar subtitle"
              id={`section-${sectionIndex}-infobar-subtitle`}
              value={subtitle}
              onChange={onFieldChange}
            />
            <FormError>{errors.subtitle}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.title}>
            <FormTitle>Infobar title</FormTitle>
            <FormField
              placeholder="Infobar title"
              id={`section-${sectionIndex}-infobar-title`}
              value={title}
              onChange={onFieldChange}
            />
            <FormError>{errors.title}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.description}>
            <FormTitle>Infobar description</FormTitle>
            <FormField
              placeholder="Infobar description"
              id={`section-${sectionIndex}-infobar-description`}
              value={description}
              onChange={onFieldChange}
            />
            <FormError>{errors.description}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.button}>
            <FormTitle>Infobar button name</FormTitle>
            <FormField
              placeholder="Infobar button name"
              id={`section-${sectionIndex}-infobar-button`}
              value={button}
              onChange={onFieldChange}
            />
            <FormError>{errors.button}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.url}>
            <FormTitle>Infobar button URL</FormTitle>
            <FormField
              placeholder="Insert permalink or external URL"
              id={`section-${sectionIndex}-infobar-url`}
              value={url}
              onChange={onFieldChange}
            />
            <FormError>{errors.url}</FormError>
          </FormContext>
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
