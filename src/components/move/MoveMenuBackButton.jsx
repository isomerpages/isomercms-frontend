import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { deslugifyDirectory } from "utils"

export const MoveMenuBackButton = ({ onBack, isDisabled, backButtonText }) => {
  return (
    <div
      id="moveModal-backButton"
      className={`${elementStyles.dropdownHeader}`}
      onMouseDown={!isDisabled && onBack}
    >
      <i
        className={`${elementStyles.dropdownIcon} ${
          !isDisabled && "bx bx-sm bx-arrow-back text-white"
        }`}
      />
      {deslugifyDirectory(backButtonText)}
    </div>
  )
}
