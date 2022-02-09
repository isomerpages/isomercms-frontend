import PropTypes from "prop-types"
import React, { useEffect } from "react"

import FormField from "components/FormField"
import { CardContainer } from "components/CardContainer"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { EditorResourcesSchema } from "."

export const EditorResourcesSection = ({
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
    resolver: yupResolver(EditorResourcesSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      button: "",
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
      cardTitle={`Resources section: ${watch("title")}`}
      isError={!!!errors}
    >
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Resources section subtitle"
          id={`subtitle`}
          errorMessage={errors.subtitle?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Resources section title"
          id={`title`}
          errorMessage={errors.title?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Resources button name"
          id={`button`}
          errorMessage={errors.button?.message}
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

export default EditorResourcesSection

EditorResourcesSection.propTypes = {
  sectionContent: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    button: PropTypes.string,
  }),
  sectionIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
