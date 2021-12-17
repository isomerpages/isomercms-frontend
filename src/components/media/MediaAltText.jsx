import axios from "axios"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import React from "react"
import { useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

// axios settings
axios.defaults.withCredentials = true

export const MediaAltText = ({ onProceed, onClose, type }) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext()

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>Insert media</h1>
          <button
            mediaType="button"
            id="closeMediaSettingsModal"
            onClick={onClose}
          >
            <i className="bx bx-x" />
          </button>
        </div>
        {!watch("selectedMedia") ? (
          <center>
            <div className="spinner-border text-primary" role="status" />
          </center>
        ) : (
          <>
            {type === "images" ? (
              <div className={mediaStyles.editImagePreview}>
                <img
                  alt={
                    watch("selectedMedia").name ||
                    watch("selectedMedia").newFileName
                  }
                  src={
                    watch("selectedMedia").mediaUrl ||
                    `data:image/svg+xml;base64,${
                      watch("selectedMedia").content
                    }`
                  } // temporary
                />
              </div>
            ) : (
              <div className={mediaStyles.editFilePreview}>
                <p>{watch("selectedMedia").name}</p>
              </div>
            )}
            <form className={elementStyles.modalContent}>
              <div className={elementStyles.modalFormFields}>
                <FormField
                  title="File name"
                  value={
                    watch("selectedMedia").name ||
                    watch("selectedMedia").newFileName
                  }
                  disabled
                />
                <br />
                <FormField
                  register={register}
                  title={type === "images" ? "Alt text" : "Text"}
                  id="altText"
                  errorMessage={errors.altText?.message}
                  children={
                    type === "images" ? (
                      <p className={elementStyles.formDescription}>
                        Short description of image used for accessibility.{" "}
                        <a href="https://go.gov.sg/isomer-meta" target="_blank">
                          Learn more
                        </a>
                      </p>
                    ) : (
                      <p className={elementStyles.formDescription}>
                        Description of file displayed in hyperlink
                      </p>
                    )
                  }
                />
              </div>
              <SaveDeleteButtons
                saveLabel="Save"
                hasDeleteButton={false}
                saveCallback={handleSubmit((data) => onProceed(data))}
              />
            </form>
          </>
        )}
      </div>
    </div>
  )
}
