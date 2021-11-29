import FormField from "components/FormField"
import FormFieldMedia from "components/FormFieldMedia"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const ResourceFormFields = ({
  register,
  setValue,
  watch,
  trigger,
  errors,
  siteName,
}) => {
  return (
    <>
      <div className="d-flex row m-0">
        <div className="col-4 m-0 p-0">
          {/* Date */}
          <FormField
            register={register}
            title="Date (YYYY-MM-DD)"
            id="date"
            errorMessage={errors.date?.message}
            isRequired
          />
        </div>
        <div className="col-8">
          <p className={elementStyles.formLabel}>Resource Type</p>
          {/* Permalink or File URL */}
          <div className="d-flex">
            <label htmlFor="radio-post" className="flex-fill">
              <input
                {...register("layout")}
                onChange={(e) => {
                  register("layout").onChange(e)
                  setValue("file_url", undefined)
                }}
                type="radio"
                id="radio-post"
                name="layout"
                value="post"
              />
              Post Content
            </label>
            <label htmlFor="radio-file" className="flex-fill">
              <input
                {...register("layout")}
                type="radio"
                id="radio-file"
                name="layout"
                value="file"
                onChange={(e) => {
                  register("layout").onChange(e)
                  setValue("permalink", undefined)
                }}
              />
              Downloadable File
            </label>
          </div>
        </div>
      </div>
      {/* File URL */}
      {watch("layout") === "file" && (
        <>
          <br />
          <FormFieldMedia
            register={register}
            title="Select File"
            id="file_url"
            onFieldChange={(e) => {
              setValue("file_url", e.target.value)
              trigger("file_url")
            }}
            errorMessage={errors.file_url?.message}
            inlineButtonText="Select File"
            siteName={siteName}
            type="files"
          />
        </>
      )}
    </>
  )
}

export default ResourceFormFields
