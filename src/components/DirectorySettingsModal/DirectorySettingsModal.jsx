import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { useForm, useFormContext } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import FormField from "components/FormField"
import { getLastItemType } from "utils"
import Breadcrumb from "folders/Breadcrumb"
import { DirectorySettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

export const DirectorySettingsModal = ({
  params,
  dirData,
  onProceed,
  onClose,
}) => {
  const { subCollectionName } = params
  const existingTitlesArray = dirData
    .filter((item) => item.name !== params[getLastItemType(params)])
    .filter((item) => item.type === "dir")
    .map((item) => item.name)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } =
    useFormContext() ||
    useForm({
      mode: "onBlur",
      resolver: yupResolver(DirectorySettingsSchema(existingTitlesArray)),
      defaultValues: {
        newDirectoryName: params[getLastItemType(params)],
      },
    })

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>
            {!subCollectionName ? "Create new subfolder" : "Subfolder settings"}
          </h1>
          <button type="button" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        <Breadcrumb params={params} />
        <form className={elementStyles.modalContent}>
          <FormField
            register={register}
            title="Directory title"
            id="newDirectoryName"
            errorMessage={errors.newDirectoryName?.message}
          />
          <SaveDeleteButtons
            isDisabled={!_.isEmpty(errors)}
            hasDeleteButton={false}
            saveCallback={handleSubmit((data) => onProceed(data))}
          />
        </form>
      </div>
    </div>
  )
}

DirectorySettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
