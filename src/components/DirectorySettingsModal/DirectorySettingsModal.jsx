import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import PropTypes from "prop-types"
import React from "react"
import { useForm, useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { deslugifyDirectory, getLastItemType } from "utils"

import { DirectorySettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

const getModalTitle = ({ isCreate, params }) => {
  const { collectionName, resourceRoomName } = params
  if (isCreate) {
    if (resourceRoomName) return "Create new resource category"
    if (collectionName) return "Create new subfolder"
    return "Create new folder"
  }
  if (resourceRoomName) return "Resource category settings"
  if (collectionName) return "Folder settings"
  return "Subfolder settings"
}

export const DirectorySettingsModal = ({
  isCreate,
  params,
  dirsData,
  onProceed,
  onClose,
}) => {
  const { subCollectionName } = params

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
          <h1>{getModalTitle({ isCreate, params })}</h1>
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
            saveLabel={isCreate && "Next"}
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
