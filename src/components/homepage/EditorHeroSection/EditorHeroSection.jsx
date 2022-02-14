import PropTypes from "prop-types"
import React, { useEffect } from "react"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import { HeroDropdown, HeroHighlight } from "components/homepage/HeroSection"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useForm } from "react-hook-form"
import { CardContainer } from "components/CardContainer"

import { EditorHeroSchema } from "."
import { yupResolver } from "@hookform/resolvers/yup"

import _ from "lodash"

/* eslint
  react/no-array-index-key: 0
 */

export const EditorHeroSection = ({ sectionContent, onUpdate }) => {
  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(EditorHeroSchema),
    defaultValues: sectionContent,
  })
  const {
    register,
    unregister,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = methods

  /** ****************** */
  /*   useForm effects   */
  /** ****************** */
  watch((data) => onUpdate(data)) // updates parent component (EditHomepage) when form values are changed
  useEffect(() => {
    if (sectionContent.key_highlights) setValue("heroType", "highlights")
    else if (sectionContent.dropdown) setValue("heroType", "dropdown")
    trigger()
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
        id="title"
        errorMessage={errors.title?.message}
        isRequired
      />
      <FormField
        register={register}
        title="Hero subtitle"
        id="subtitle"
        errorMessage={errors.subtitle?.message}
        isRequired
      />
      <FormContext
        hasError={!!errors.sections[0].hero.background}
        onFieldChange={onFieldChange}
        isRequired
      >
        <FormTitle>Hero background image</FormTitle>
        <FormFieldMedia
          value={background}
          id={`section-${sectionIndex}-hero-background`}
          inlineButtonText="Choose Image"
        />
        <FormError>{errors.sections[0].hero.background}</FormError>
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
        <HeroDropdown
          dropdownContent={watch("dropdown")}
          onUpdate={(data) => setValue("dropdown", data)}
        />
      ) : watch("heroType") === "highlights" ? (
        <HeroHighlight
          highlightsContent={{
            button: sectionContent.button,
            url: sectionContent.url,
            key_highlights: sectionContent.key_highlights,
          }}
          onUpdate={({ key_highlights, button, url }) => {
            setValue("key_highlights", key_highlights)
            setValue("button", button)
            setValue("url", url)
          }}
        />
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
