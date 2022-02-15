import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { FormContext } from "components/Form"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import PropTypes from "prop-types"
import React from "react"
import { useForm, useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import {
  deslugifyDirectory,
  getLastItemType,
  getMediaDirectoryName,
} from "utils"

import { DirectorySettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

const getModalTitle = ({ isCreate, params }) => {
  const {
    subCollectionName,
    collectionName,
    resourceRoomName,
    mediaDirectoryName,
  } = params
  if (isCreate) {
    if (resourceRoomName) return "Create new resource category"
    if (collectionName) return "Create new subfolder"
    if (mediaDirectoryName) return "Create new directory"
    return "Create new folder"
  }
  if (resourceRoomName) return "Resource category settings"
  if (subCollectionName) return "Subfolder settings"
  if (mediaDirectoryName) return "Directory settings"
  return "Folder settings"
}

// eslint-disable-next-line import/prefer-default-export
export const DirectorySettingsModal = ({
  isCreate,
  params,
  dirsData,
  onProceed,
  onClose,
}) => {
  const { subCollectionName, mediaDirectoryName } = params
  const existingDirectoryName = mediaDirectoryName
    ? getMediaDirectoryName(mediaDirectoryName, { start: -1, splitOn: "/" })
    : params[getLastItemType(params)]

  const existingTitlesArray = dirsData
    .filter((item) => item.name !== existingDirectoryName)
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
        newDirectoryName: deslugifyDirectory(existingDirectoryName),
      },
      context: {
        type: mediaDirectoryName
          ? "mediaDirectoryName"
          : subCollectionName
          ? "subCollectionName"
          : "collectionName",
      },
    })

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) =>
    onProceed({
      newDirectoryName: mediaDirectoryName
        ? `${getMediaDirectoryName(mediaDirectoryName, {
            end: -1,
            splitOn: "/",
            joinOn: "/",
          })}/${data.newDirectoryName}`
        : data.newDirectoryName,
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
          <FormContext hasError={!!errors.newDirectoryName?.message}>
            <FormTitle>Title</FormTitle>
            <FormField
              {...register("newDirectoryName")}
              id="newDirectoryName"
            />
            <FormError>{errors.newDirectoryName?.message}</FormError>
          </FormContext>
          <SaveDeleteButtons
            saveLabel={isCreate && "Next"}
            isDisabled={!_.isEmpty(errors)}
            hasDeleteButton={false}
            saveCallback={handleSubmit(onSubmit)}
          />
        </form>
      </div>
    </div>
  )
}

DirectorySettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
