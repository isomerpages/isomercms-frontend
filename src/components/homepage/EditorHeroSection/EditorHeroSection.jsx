import PropTypes from "prop-types"
import React, { useEffect } from "react"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import { HeroDropdown, HeroHighlight } from "components/homepage/HeroSection"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useFormContext } from "react-hook-form"
import { CardContainer } from "components/CardContainer"

import _ from "lodash"

/* eslint
  react/no-array-index-key: 0
 */

export const EditorHeroSection = ({
  fieldId, // sections.0.hero
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext()
  const sectionErrors = _.get(errors, fieldId)

  /** ****************** */
  /*   useForm effects   */
  /** ****************** */
  useEffect(() => {
    if (watch(fieldId).key_highlights) setValue("heroType", "highlights")
    else if (watch(fieldId).dropdown) setValue("heroType", "dropdown")
  }, [])

  return (
    <CardContainer
      cardTitle={"Hero Section"}
      isError={!_.isEmpty(errors)}
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
              {...register("heroType")}
              id="radio-highlights"
              name="heroType"
              value="highlights"
              onChange={(e) => {
                register("heroType").onChange(e)
                setValue("dropdown", {})
              }}
            />
            Highlights + Button
          </label>
          <label htmlFor="radio-dropdown" className="flex-fill">
            <input
              type="radio"
              {...register("heroType")}
              id="radio-dropdown"
              name="heroType"
              value="dropdown"
              onChange={(e) => {
                register("heroType").onChange(e)
                setValue("key_highlights", [])
                setValue("button", "")
                setValue("url", "")
              }}
            />
            Dropdown
          </label>
          <label htmlFor="radio-none" className="flex-fill">
            <input
              type="radio"
              {...register("heroType")}
              id="radio-none"
              name="heroType"
              value="none"
              onChange={(e) => {
                register("heroType").onChange(e)
                setValue("key_highlights", [])
                setValue("button", "")
                setValue("url", "")
                setValue("dropdown", {})
              }}
            />
            None
          </label>
        </div>
      </>
      <br />
      {watch("heroType") === "dropdown" ? (
        <HeroDropdown fieldId={fieldId} />
      ) : watch("heroType") === "highlights" ? (
        <HeroHighlight fieldId={fieldId} />
      ) : null}
    </CardContainer>
  )
}

EditorHeroSection.propTypes = {
  sectionContent: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    background: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
    key_highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string,
      })
    ),
    dropdown: PropTypes.shape({
      options: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          url: PropTypes.string,
        })
      ),
      title: PropTypes.string.isRequired,
    }),
  }),
  onUpdate: PropTypes.func.isRequired,
}
