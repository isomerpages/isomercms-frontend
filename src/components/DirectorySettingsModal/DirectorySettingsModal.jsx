import React from "react"
import axios from "axios"
import PropTypes from "prop-types"
import { useForm, useFormContext } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import FormField from "components/FormField"
import { deslugifyDirectory, getLastItemType } from "utils"
import { DirectorySettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

export const DirectorySettingsModal = ({
  isCreate,
  params,
  dirsData,
  onProceed,
  onClose,
}) => {
  const { collectionName, subCollectionName } = params

  const existingTitlesArray = dirsData
    .filter((item) => item.name !== params[getLastItemType(params)])
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
        newDirectoryName: deslugifyDirectory(params[getLastItemType(params)]),
      },
      context: {
        type: subCollectionName ? "subCollectionName" : "collectionName",
      },
    })

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>
            {isCreate
              ? collectionName
                ? "Create new subfolder"
                : "Create new folder"
              : subCollectionName
              ? "Subfolder settings"
              : "Folder settings"}
          </h1>
          <button type="button" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        <form className={elementStyles.modalContent}>
          <FormField
            register={register}
            title="Title"
            id="newDirectoryName"
            errorMessage={errors.newDirectoryName?.message}
          />
          <SaveDeleteButtons
            saveLabel={isCreate && "Select pages"}
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
