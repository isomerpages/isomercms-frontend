import PropTypes from "prop-types"
import React from "react"

import { useFormContext } from "react-hook-form"

import FormField from "components/FormField"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { CardContainer } from "components/CardContainer"
import _ from "lodash"

export const HeroOption = ({
  deleteHandler,
  isHighlight,
  fieldId, // sections.0.hero.dropdown.options.[optionIndex] or sections.0.hero.key_highlights.[optionIndex]
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const sectionErrors = _.get(errors, fieldId)

  return (
    <CardContainer
      cardTitle={watch(`${fieldId}.title`)}
      isError={!_.isEmpty(sectionErrors)}
    >
      <div id={fieldId} className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Title"
          id={`${fieldId}.title`}
          errorMessage={sectionErrors?.title?.message}
          isRequired
        />
        <FormField
          register={register}
          title="URL"
          placeholder="Insert permalink or external URL"
          id={`${fieldId}.url`}
          errorMessage={sectionErrors?.url?.message}
          isRequired
        />
        {isHighlight && (
          <FormField
            register={register}
            title="Description"
            id={`${fieldId}.description`}
            errorMessage={sectionErrors?.description?.message}
            isRequired
          />
        )}
      </div>
      <div className={elementStyles.inputGroup}>
        <button
          type="button"
          id={`${fieldId}-delete`}
          className={`ml-auto ${elementStyles.warning}`}
          onClick={deleteHandler}
          key={`${fieldId}-delete`}
        >
          Delete
        </button>
      </div>
    </CardContainer>
  )
}

HeroOption.propTypes = {
  optionContent: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  optionIndex: PropTypes.number.isRequired,
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
