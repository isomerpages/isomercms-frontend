import { CardContainer } from "components/CardContainer"
import { FormContext, FormError, FormTitle } from "components/Form"
import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import { HeroDropdown, HeroHighlight } from "components/homepage/HeroSection"
import _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

export const EditorHeroSection = ({
  fieldId, // sections.0.hero  // string reference id to object in useForm
}) => {
  const {
    register,
    unregister,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext()
  const sectionErrors = _.get(errors, fieldId)
  const heroType = watch(`${fieldId}.heroType`)

  useEffect(() => {
    // reset highlight and dropdown toggle states
    if (heroType !== "highlights") {
      setValue(`${fieldId}.key_highlights`, [])
      unregister(`${fieldId}.button`)
      unregister(`${fieldId}.url`)
    }
    if (heroType !== "dropdown") {
      unregister(`${fieldId}.dropdown`)
    }
  }, [heroType, unregister, setValue])

  return (
    <CardContainer
      cardTitle="Hero Section"
      isError={!_.isEmpty(sectionErrors)}
      onClose={() => trigger()} // trigger validation when card is closed, prevents unnecessary validation
    >
      <FormField
        register={register}
        title="Hero title"
        id={`${fieldId}.title`}
        errorMessage={sectionErrors?.title?.message}
        isRequired
      />
      <FormField
        register={register}
        title="Hero subtitle"
        id={`${fieldId}.subtitle`}
        errorMessage={sectionErrors?.subtitle?.message}
        isRequired
      />
      <FormContext
        hasError={!!sectionErrors?.background?.message}
        isRequired
        onFieldChange={(e) => setValue(`${fieldId}.background`, e.target.value)}
      >
        <FormTitle>Hero background image</FormTitle>
        <FormFieldMedia
          id={`${fieldId}.background`}
          inlineButtonText="Choose Image"
          register={register}
        />
        <FormError>{sectionErrors?.background?.message}</FormError>
      </FormContext>
      <br />
      <>
        <p className={elementStyles.formLabel}>Hero Section Type</p>
        {/* Permalink or File URL */}
        <div className="d-flex flex-column">
          <label className="flex-fill">
            <input
              type="radio"
              {...register(`${fieldId}.heroType`)}
              id="radio-highlights"
              name={`${fieldId}.heroType`}
              value="highlights"
            />
            Highlights + Button
          </label>
          <label htmlFor="radio-dropdown" className="flex-fill">
            <input
              type="radio"
              {...register(`${fieldId}.heroType`)}
              id="radio-dropdown"
              name={`${fieldId}.heroType`}
              value="dropdown"
            />
            Dropdown
          </label>
          <label htmlFor="radio-none" className="flex-fill">
            <input
              type="radio"
              {...register(`${fieldId}.heroType`)}
              id="radio-none"
              name={`${fieldId}.heroType`}
              value="none"
            />
            None
          </label>
        </div>
      </>
      <br />
      {heroType === "dropdown" ? (
        <HeroDropdown fieldId={`${fieldId}.dropdown`} />
      ) : heroType === "highlights" ? (
        <HeroHighlight fieldId={fieldId} />
      ) : null}
    </CardContainer>
  )
}

EditorHeroSection.propTypes = {
  fieldId: PropTypes.string.isRequired,
}
