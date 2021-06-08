import React from "react"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import FormField from "./FormField"
import FormFieldMedia from "./FormFieldMedia"

const ResourceFormFields = ({
  date,
  errors,
  changeHandler,
  onToggle,
  isPost,
  setIsPost,
  siteName,
  fileUrl,
}) => {
  const onToggleType = (e) => {
    onToggle(e)
    setIsPost(!isPost)
  }

  return (
    <>
      <div className="d-flex row m-0">
        <div className="col-4 m-0 p-0">
          {/* Date */}
          <FormField
            title="Date (YYYY-MM-DD)"
            id="date"
            value={date}
            errorMessage={errors.date}
            isRequired
            onFieldChange={(e) => changeHandler(e)}
          />
        </div>

        <div className="col-8">
          <p className={elementStyles.formLabel}>Resource Type</p>
          {/* Permalink or File URL */}
          <div className="d-flex">
            <label htmlFor="radio-post" className="flex-fill">
              <input
                type="radio"
                id="radio-post"
                name="resource-type"
                value="post"
                onChange={onToggleType}
                checked={isPost}
              />
              Post Content
            </label>
            <label htmlFor="radio-file" className="flex-fill">
              <input
                type="radio"
                id="radio-file"
                name="resource-type"
                value="file"
                onChange={onToggleType}
                checked={!isPost}
              />
              Downloadable File
            </label>
          </div>
        </div>
      </div>
      {/* File URL */}
      <FormFieldMedia
        title="Select File"
        id="fileUrl"
        value={fileUrl?.split("/").pop()}
        errorMessage={errors.fileUrl}
        onFieldChange={changeHandler}
        inlineButtonText={"Select File"}
        siteName={siteName}
        placeholder=" "
        type="files"
        errorMessage={errors.fileUrl}
        isDisabled={isPost}
      />
    </>
  )
}

export default ResourceFormFields
