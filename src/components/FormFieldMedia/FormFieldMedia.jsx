import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"
import { useState } from "react"

import { useFormContext } from "../Form/FormContext"

import FormMediaInput from "./FormMediaInput"

// This component wraps the input so that the modal can be composed alongside the input and the button
// This component controls the rendering logic for both underlying components
const FormFieldMedia = ({
  value,
  id,
  placeholder = "",
  type = "images",
  inlineButtonText = "Choose Item",
  register = (_args) => {},
}: {
  value?: string,
  id?: string,
  placeholder?: string,
  type?: string,
  inlineButtonText?: string,
  register: (_args: any) => void,
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
        value={value}
        register={register}
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
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(["files", "images"]),
  inlineButtonText: PropTypes.string,
  register: PropTypes.func,
}
