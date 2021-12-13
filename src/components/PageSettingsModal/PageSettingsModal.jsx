import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import Breadcrumb from "components/folders/Breadcrumb"
import FormField from "components/FormField"
import FormFieldHorizontal from "components/FormFieldHorizontal"
import FormFieldMedia from "components/FormFieldMedia"
import ResourceFormFields from "components/ResourceFormFields"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getDefaultFrontMatter, pageFileNameToTitle } from "utils"

import { PageSettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

export const PageSettingsModal = ({
  params,
  pageData,
  onProceed,
  pagesData,
  siteUrl,
  onClose,
}) => {
  const { siteName, fileName, resourceRoomName } = params

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
      frontMatter:
        pageData && pageData.content
          ? {
              ...pageData.content.frontMatter,
              ...data,
            }
          : data,
      sha: pageData?.sha || "",
      pageBody: pageData?.content?.pageBody || "",
      newFileName: resourceRoomName
        ? `${data.date}-${data.layout}-${data.title}.md`
        : `${data.title}.md`,
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
                  <FormField
                    register={register}
                    title="Page title"
                    id="title"
                    errorMessage={errors.title?.message}
                    isRequired
                  />
                  <br />
                  {/* Permalink */}
                  {watch("layout") !== "file" && (
                    <>
                      <FormFieldHorizontal
                        register={register}
                        disabled={watch("layout") === "file"}
                        title="Page URL"
                        description={siteUrl}
                        id="permalink"
                        errorMessage={errors.permalink?.message}
                        isRequired
                        placeholder=""
                      />
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
                        siteName={siteName}
                        watch={watch}
                        setValue={setValue}
                        trigger={trigger}
                      />
                    </>
                  )}
                  <br />
                  <p className={elementStyles.formLabel}>Page details</p>
                  <FormField
                    register={register}
                    title="Meta Description (Optional)"
                    id="description"
                    children={
                      <p className={elementStyles.formDescription}>
                        Description snippet shown in search results.{" "}
                        <a href="https://go.gov.sg/isomer-meta" target="_blank">
                          Learn more
                        </a>
                      </p>
                    }
                    errorMessage={errors.description?.message}
                  />
                  <br />
                  <FormFieldMedia
                    register={register}
                    title="Meta Image URL (Optional)"
                    children={
                      <p className={elementStyles.formDescription}>
                        Image shown when link is shared on social media.{" "}
                        <a href="https://go.gov.sg/isomer-meta" target="_blank">
                          Learn more
                        </a>
                      </p>
                    }
                    id="image"
                    errorMessage={errors.image?.message}
                    inlineButtonText="Select Image"
                    siteName={siteName}
                    type="images"
                    onFieldChange={(e) => setValue("image", e.target.value)} // temporary workaround before refactoring FormFieldMedia
                  />
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
