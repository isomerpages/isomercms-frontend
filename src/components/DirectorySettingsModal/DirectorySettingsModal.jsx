import { CloseButton, HStack } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { FormContext } from "components/Form"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import { LoadingButton } from "components/LoadingButton"
import _ from "lodash"
import PropTypes from "prop-types"
import { useForm, useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getDirectorySettingsType } from "utils/directoryUtils"

import {
  deslugifyDirectory,
  getLastItemType,
  getMediaDirectoryName,
} from "utils"

import { DirectorySettingsSchema } from "./DirectorySettingsSchema"

// axios settings
axios.defaults.withCredentials = true

const getModalTitle = ({ isCreate, params }) => {
  const {
    mediaRoom,
    subCollectionName,
    collectionName,
    resourceRoomName,
    mediaDirectoryName,
  } = params
  if (isCreate) {
    if (resourceRoomName) return "Create new resource category"
    if (collectionName) return "Create new subfolder"
    if (mediaDirectoryName)
      return `Create new ${mediaRoom === "images" ? "album" : "directory"}`
    return "Create new folder"
  }
  if (resourceRoomName) return "Resource category settings"
  if (subCollectionName) return "Subfolder settings"
  if (mediaDirectoryName)
    return `${mediaRoom === "images" ? "Album" : "Directory"} settings`
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
  const { subCollectionName, resourceRoomName, mediaDirectoryName } = params
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
      mode: "onTouched",
      resolver: yupResolver(DirectorySettingsSchema(existingTitlesArray)),
      defaultValues: {
        newDirectoryName: deslugifyDirectory(existingDirectoryName),
      },
      context: {
        type: getDirectorySettingsType(
          mediaDirectoryName,
          resourceRoomName,
          subCollectionName
        ),
      },
    })

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) =>
    onProceed({
      data,
      mediaDirectoryName,
    })

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>{getModalTitle({ isCreate, params })}</h1>
          <CloseButton onClick={onClose} />
        </div>
        <form className={elementStyles.modalContent}>
          <FormContext hasError={!!errors.newDirectoryName?.message}>
            <FormTitle>Title</FormTitle>
            <FormField
              placeholder="Title"
              id="newDirectoryName"
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...register("newDirectoryName")}
            />
            <FormError>{errors.newDirectoryName?.message}</FormError>
          </FormContext>
          <HStack
            w="100%"
            pt="20px"
            spacing={2}
            justifyContent="flex-end"
            paddingInlineEnd={1}
          >
            <LoadingButton
              onClick={handleSubmit(onSubmit)}
              isDisabled={!_.isEmpty(errors)}
            >
              {isCreate ? "Next" : "Save"}
            </LoadingButton>
          </HStack>
        </form>
      </div>
    </div>
  )
}

DirectorySettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
