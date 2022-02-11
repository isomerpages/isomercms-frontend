import PropTypes from "prop-types"
import React, { useEffect } from "react"

import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useForm } from "react-hook-form"

import { CardContainer } from "components/CardContainer"
import { EditorInfopicSchema } from "."
import { yupResolver } from "@hookform/resolvers/yup"
import _ from "lodash"

export const EditorInfopicSection = ({
  sectionContent,
  sectionIndex,
  onUpdate,
  deleteHandler,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(EditorInfopicSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      button: "",
      url: "",
      imageUrl: "",
      alt: "",
    },
  })

  watch((data) => onUpdate(data)) // updates parent component (EditHomepage) when form values are changed

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (sectionContent) {
      Object.entries(sectionContent).forEach(([key, value]) => {
        setValue(key, value, {
          shouldValidate: true,
        })
      })
    }
  }, [])

  return (
    <CardContainer
      cardTitle={`Infopic section: ${watch("title")}`}
      isError={!_.isEmpty(errors)}
    >
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Infopic subtitle"
          id={`subtitle`}
          errorMessage={errors.subtitle?.message}
        />
        <FormField
          register={register}
          title="Infopic title"
          id={`title`}
          errorMessage={errors.title?.message}
        />
        <FormField
          register={register}
          title="Infopic description"
          id={`description`}
          errorMessage={errors.description?.message}
        />
        <FormField
          register={register}
          title="Infopic button name"
          id={`button`}
          errorMessage={errors.button?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infopic button URL"
          placeholder="Insert permalink or external URL"
          id={`url`}
          errorMessage={errors.url?.message}
          isRequired
        />
        <FormFieldMedia
          register={register}
          title="Infopic image URL"
          id={`image`}
          errorMessage={errors.image?.message}
          isRequired
          inlineButtonText="Choose Image"
          placeholder=" "
          type="images"
          onFieldChange={(e) => setValue("image", e.target.value)} // temporary workaround before refactoring FormFieldMedia
        />
        <FormField
          register={register}
          title="Infopic image alt text"
          id={`alt`}
          errorMessage={errors.alt?.message}
          isRequired
        />
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
    </CardContainer>
  )
}

EditorInfopicSection.propTypes = {
  sectionContent: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
    imageUrl: PropTypes.string,
    alt: PropTypes.string,
  }),
  sectionIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
