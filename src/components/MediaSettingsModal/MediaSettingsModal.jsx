import { CloseButton, Flex } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import _ from "lodash"
import { useEffect } from "react"
import { useForm, useFormContext } from "react-hook-form"
import { Link } from "react-router-dom"

import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import { LoadingButton } from "components/LoadingButton"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getLastItemType, getFileExt, getFileName } from "utils"

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
      context: { mediaRoom, isCreate },
    })

  // fileExt is blank for newly created files - mediaData is undefined for the create flow
  const fileExt = getFileExt(mediaData?.name || "")

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && mediaData && mediaData.name && mediaData.mediaUrl) {
      setValue("mediaUrl", mediaData.mediaUrl)
      setValue("name", getFileName(mediaData.name))
      setValue("sha", mediaData.sha)
    }
  }, [setValue, mediaData])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = ({ name, ...rest }) => {
    return onProceed({
      data: {
        ...rest,
        // Period is appended only if fileExt exists, otherwise MediaCreationModal handles the period and extension appending
        name: `${name}${fileExt ? `.${fileExt}` : ""}`,
      },
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
                ? ` 'png', 'jpg', '.jpeg', 'gif', 'tif', '.tiff', 'bmp', 'ico', 'svg'`
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
      console.log(`Displaying`, watch("mediaUrl"))
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
                  {...register("name")}
                  id="name"
                />
                <FormError>{errors.name?.message}</FormError>
              </FormContext>
            </div>
            <Flex w="100%" dir="row" justifyContent="flex-end" p={1}>
              <LoadingButton
                isDisabled={
                  !fileName
                    ? !_.isEmpty(errors) || !watch("content")
                    : !_.isEmpty(errors) || !mediaData?.sha
                }
                onClick={handleSubmit((data) => onSubmit(data))}
              >
                {!fileName ? "Upload" : "Save"}
              </LoadingButton>
            </Flex>
          </form>
        </>
      </div>
    </div>
  )
}
