import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { deslugifyDirectory } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuBackButton = ({ onBack, isDisabled, backButtonText }) => {
  return (
    <button
      type="button"
      id="moveModal-backButton"
      className={`${elementStyles.dropdownHeader} ${elementStyles.dropdownTextButton}`}
      onMouseDown={!isDisabled && onBack}
    >
      <i
        className={`${elementStyles.dropdownIcon} ${
          !isDisabled && "bx bx-sm bx-arrow-back text-white"
        }`}
      />
      {deslugifyDirectory(backButtonText)}
    </button>
  )
}
