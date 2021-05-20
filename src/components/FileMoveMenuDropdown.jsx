import React from 'react';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import { MenuItem } from './MenuDropdown'
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

  const BreadcrumbButton = ({ name, idx }) => {
    const newMoveDropdownQuery = moveDropdownQuery.split('/').slice(0, idx+1).join('/') // retrieves paths elements up to (excluding) element idx
    return (
      <button className={`${elementStyles.breadcrumbText} ml-1`} type="button" onClick={(e) => {e.stopPropagation(); e.preventDefault(); setMoveDropdownQuery(newMoveDropdownQuery)}}>
        {name}
      </button>
    )
  }

  const Breadcrumb = (
    <div className="d-flex justify-content-start">
      { moveDropdownQuery !== '' 
        ? 
          <>
          <BreadcrumbButton name={moveDropdownQuery.split("/").length > 1 ? '...' : deslugifyDirectory(rootName)} idx={-1}/>
          { 
            moveDropdownQuery.split("/").map((folderName, idx, arr) => {
              return idx === arr.length - 1
              ? <> > <strong className="ml-1"> {deslugifyDirectory(folderName)}</strong></>
              : <> > <BreadcrumbButton idx={idx} name={deslugifyDirectory(folderName)}/></>
            })
          }
          </>
        : <strong className="ml-1">{deslugifyDirectory(rootName)}</strong>
      }
    </div>
  )

  const queryHandler = (categoryName) => setMoveDropdownQuery((prevState) =>
    prevState 
      ? `${moveDropdownQuery}/${categoryName}`
      : categoryName
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