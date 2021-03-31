import React from 'react';
import { MenuItem } from './MenuDropdown'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const FileMoveMenuDropdown = ({ 
  dropdownItems, 
  queryHandler,
  menuIndex, 
  dropdownRef, 
  onBlur, 
  breadcrumb, 
  backHandler, 
  moveHandler,
  moveDisabled,
}) => {

  const MoveButton = (
    <button
      type="button"
      className={`ml-auto ${moveDisabled ? elementStyles.disabled : elementStyles.green}`}
      disabled={moveDisabled}
      onMouseDown={() => moveHandler()}
    >
      Move Here
    </button>
  )

  return (
    <div className={`${elementStyles.fileMoveDropdown} ${elementStyles.right}`} ref={dropdownRef} tabIndex={1} onBlur={onBlur}>
      <MenuItem 
        key={`back-${menuIndex}`}
        item={{
          itemName: 'Move to',
          itemId: `back`,
          iconClassName: "bx bx-sm bx-arrow-back text-white",
          handler: () => backHandler(),
        }}
        menuIndex={menuIndex}
        dropdownRef={dropdownRef}
        className={elementStyles.dropdownHeader}
      /> 
      <MenuItem 
        key={`breadcrumb-${menuIndex}`}
        item={{
          itemName: breadcrumb,
          itemId: `breadcrumb`,
          noBlur: true,
        }}
        menuIndex={menuIndex}
        dropdownRef={dropdownRef}
        className={elementStyles.dropdownFirstItem}
      />
      <div className={elementStyles.dropdownContentItems}> 
        { dropdownItems 
          ?
            dropdownItems.map(categoryName =>
              <MenuItem 
                key={`${categoryName}-${menuIndex}`}
                item={{
                  itemName: categoryName,
                  itemId: categoryName,
                  iconClassName: "bx bx-sm bx-folder",
                  children: <i className="bx bx-sm bx-chevron-right ml-auto"/>,
                  noBlur: true,
                  handler: () => queryHandler(categoryName)
                }}
                menuIndex={menuIndex}
                dropdownRef={dropdownRef}
              /> 
              )
          : 
            <div className="spinner-border text-primary mt-3" role="status" />
        }
      </div>
      <MenuItem 
        key={`move-here-${menuIndex}`}
        className={elementStyles.dropdownLastItem}
        item={{children: MoveButton}}
        menuIndex={menuIndex}
        dropdownRef={dropdownRef}
      />
    </div>
  )
}

export default FileMoveMenuDropdown