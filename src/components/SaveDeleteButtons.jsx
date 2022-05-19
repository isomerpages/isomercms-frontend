import LoadingButton from "components/LoadingButton"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const SaveDeleteButtons = ({
  saveLabel,
  deleteLabel,
  isDisabled,
  isSaveDisabled,
  isDeleteDisabled,
  hasDeleteButton,
  saveCallback,
  deleteCallback,
  isLoading,
}) => {
  const shouldDisableSave =
    isSaveDisabled !== undefined ? isSaveDisabled : isDisabled
  const shouldDisableDelete =
    isDeleteDisabled !== undefined ? isDeleteDisabled : isDisabled
  return (
    <div className={elementStyles.modalButtons}>
      {hasDeleteButton ? (
        <LoadingButton
          label={deleteLabel || "Delete"}
          disabled={shouldDisableDelete}
          disabledStyle={elementStyles.disabled}
          className={`ml-auto ${
            shouldDisableDelete ? elementStyles.disabled : elementStyles.warning
          }`}
          callback={deleteCallback}
          showLoading={isLoading}
        />
      ) : null}
      <LoadingButton
        label={saveLabel || "Save"}
        disabled={shouldDisableSave}
        disabledStyle={elementStyles.disabled}
        className={`${hasDeleteButton ? null : `ml-auto`} ${
          shouldDisableSave ? elementStyles.disabled : elementStyles.blue
        }`}
        callback={saveCallback}
        showLoading={isLoading}
      />
    </div>
  )
}

SaveDeleteButtons.propTypes = {
  saveLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
  isDisabled: PropTypes.bool,
  isSaveDisabled: PropTypes.bool,
  isDeleteDisabled: PropTypes.bool,
  hasDeleteButton: PropTypes.bool.isRequired,
  saveCallback: PropTypes.func.isRequired,
  deleteCallback: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
}

export default SaveDeleteButtons
