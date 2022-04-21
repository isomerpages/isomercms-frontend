import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Breadcrumb } from "components/folders/Breadcrumb"
import {
  FormContext,
  FormError,
  FormTitle,
  FormDescription,
} from "components/Form"
import FormField from "components/FormField"
import FormFieldHorizontal from "components/FormFieldHorizontal"
import FormFieldMedia from "components/FormFieldMedia"
import ResourceFormFields from "components/ResourceFormFields"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getDefaultFrontMatter, pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "./PageSettingsSchema"

// axios settings
axios.defaults.withCredentials = true

// eslint-disable-next-line import/prefer-default-export
export const PageSettingsModal = ({
  params,
  pageData,
  onProceed,
  pagesData,
  siteUrl,
  onClose,
}) => {
  const { fileName, resourceRoomName } = params

  const existingTitlesArray = pagesData
    .filter((page) => page.name !== fileName)
    .map((page) => pageFileNameToTitle(page.name, !!params.resourceRoomName))

  const defaultFrontMatter = getDefaultFrontMatter(params, existingTitlesArray)

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: yupResolver(PageSettingsSchema(existingTitlesArray)),
    defaultValues: defaultFrontMatter,
    context: { type: resourceRoomName ? "resourcePage" : "" },
  })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && pageData && pageData.content) {
      Object.entries(pageData.content.frontMatter).forEach(([key, value]) =>
        setValue(key, value, {
          shouldValidate: true,
        })
      )
      if (pageData.content.frontMatter.file_url) {
        // backwards compatible with previous resource files
        setValue("layout", "file", {
          shouldValidate: true,
        })
        setValue("permalink", undefined)
      }
    }
  }, [pageData, setValue])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
    return onProceed({
      pageData,
      data,
      resourceRoomName,
    })
  }

  return (
    <>
      <div className={elementStyles.overlay}>
        <div className={elementStyles["modal-settings"]}>
          <div className={elementStyles.modalHeader}>
            <h1>{!fileName ? "Create new page" : "Page settings"}</h1>
            <button id="settings-CLOSE" type="button" onClick={onClose}>
              <i id="settingsIcon-CLOSE" className="bx bx-x" />
            </button>
          </div>
          <div className={elementStyles.modalContent}>
            {fileName && !pageData ? (
              <center>
                <div className="spinner-border text-primary" role="status" />
              </center>
            ) : (
              <>
                <div className={elementStyles.modalFormFields}>
                  {!fileName ? "You may edit page details anytime. " : ""}
                  To edit page content, simply click on the page title. <br />
                  <Breadcrumb params={params} title={watch("title")} />
                  {/* Title */}
                  <FormContext isRequired hasError={!!errors.title?.message}>
                    <FormTitle>Page title</FormTitle>
                    <FormField
                      placeholder="Page title"
                      id="title"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register("title", { required: true })}
                    />
                    <FormError>{errors.title?.message}</FormError>
                  </FormContext>
                  <br />
                  {/* Permalink */}
                  {watch("layout") !== "file" && (
                    <>
                      <FormContext
                        hasError={!!errors.permalink?.message}
                        isRequired
                        isDisabled={watch("layout") === "file"}
                      >
                        <FormTitle>Page URL</FormTitle>
                        <FormDescription>{siteUrl}</FormDescription>
                        <FormFieldHorizontal
                          // eslint-disable-next-line react/jsx-props-no-spreading
                          {...register("permalink", { required: true })}
                          id="permalink"
                          placeholder="Page URL"
                        />
                        <FormError>{errors.permalink?.message}</FormError>
                      </FormContext>
                      <br />
                    </>
                  )}
                  {resourceRoomName && (
                    <>
                      <p className={elementStyles.formLabel}>
                        Resources details
                      </p>
                      <ResourceFormFields
                        register={register}
                        errors={errors}
                        watch={watch}
                        setValue={setValue}
                        trigger={trigger}
                      />
                    </>
                  )}
                  <br />
                  <p className={elementStyles.formLabel}>Page details</p>
                  <FormContext hasError={!!errors.description?.message}>
                    <FormTitle>Meta Description (Optional)</FormTitle>
                    <FormDescription>
                      Description snippet shown in search results.{" "}
                      <a
                        href="https://go.gov.sg/isomer-meta"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </FormDescription>
                    <FormField
                      placeholder="Meta Description (Optional)"
                      id="description"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register("description")}
                    />
                    <FormError>{errors.description?.message}</FormError>
                  </FormContext>
                  <br />
                  <FormContext
                    hasError={!!errors.image?.message}
                    onFieldChange={(e) => setValue("image", e.target.value)}
                  >
                    <FormTitle>Meta Image URL (Optional)</FormTitle>
                    <FormDescription>
                      Image shown when link is shared on social media.{" "}
                      <a
                        href="https://go.gov.sg/isomer-meta"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Learn more
                      </a>
                    </FormDescription>
                    <FormFieldMedia
                      register={register}
                      placeholder="Meta Image URL (Optional)"
                      id="image"
                      inlineButtonText="Select Image"
                    />
                    <FormError>{errors.image?.message}</FormError>
                  </FormContext>
                </div>
                <SaveDeleteButtons
                  isDisabled={
                    !fileName
                      ? !_.isEmpty(errors)
                      : !_.isEmpty(errors) || !pageData?.sha
                  }
                  hasDeleteButton={false}
                  saveCallback={handleSubmit(onSubmit)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

PageSettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
