import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, deslugifyDirectory } from "utils"

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
      <div
        id={id}
        data-cy={id}
        onClick={onItemSelect}
        className={`
        ${elementStyles.dropdownItem} 
        ${isItemSelected ? elementStyles.dropdownItemFocus : ""}
      `}
      >
        <i className={`${elementStyles.dropdownIcon} bx bx-sm bx-folder`} />
        {deslugifyDirectory(name)}
        <i
          id={`moveModal-forwardButton-${name}`}
          className={`${elementStyles.dropdownItemButton} bx bx-sm bx-chevron-right ml-auto`}
          onMouseDown={onForward}
        />
      </div>
    )
  return null
}
