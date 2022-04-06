import Spacer from "components/Spacer"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, deslugifyDirectory } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuItem = ({
  item,
  id,
  isItemSelected,
  onItemSelect,
  onForward,
  isResource = false,
}) => {
  const { name, type } = item
  if (type === "file")
    return (
      <div
        id={id}
        data-cy={id}
        className={`
          ${elementStyles.dropdownItemDisabled}
        `}
      >
        <i
          className={`${elementStyles.dropdownIcon} ${elementStyles.disabledIcon} bx bx-sm bx-file-blank`}
        />
        {pageFileNameToTitle(name, isResource)}
      </div>
    )
  if (type === "dir")
    return (
      <button
        type="button"
        id={id}
        data-cy={id}
        onClick={onItemSelect}
        className={`
        ${elementStyles.dropdownItem} 
        ${elementStyles.dropdownTextButton}
        ${isItemSelected ? elementStyles.dropdownItemFocus : ""}
      `}
      >
        <i className={`${elementStyles.dropdownIcon} bx bx-sm bx-folder`} />
        {deslugifyDirectory(name)}
        <Spacer />
        <button
          type="button"
          id={`moveModal-forwardButton-${name}`}
          className={`${elementStyles.dropdownItemButton}`}
          onMouseDown={onForward}
        >
          <i className="bx bx-sm bx-chevron-right ml-auto" />
        </button>
      </button>
    )
  return null
}
