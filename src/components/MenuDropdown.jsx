import React, { useEffect, useState } from 'react';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';

import { checkIsOutOfViewport } from '../utils'

const MenuItem = ({ item, menuIndex, dropdownRef }) => {
  const { itemName, itemId, iconClassName, handler, children } = item
  return (
    <div
      id={`${itemId}-${menuIndex}`}
      onMouseDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
        dropdownRef.current.blur()
        if (handler) handler(e)
      }}
      className={`${elementStyles.dropdownItem}`}
    >
      <i id={`${itemId}-${menuIndex}`} className={iconClassName}/>
      <div id={`${itemId}-${menuIndex}`} className={elementStyles.dropdownText}>{ itemName }</div>
      { children }
    </div>
  )
}

const MenuDropdown = ({ dropdownItems, menuIndex, dropdownRef, tabIndex, onBlur }) => {
  return (
    <div className={`${elementStyles.dropdown} ${elementStyles.right}`} ref={dropdownRef} tabIndex={tabIndex} onBlur={onBlur}>
      { dropdownItems.map(item =>         
        ( <MenuItem 
            item={item}
            menuIndex={menuIndex}
            dropdownRef={dropdownRef}
        /> )
      )}
    </div>
  )
}

export default MenuDropdown