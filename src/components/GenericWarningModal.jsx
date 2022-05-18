import { HStack } from "@chakra-ui/react"
import { LoadingButton } from "components/LoadingButton"
import parse from "html-react-parser"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const GenericWarningModal = ({
  displayTitle,
  displayText,
  displayImage,
  displayImgAlt,
  onProceed,
  onCancel,
  proceedText,
  cancelText,
}) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles["modal-warning"]}>
      <div className={elementStyles.modalHeader}>
        <h1>{displayTitle}</h1>
      </div>
      {displayImage && (
        <img
          className="align-self-center"
          alt={displayImgAlt}
          src={displayImage}
        />
      )}
      <div className={elementStyles.modalContent}>
        <p>{parse(displayText)}</p>
      </div>
      <HStack w="100%" pt="20px" spacing={2} justifyContent="flex-end">
        {cancelText && onCancel && (
          <LoadingButton colorScheme="danger" onClick={onCancel}>
            {cancelText}
          </LoadingButton>
        )}
        {proceedText && onProceed && (
          <LoadingButton onClick={onProceed}>{proceedText}</LoadingButton>
        )}
      </HStack>
    </div>
  </div>
)

GenericWarningModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  displayImage: PropTypes.string,
  displayImgAlt: PropTypes.string,
  onProceed: PropTypes.func,
  onCancel: PropTypes.func,
  proceedText: PropTypes.string,
  cancelText: PropTypes.string,
}

export default GenericWarningModal
