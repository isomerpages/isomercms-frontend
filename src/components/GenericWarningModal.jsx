import LoadingButton from "components/LoadingButton"
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
      <div className={elementStyles.modalButtons}>
        {cancelText && onCancel && (
          <LoadingButton
            label={cancelText}
            disabledStyle={elementStyles.disabled}
            className={`${elementStyles.warning}`}
            callback={onCancel}
          />
        )}
        {proceedText && onProceed && (
          <LoadingButton
            label={proceedText}
            disabledStyle={elementStyles.disabled}
            className={`${elementStyles.blue}`}
            callback={onProceed}
          />
        )}
      </div>
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
