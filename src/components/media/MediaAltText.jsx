import { Box } from "@chakra-ui/react"
import axios from "axios"
import FormContext from "components/Form/FormContext"
import FormDescription from "components/Form/FormDescription"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import { useFormContext } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"
// axios settings
axios.defaults.withCredentials = true

// eslint-disable-next-line import/prefer-default-export
export const MediaAltText = ({ onProceed, onClose, type }) => {
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext()
  const formTitle = type === "images" ? "Alt text" : "Text"

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles.modal}>
        <div className={elementStyles.modalHeader}>
          <h1>Insert media</h1>
          <button
            mediaType="button"
            type="button"
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
                <FormContext isDisabled>
                  <FormTitle>File name</FormTitle>
                  <FormField
                    placeholder="File name"
                    value={
                      watch("selectedMedia").name ||
                      watch("selectedMedia").newFileName
                    }
                  />
                </FormContext>
                <br />
                <FormContext hasError={!!errors.altText?.message}>
                  <FormTitle>{formTitle}</FormTitle>
                  <FormDescription>
                    {type === "images" ? (
                      <>
                        Short description of image used for accessibility.{" "}
                        <a
                          href="https://go.gov.sg/isomer-meta"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Learn more
                        </a>
                      </>
                    ) : (
                      "Description of file displayed in hyperlink"
                    )}
                  </FormDescription>
                  {/* NOTE: There's a 2px internal padding as the input has a 2px border
                   * when focused. This has clipping issues due to a lack of space so the internal
                   * 2px padding allows the border to display.
                   */}
                  <Box px="2px">
                    <FormField
                      placeholder={formTitle}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...register("altText")}
                      id="altText"
                    />
                  </Box>
                  <FormError>{errors.altText?.message}</FormError>
                </FormContext>
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
