import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"
import React, { useState } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormFieldMedia = ({
  title,
  defaultValue,
  value,
  id,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
  inlineButtonText = "Choose Item",
  placeholder,
  type,
  isDisabled = false,
  children,
  register = () => {},
}) => {
  const [isSelectingItem, setIsSelectingItem] = useState(false)

  const onMediaSave = ({ selectedMediaPath }) => {
    const event = {
      target: {
        id,
        value: selectedMediaPath,
      },
    }
    onFieldChange(event)
    setIsSelectingItem(false)
  }

  return (
    <>
      <p className={elementStyles.formLabel}>{title}</p>
      {children}
      <div className="d-flex border">
        <input
          type="text"
          placeholder={placeholder || title}
          value={value}
          defaultValue={defaultValue}
          id={id}
          autoComplete="off"
          required={isRequired}
          className={errorMessage ? `${elementStyles.error}` : "border-0"}
          style={style}
          disabled
          {...register(id, { required: isRequired })}
        />
        {inlineButtonText && (
          <button
            type="button"
            className={`${
              isDisabled ? elementStyles.disabled : elementStyles.blue
            } text-nowrap`}
            onClick={() => setIsSelectingItem(true)}
            disabled={isDisabled}
          >
            {inlineButtonText}
          </button>
        )}
        {isSelectingItem && (
          <MediaModal
            onClose={() => setIsSelectingItem(false)}
            type={type}
            onProceed={onMediaSave}
          />
        )}
      </div>
      <span className={elementStyles.error}>{errorMessage}</span>
    </>
  )
}

export default FormFieldMedia

FormFieldMedia.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  style: PropTypes.string,
  type: PropTypes.oneOf(["files", "images"]).isRequired,
}

FormFieldMedia.defaultProps = {
  defaultValue: undefined,
  style: undefined,
}
