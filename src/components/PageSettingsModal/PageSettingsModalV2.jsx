import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import * as _ from "lodash"

import elementStyles from "../../styles/isomer-cms/Elements.module.scss"

import { validatePageSettings } from "../../utils/validators"

import { getDefaultFrontMatter } from "../../utils"

import FormField from "../FormField"
import FormFieldHorizontal from "../FormFieldHorizontal"
import SaveDeleteButtons from "../SaveDeleteButtons"
import Breadcrumb from "../folders/Breadcrumb"

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
  const { fileName } = params

  const { exampleTitle, examplePermalink } = getDefaultFrontMatter(
    params,
    dirData.filter((item) => item.type === "file").map((item) => item.name)
  )

  const [errors, setErrors] = useState({})
  const [hasErrors, setHasErrors] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Base hooks
  const [title, setTitle] = useState(fileName ? "" : exampleTitle)
  const [permalink, setPermalink] = useState(fileName ? "" : examplePermalink)

  const idToSetterFuncMap = {
    title: setTitle,
    permalink: setPermalink,
  }

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (fileName && pageData && !hasChanges && pageData.content) {
      setTitle(pageData.content.frontMatter.title)
      setPermalink(pageData.content.frontMatter.permalink)
      setErrors({
        title: validatePageSettings(
          "title",
          pageData.content.frontMatter.title
        ),
        permalink: validatePageSettings(
          "permalink",
          pageData.content.frontMatter.permalink
        ),
      })
    }
  }, [pageData])

  useEffect(() => {
    setHasErrors(_.some(errors, (field) => field.length > 0))
  }, [errors])

  useEffect(() => {
    setHasChanges(
      fileName && pageData
        ? title !== pageData.content.frontMatter.title ||
            permalink !== pageData.content.frontMatter.permalink
        : fileName && !pageData
        ? false
        : title !== exampleTitle && permalink !== examplePermalink
    )
  }, [title, permalink])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const changeHandler = (event) => {
    const { id, value } = event.target
    const errorMessage = validatePageSettings(
      id,
      value,
      dirData
        .filter((item) => item.type === "file")
        .map((page) => page.name)
        .filter((pageName) => pageName !== fileName)
    )

    setErrors((prevState) => ({
      ...prevState,
      [id]: errorMessage,
    }))
    idToSetterFuncMap[id](value)
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
              <Breadcrumb params={params} title={title} />
              {/* Title */}
              <FormField
                title="Page title"
                id="title"
                value={title}
                errorMessage={errors.title}
                isRequired
                onFieldChange={changeHandler}
              />
              <br />
              <p className={elementStyles.formLabel}>Page URL</p>
              {/* Permalink */}
              <FormFieldHorizontal
                title={siteUrl}
                id="permalink"
                value={permalink || ""}
                errorMessage={errors.permalink}
                isRequired
                onFieldChange={changeHandler}
                placeholder=" "
              />
            </div>
            <SaveDeleteButtons
              isDisabled={
                !fileName
                  ? hasErrors
                  : !hasChanges || hasErrors || !pageData?.sha
              }
              hasDeleteButton={false}
              saveCallback={() =>
                onProceed({
                  frontMatter:
                    pageData && pageData.content
                      ? {
                          ...pageData.content.frontMatter,
                          title,
                          permalink,
                        }
                      : {
                          title,
                          permalink,
                        },
                  sha: pageData?.sha || "",
                  pageBody: pageData?.content?.pageBody || "",
                  newFileName: `${title}.md`,
                })
              }
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
