import { Button, IconButton } from "@opengovsg/design-system-react"
import { FormError } from "components/Form"
import FormContext from "components/Form/FormContext"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { isEmpty } from "utils"

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
      <h2>Resources section: {title}</h2>
      <IconButton
        variant="clear"
        id={`section-${sectionIndex}`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`section-${sectionIndex}-icon`}
        />
      </IconButton>
    </div>
    {shouldDisplay ? (
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
            colorScheme="danger"
            w="100%"
            id={`section-${sectionIndex}`}
            onClick={deleteHandler}
          >
            Delete section
          </Button>
        </div>
      </>
    ) : null}
  </div>
)

export default EditorResourcesSection

EditorResourcesSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
}
