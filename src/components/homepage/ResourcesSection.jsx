import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

import { FormError } from "components/Form"
import FormContext from "components/Form/FormContext"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

/* eslint
  react/no-array-index-key: 0
 */

const EditorResourcesSection = ({
  title,
  subtitle,
  button,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  errors,
}) => (
  <>
    <div className={elementStyles.cardContent}>
      <FormContext isRequired hasError={!!errors.subtitle}>
        <FormTitle>Resources section subtitle</FormTitle>
        <FormField
          placeholder="Resources section subtitle"
          id={`section-${sectionIndex}-resources-subtitle`}
          value={subtitle}
          onChange={onFieldChange}
        />
        <FormError>{errors.subtitle}</FormError>
      </FormContext>
      <FormContext isRequired hasError={!!errors.title}>
        <FormTitle>Resources section title</FormTitle>
        <FormField
          placeholder="Resources section title"
          id={`section-${sectionIndex}-resources-title`}
          value={title}
          onChange={onFieldChange}
        />
        <FormError>{errors.title}</FormError>
      </FormContext>
      <FormContext isRequired hasError={!!errors.button}>
        <FormTitle>Resources button name</FormTitle>
        <FormField
          placeholder="Resources button name"
          id={`section-${sectionIndex}-resources-button`}
          value={button}
          onChange={onFieldChange}
        />
        <FormError>{errors.button}</FormError>
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

export default EditorResourcesSection

EditorResourcesSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
}
