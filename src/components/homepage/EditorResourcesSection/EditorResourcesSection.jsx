import PropTypes from "prop-types"
import React, { useEffect } from "react"

import FormField from "components/FormField"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { EditorResourcesSchema } from "."

import { isEmpty } from "utils"

export const EditorResourcesSection = ({
  sectionContent,
  sectionIndex,
  deleteHandler,
  shouldDisplay = true, // temporary
  displayHandler = () => {}, //temporary
  onUpdate,
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

  watch((data) => onUpdate((({ displayFields, ...d }) => d)(data))) // updates parent component (EditHomepage) when form values are changed

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
    <div
      className={`${elementStyles.card} ${
        !shouldDisplay && !isEmpty(errors) ? elementStyles.error : ""
      } move`}
    >
      <div className={elementStyles.cardHeader}>
        <h2>Resources section: {watch("title")}</h2>
        <button
          className="pl-3"
          type="button"
          id={`section-${sectionIndex}`}
          onClick={displayHandler}
        >
          <i
            className={`bx ${
              shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
            }`}
            id={`section-${sectionIndex}-icon`}
          />
        </button>
      </div>
      {shouldDisplay ? (
        <>
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
        </>
      ) : null}
    </div>
  )
}

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
