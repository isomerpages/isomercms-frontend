import { CloseButton } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import _ from "lodash"
import { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { Link } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getLastItemType } from "utils"

import { MediaSettingsSchema } from "./MediaSettingsSchema"

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

// eslint-disable-next-line import/prefer-default-export
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
  const existingTitlesArray =
    mediasData &&
    mediasData
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
      mode: "onTouched",
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
  }, [setValue, mediaData])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
    return onProceed({
      data,
    })
  }

  // Dynamically generated component based on whether users want to create
  const MediaComponent = () => {
    if (isCreate && !watch("mediaUrl") && !watch("content")) {
      return (
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
          <Button onClick={toggleUploadInput}>Select file</Button>
          <br />
        </>
      )
    }

    if (!isCreate && !watch("mediaUrl") && !watch("content")) {
      return <div className="spinner-border text-primary" role="status" />
    }

    if (mediaRoom === "images") {
      return (
        <div className={mediaStyles.editImagePreview}>
          <img
            alt={watch("name")}
            src={watch("mediaUrl") || watch("content")}
          />
        </div>
      )
    }

    return (
      <div className={mediaStyles.editFilePreview}>
        <p>{watch("name")}</p>
      </div>
    )
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>{getModalTitle({ isCreate, params })}</h1>
          <CloseButton onClick={onClose} />
        </div>
        <>
          <p className={elementStyles.formLabel}>
            {mediaRoom === "images" ? "Image" : "File"}
          </p>
          <MediaComponent />
          <form className={elementStyles.modalContent}>
            <div>
              <FormContext hasError={!!errors.name?.message}>
                <FormTitle>File name</FormTitle>
                <FormField
                  placeholder="File name"
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...register("name")}
                  id="name"
                />
                <FormError>{errors.name?.message}</FormError>
              </FormContext>
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
