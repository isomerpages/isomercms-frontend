import { CardContainer } from "components/CardContainer"
import FormField from "components/FormField"
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
import { useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

export const EditorInfobarSection = ({
  fieldId, // sections.[sectionId].infobar // string reference id to object in useForm
  deleteHandler,
}) => {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext()
  const sectionErrors = _.get(errors, fieldId)

  return (
    <CardContainer
      cardTitle={`Infobar section: ${watch(`${fieldId}.title`)}`}
      isError={!_.isEmpty(sectionErrors)}
    >
      <div className={elementStyles.cardContent}>
        <FormField
          register={register}
          title="Infobar subtitle"
          id={`${fieldId}.subtitle`}
          errorMessage={sectionErrors?.subtitle?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar title"
          id={`${fieldId}.title`}
          errorMessage={sectionErrors?.title?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar description"
          id={`${fieldId}.description`}
          errorMessage={sectionErrors?.description?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar button name"
          id={`${fieldId}.button`}
          errorMessage={sectionErrors?.button?.message}
          isRequired
        />
        <FormField
          register={register}
          title="Infobar button URL"
          placeholder="Insert permalink or external URL"
          id={`${fieldId}.url`}
          errorMessage={sectionErrors?.url?.message}
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

EditorInfobarSection.propTypes = {
  fieldId: PropTypes.string.isRequired,
  deleteHandler: PropTypes.func.isRequired,
}
