import React, { useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import * as _ from "lodash"

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"

import { getDefaultFrontMatter } from "../../utils"

import FormField from "../FormField"
import FormFieldHorizontal from "../FormFieldHorizontal"
import FormFieldMedia from "../FormFieldMedia"

import SaveDeleteButtons from "../SaveDeleteButtons"
import Breadcrumb from "../folders/Breadcrumb"

import { PageSettingsSchema } from "."

// axios settings
axios.defaults.withCredentials = true

export const PageSettingsModal = ({
  params,
  pageData,
  onProceed,
  dirData,
  siteUrl,
  onClose,
}) => {
  const { siteName, fileName } = params

  const existingTitlesArray = dirData
    .filter((item) => item.type === "file")
    .map((page) => page.name)
    .filter((pageName) => pageName !== fileName)
    .map((pageName) => pageName.split(".")[0])

  const { exampleTitle, examplePermalink } = getDefaultFrontMatter(
    params,
    existingTitlesArray
  )

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(PageSettingsSchema(existingTitlesArray)),
    defaultValues: {
      title: fileName ? "" : exampleTitle,
      permalink: fileName ? "" : examplePermalink,
    },
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
      newFileName: `${data.title}.md`,
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
              <FormFieldHorizontal
                register={register}
                title="Page URL"
                description={siteUrl}
                id="permalink"
                errorMessage={errors.permalink?.message}
                isRequired
                placeholder=""
              />
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
          </div>
        </div>
      </div>
    </>
  )
}

PageSettingsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}
