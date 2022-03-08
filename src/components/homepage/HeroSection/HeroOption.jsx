import { CardContainer } from "components/CardContainer"
import FormField from "components/FormField"
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
import { useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

export const HeroOption = ({
  deleteHandler,
  isHighlight,
  fieldId, // This fieldId refers to one of [ 'sections.0.hero.dropdown.options.[optionIndex]', 'sections.0.hero.key_highlights.[optionIndex]' ], and it's a string reference id to the object in useForm
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
  isHighlight: PropTypes.bool.isRequired,
  fieldId: PropTypes.string.isRequired,
  deleteHandler: PropTypes.func.isRequired,
}
