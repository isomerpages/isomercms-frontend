import MediaModal from "components/media/MediaModal"
import { useState } from "react"

import FormMediaInput, { FormMediaInputProps } from "./FormMediaInput"

interface MediaSaveEvent {
  target: {
    id: string
    value: string
  }
}

export interface FormFieldMediaProps
  extends Omit<FormMediaInputProps, "onClick"> {
  onFieldChange: (event: MediaSaveEvent) => void
  type: "images" | "files"
}

// This component wraps the input so that the modal can be composed alongside the input and the button
// This component controls the rendering logic for both underlying components
const FormFieldMedia = ({
  value,
  id,
  onFieldChange,
  placeholder = "",
  type = "images",
  inlineButtonText = "Choose Item",
  register = () => {},
}: FormFieldMediaProps) => {
  const [isSelectingItem, setIsSelectingItem] = useState(false)

  const onMediaSave = ({
    selectedMediaPath,
  }: {
    selectedMediaPath: string
  }) => {
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
