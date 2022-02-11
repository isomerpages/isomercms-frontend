import PropTypes from "prop-types"
import React, { useEffect } from "react"

import FormField from "components/FormField"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useForm } from "react-hook-form"
import { CardContainer } from "components/CardContainer"

import { EditorInfobarSchema } from "."
import { yupResolver } from "@hookform/resolvers/yup"
import _ from "lodash"

export const EditorInfobarSection = ({
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
    resolver: yupResolver(EditorInfobarSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      description: "",
      button: "",
      url: "",
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
      cardTitle={`Infobar section: ${watch("title")}`}
      isError={!_.isEmpty(errors)}
    >
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Infobar subtitle"
          id="subtitle"
          errorMessage={errors.subtitle?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar title"
          id={`title`}
          errorMessage={errors.title?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar description"
          id={`description`}
          errorMessage={errors.description?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar button name"
          id={`button`}
          errorMessage={errors.button?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar button URL"
          placeholder="Insert permalink or external URL"
          id={`url`}
          errorMessage={errors.url?.message}
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

EditorInfobarSection.propTypes = {
  sectionContent: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
  }),
  sectionIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
}
