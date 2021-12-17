import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import Button from "components/Button"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import React, { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { Link } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getLastItemType } from "utils"

import { MediaSettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

const getModalTitle = ({ isCreate, params }) => {
  const { mediaRoom } = params
  if (isCreate) {
    if (mediaRoom === "images") return "Upload new image"
    return "Upload new file"
  }
  if (mediaRoom === "images") return "Image settings"
  return "File settings"
}

export const MediaSettingsModal = ({
  params,
  isCreate,
  mediaData,
  mediasData,
  onProceed,
  onClose,
  toggleUploadInput,
}) => {
  const { mediaRoom, fileName } = params
  const existingTitlesArray = mediasData
    .filter((item) => item.name !== params[getLastItemType(params)])
    .map((item) => item.name)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } =
    useFormContext() ||
    useForm({
      mode: "onBlur",
      resolver: yupResolver(MediaSettingsSchema(existingTitlesArray)),
      context: { mediaRoom },
    })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && mediaData && mediaData.name && mediaData.mediaUrl) {
      setValue("mediaUrl", mediaData.mediaUrl)
      setValue("name", mediaData.name)
      setValue("sha", mediaData.sha)
    }
  }, [setValue])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
    return onProceed({
      ...data,
      newFileName: data.name,
      mediaUrl: data.content,
    })
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>{getModalTitle({ isCreate, params })}</h1>
          <button
            mediaType="button"
            id="closeMediaSettingsModal"
            onClick={onClose}
          >
            <i className="bx bx-x" />
          </button>
        </div>
        <>
          <p className={elementStyles.formLabel}>
            {mediaRoom === "images" ? "Image" : "File"}
          </p>
          {isCreate && !watch("mediaUrl") && !watch("content") ? (
            <>
              <div className={`${contentStyles.segment} mb-0`}>
                <p>
                  For {mediaRoom} other than
                  {mediaRoom === "images"
                    ? ` 'png', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'`
                    : ` 'pdf'`}
                  , please use{" "}
                  <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
                    {" "}
                    https://go.gov.sg{" "}
                  </Link>{" "}
                  to upload and link them to your Isomer site.
                </p>
              </div>
              <Button
                label="Select file"
                className={elementStyles.blue}
                callback={toggleUploadInput}
              />
              <br />
            </>
          ) : !isCreate && !watch("mediaUrl") && !watch("content") ? (
            <div className="spinner-border text-primary" role="status" />
          ) : (
            <>
              {mediaRoom === "images" ? (
                <div className={mediaStyles.editImagePreview}>
                  <img
                    alt={watch("name")}
                    src={watch("mediaUrl") || watch("content")}
                  />
                </div>
              ) : (
                <div className={mediaStyles.editFilePreview}>
                  <p>{watch("name")}</p>
                </div>
              )}
            </>
          )}
          <form className={elementStyles.modalContent}>
            <div className={elementStyles.modalFormFields}>
              <FormField
                register={register}
                title="File name"
                errorMessage={errors.name?.message}
                id="name"
              />
            </div>
            <SaveDeleteButtons
              saveLabel={!fileName ? "Upload" : "Save"}
              isSaveDisabled={
                !fileName
                  ? !_.isEmpty(errors) || !watch("content")
                  : !_.isEmpty(errors) || !mediaData?.sha
              }
              hasDeleteButton={false}
              saveCallback={handleSubmit((data) => onSubmit(data))}
            />
          </form>
        </>
      </div>
    </div>
  )
}
