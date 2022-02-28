import PropTypes from "prop-types"
import React from "react"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useFormContext } from "react-hook-form"
import { CardContainer } from "components/CardContainer"
import _ from "lodash"

export const EditorInfopicSection = ({
  fieldId, // sections.[sectionId].infopic
  deleteHandler,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext()
  const sectionErrors = _.get(errors, fieldId)

  return (
    <CardContainer
      cardTitle={`Infopic section: ${watch(`${fieldId}.title`)}`}
      isError={!_.isEmpty(sectionErrors)}
    >
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Infopic subtitle"
          id={`${fieldId}.subtitle`}
          errorMessage={sectionErrors?.subtitle?.message}
        />
        <FormField
          register={register}
          title="Infopic title"
          id={`${fieldId}.title`}
          errorMessage={sectionErrors?.title?.message}
        />
        <FormField
          register={register}
          title="Infopic description"
          id={`${fieldId}.description`}
          errorMessage={sectionErrors?.description?.message}
        />
        <FormField
          register={register}
          title="Infopic button name"
          id={`${fieldId}.button`}
          errorMessage={sectionErrors?.button?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infopic button URL"
          placeholder="Insert permalink or external URL"
          id={`${fieldId}.url`}
          errorMessage={sectionErrors?.url?.message}
          isRequired
        />
        <FormContext
          hasError={!!sectionErrors?.image?.message}
          isRequired
          onFieldChange={(e) => setValue(`${fieldId}.image`, e.target.value)}
        >
          <FormTitle>Infopic image URL</FormTitle>
          <FormFieldMedia
            id={`${fieldId}.image`}
            inlineButtonText="Choose Image"
            register={register}
          />
          <FormError>{sectionErrors?.image?.message}</FormError>
        </FormContext>
        <FormField
          register={register}
          title="Infopic image alt text"
          id={`${fieldId}.alt`}
          errorMessage={sectionErrors?.alt?.message}
          isRequired
        />
      </div>
      <div className={elementStyles.inputGroup}>
        <button
          type="button"
          id={`${fieldId}-delete`}
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
