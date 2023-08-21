import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

/* eslint
  react/no-array-index-key: 0
 */

const EditorInfopicSection = ({
  title,
  subtitle,
  description,
  button,
  url,
  imageUrl,
  imageAlt,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  errors,
}) => (
  <>
    <div className={elementStyles.cardContent}>
      <FormContext hasError={!!errors.subtitle}>
        <FormTitle>Infopic subtitle</FormTitle>
        <FormField
          placeholder="Infopic subtitle"
          id={`section-${sectionIndex}-infopic-subtitle`}
          value={subtitle}
          onChange={onFieldChange}
        />
        <FormError>{errors.subtitle}</FormError>
      </FormContext>
      <FormContext hasError={!!errors.title}>
        <FormTitle>Infopic title</FormTitle>
        <FormField
          placeholder="Infopic title"
          id={`section-${sectionIndex}-infopic-title`}
          value={title}
          onChange={onFieldChange}
        />
        <FormError>{errors.title}</FormError>
      </FormContext>
      <FormContext hasError={!!errors.description}>
        <FormTitle>Infopic description</FormTitle>
        <FormField
          placeholder="Infopic description"
          id={`section-${sectionIndex}-infopic-description`}
          value={description}
          onChange={onFieldChange}
        />
        <FormError>{errors.description}</FormError>
      </FormContext>
      <FormContext isRequired hasError={!!errors.button}>
        <FormTitle>Infopic button name</FormTitle>
        <FormField
          placeholder="Infopic button name"
          id={`section-${sectionIndex}-infopic-button`}
          value={button}
          onChange={onFieldChange}
        />
        <FormError>{errors.button}</FormError>
      </FormContext>
      <FormContext isRequired hasError={errors.url}>
        <FormTitle>Infopic button URL</FormTitle>
        <FormField
          placeholder="Insert /page-url or https://"
          id={`section-${sectionIndex}-infopic-url`}
          value={url}
          onChange={onFieldChange}
        />
        <FormError>{errors.url}</FormError>
      </FormContext>
      <FormContext
        hasError={!!errors.image}
        onFieldChange={onFieldChange}
        isRequired
      >
        <FormTitle>Infopic image URL</FormTitle>
        <FormFieldMedia
          value={imageUrl}
          id={`section-${sectionIndex}-infopic-image`}
          inlineButtonText="Select"
        />
        <FormError>{errors.image}</FormError>
      </FormContext>
      <FormContext isRequired hasError={!!errors.alt}>
        <FormTitle>Infopic image alt text</FormTitle>
        <FormField
          placeholder="Infopic image alt text"
          id={`section-${sectionIndex}-infopic-alt`}
          value={imageAlt}
          onChange={onFieldChange}
        />
        <FormError>{errors.alt}</FormError>
      </FormContext>
    </div>
    <div className={elementStyles.inputGroup}>
      <Button
        colorScheme="critical"
        w="100%"
        id={`section-${sectionIndex}`}
        onClick={deleteHandler}
      >
        Delete section
      </Button>
    </div>
  </>
)

export default EditorInfopicSection

EditorInfopicSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string,
  url: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
  }).isRequired,
}
