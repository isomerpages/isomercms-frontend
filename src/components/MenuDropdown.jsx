import React from "react"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"

const MenuItem = ({ item, menuIndex, dropdownRef, className }) => {
  const getItemType = (type) => {
    switch (type) {
      case "edit":
        return {
          itemName: "Edit details",
          iconClassName: "bx bx-sm bx-edit",
          itemId: `settings`,
        }
      case "move":
        return {
          itemName: "Move to",
          iconClassName: "bx bx-sm bx-folder",
          itemId: `move`,
          children: <i className="bx bx-sm bx-chevron-right ml-auto" />,
        }
      case "delete":
        return {
          itemName: "Delete",
          iconClassName: "bx bx-sm bx-trash text-danger",
          itemId: `delete`,
        }
      default:
    }
  }
  const { type, handler, noBlur } = item
  const { itemName, itemId, iconClassName, children } = type
    ? getItemType(type)
    : item
  return (
    <div
      tabIndex={2}
      id={`${itemId}-${menuIndex}`}
      data-cy={itemId}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
        if (!noBlur) dropdownRef.current.blur()
        if (handler) handler(e)
      }}
      className={className || `${elementStyles.dropdownItem}`}
    >
      <i id={`${itemId}-${menuIndex}`} className={iconClassName} />
      <div id={`${itemId}-${menuIndex}`} className={elementStyles.dropdownText}>
        {itemName}
      </div>
      <div className="ml-auto">{children}</div>
    </div>
  )
}

const MenuDropdown = ({
  dropdownItems,
  menuIndex,
  dropdownRef,
  tabIndex,
  onBlur,
}) => {
  return (
    <div
      className={`${elementStyles.dropdown} ${elementStyles.right}`}
      ref={dropdownRef}
      tabIndex={tabIndex}
      onBlur={onBlur}
    >
      {dropdownItems
        .filter((x) => x)
        .map((item) => (
          <MenuItem
            key={`${item.type || item.itemId}-${menuIndex}`}
            item={item}
            menuIndex={menuIndex}
            dropdownRef={dropdownRef}
          />
        ))}
    </div>
  )
}

export { MenuItem, MenuDropdown }
