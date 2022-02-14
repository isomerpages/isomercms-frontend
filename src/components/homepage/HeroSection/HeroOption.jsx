import PropTypes from "prop-types"
import React, { useEffect } from "react"

import { useForm } from "react-hook-form"

import FormField from "components/FormField"
import { yupResolver } from "@hookform/resolvers/yup"
import { HeroHighlightOptionSchema, HeroDropdownOptionSchema } from "."
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { CardContainer } from "components/CardContainer"
import _ from "lodash"

export const HeroOption = ({
  optionContent,
  deleteHandler,
  optionIndex,
  onUpdate,
  isHighlight,
}) => {
  const {
    register,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      isHighlight ? HeroHighlightOptionSchema : HeroDropdownOptionSchema
    ),
    defaultValues: optionContent,
  })

  /** ****************** */
  /*   useForm effects   */
  /** ****************** */

  watch((data) => !_.isEqual(data, optionContent) && onUpdate(data)) // updates parent component (HeroDropdwon/HeroHighlights) when form values are changed
  useEffect(() => {
    trigger()
  }, []) // triggers validation when component is mounted

  return (
    <CardContainer cardTitle={watch("title")} isError={!_.isEmpty(errors)}>
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Title"
          id={`title`}
          errorMessage={errors.title?.message}
          isRequired
        />
        <FormField
          register={register}
          title="URL"
          placeholder="Insert permalink or external URL"
          id={`url`}
          errorMessage={errors.url?.message}
          isRequired
        />
        {isHighlight && (
          <FormField
            register={register}
            title="Description"
            id={`description`}
            errorMessage={errors.description?.message}
            isRequired
          />
        )}
      </div>
      <div className={elementStyles.inputGroup}>
        <button
          type="button"
          id={`highlight-${optionIndex}-delete`}
          className={`ml-auto ${elementStyles.warning}`}
          onClick={deleteHandler}
          key={`${optionIndex}-delete`}
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
