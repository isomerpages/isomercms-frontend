import React, { useState } from 'react';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField'
import FormFieldItem from './FormFieldItem';

const ResourceFormFields = ({date, errors, changeHandler, onToggle, isPost, siteName, fileUrl}) => {
  const [isPostChecked, setIsPostChecked] = useState(isPost)
  const onToggleType = (e) => {
    onToggle(e)
    setIsPostChecked(!isPostChecked)
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
                checked={isPostChecked}
              />
              Post Content
            </label>
            <label htmlFor="radio-post" className="flex-fill">
              <input
                type="radio"
                id="radio-file"
                name="resource-type"
                value="file"
                onChange={onToggleType}
                checked={!isPostChecked}
              />
              Downloadable File
            </label>
          </div>
        </div>
      </div>
      {/* File URL */}
      <FormFieldItem
        title="Select File"
        id="fileUrl"
        value={fileUrl?.split('/').pop()}
        errorMessage={errors.fileUrl}
        onFieldChange={changeHandler}
        inlineButtonText={"Select File"}
        siteName={siteName}
        placeholder=" "
        type="file"
        errorMessage={errors.fileUrl}
        isDisabled={isPostChecked}
      />
    </>
  )
}

export default ResourceFormFields