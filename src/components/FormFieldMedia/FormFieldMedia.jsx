import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"
import React, { useState } from "react"

import { useFormContext } from "../Form/FormContext"

import FormMediaInput from "./FormMediaInput"

// This component wraps the input so that the modal can be composed alongside the input and the button
// This component controls the rendering logic for both underlying components
const FormFieldMedia = ({
  defaultValue = undefined,
  value,
  id,
  style = undefined,
  placeholder = "",
  type,
  inlineButtonText = "Choose Item",
  register = () => {},
}) => {
  const [isSelectingItem, setIsSelectingItem] = useState(false)
  const { onFieldChange } = useFormContext()

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
      <FormMediaInput
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        register={register}
        style={style}
        id={id}
        onClick={() => setIsSelectingItem(true)}
        inlineButtonText={inlineButtonText}
      />
      {isSelectingItem && (
        <MediaModal
          onClose={() => setIsSelectingItem(false)}
          type={type}
          onProceed={onMediaSave}
        />
      )}
    </>
  )
}

export default FormFieldMedia

FormFieldMedia.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  style: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["files", "images"]).isRequired,
  inlineButtonText: PropTypes.string,
  register: PropTypes.func,
}
