import React from 'react';
import { MenuItem } from './MenuDropdown'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { deslugifyDirectory } from '../utils'

const FileMoveMenuDropdown = ({ 
  dropdownItems, 
  menuIndex, 
  dropdownRef, 
  onBlur, 
  rootName,
  moveDropdownQuery,
  setMoveDropdownQuery,
  backHandler, 
  moveHandler,
  moveDisabled,
}) => {

  const { folderName, subfolderName } = moveDropdownQuery

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

  const Breadcrumb = (
    <>
      <span
          id='workspace'
          onClick={() => setMoveDropdownQuery({folderName: '', subfolderName: ''})}
          style={ subfolderName || folderName ? {cursor:'pointer'}: {cursor:'default'}}
      > 
        {
          subfolderName 
          ? `... >` 
          : !subfolderName && !folderName 
          ? <strong>{rootName}</strong> 
          : rootName
        }
      </span>
      <span 
        id='folder'
        onClick={() => setMoveDropdownQuery({...moveDropdownQuery, subfolderName: ''})}
        style={subfolderName ? {cursor:'pointer'} : {cursor:'default'}}
      >
        {
          folderName && !subfolderName 
          ? <strong> > {deslugifyDirectory(folderName)}</strong> 
          : `${deslugifyDirectory(folderName)}`
        }
      </span>
        {
          subfolderName 
          ? <strong> > {deslugifyDirectory(subfolderName)}</strong> 
          : ''
        }
    </>
  )

  const queryHandler = (categoryName) => {
    if (folderName) setMoveDropdownQuery({...moveDropdownQuery, subfolderName: categoryName})
    else setMoveDropdownQuery({...moveDropdownQuery, folderName: categoryName})
  }

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
          itemName: Breadcrumb,
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
                  itemName: deslugifyDirectory(categoryName),
                  itemId: categoryName,
                  iconClassName: "bx bx-sm bx-folder",
                  children: <i className={`${elementStyles.dropdownItemButton} bx bx-sm bx-chevron-right ml-auto`}/>,
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
        item={{
          children: MoveButton,
          noBlur: true,
        }}
        menuIndex={menuIndex}
        dropdownRef={dropdownRef}
      />
    </div>
  )
}

export default FileMoveMenuDropdown