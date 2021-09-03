// TODO: deprecate after Workspace and Media refactor
// remove from OverviewCard and MediaCard and use as separate modal on layout page

import React from "react"
import PropTypes from "prop-types"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import { MenuItem } from "./MenuDropdown"
import { deslugifyDirectory } from "../utils"

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
      className={`ml-auto ${
        moveDisabled ? elementStyles.disabled : elementStyles.green
      }`}
      disabled={moveDisabled}
      onMouseDown={() => moveHandler()}
    >
      Move Here
    </button>
  )

  const BreadcrumbButton = ({ name, id, idx }) => {
    const newMoveDropdownQuery = moveDropdownQuery
      .split("/")
      .slice(0, idx + 1)
      .join("/") // retrieves paths elements up to (excluding) element idx
    return (
      <button
        id={id}
        className={`${elementStyles.breadcrumbText} ml-1`}
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          setMoveDropdownQuery(newMoveDropdownQuery)
        }}
      >
        {name}
      </button>
    )
  }

  const Breadcrumb = (
    <div className="d-flex justify-content-start">
      {moveDropdownQuery !== "" ? (
        <>
          <BreadcrumbButton
            id="breadcrumbItem-0"
            name={
              moveDropdownQuery.split("/").length > 1
                ? "..."
                : deslugifyDirectory(rootName)
            }
            idx={-1}
          />
          {moveDropdownQuery.split("/").map((folderName, idx, arr) => {
            return idx === arr.length - 1 ? (
              <>
                {">"}
                <strong className="ml-1">
                  &nbsp;
                  {deslugifyDirectory(folderName)}
                </strong>
              </>
            ) : (
              <>
                {">"}
                <BreadcrumbButton
                  id={`breadcrumbItem-${idx + 1}`}
                  idx={idx}
                  name={
                    idx < arr.length - 2
                      ? "..."
                      : deslugifyDirectory(folderName)
                  }
                />
              </>
            ) // shorten all except the last link
          })}
        </>
      ) : (
        <strong className="ml-1">{deslugifyDirectory(rootName)}</strong>
      )}
    </div>
  )

  const queryHandler = (categoryName) =>
    setMoveDropdownQuery((prevState) =>
      prevState ? `${moveDropdownQuery}/${categoryName}` : categoryName
    )

  return (
    <div
      className={`${elementStyles.fileMoveDropdown} ${elementStyles.right}`}
      ref={dropdownRef}
      tabIndex={1}
      onBlur={onBlur}
      data-cy="menu-dropdown"
    >
      <MenuItem
        key={`back-${menuIndex}`}
        item={{
          itemName: "Move to",
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
        {dropdownItems ? (
          dropdownItems.map((categoryName) => (
            <MenuItem
              key={`${categoryName}-${menuIndex}`}
              item={{
                itemName: deslugifyDirectory(categoryName),
                itemId: categoryName,
                iconClassName: "bx bx-sm bx-folder",
                children: (
                  <i
                    className={`${elementStyles.dropdownItemButton} bx bx-sm bx-chevron-right ml-auto`}
                  />
                ),
                noBlur: true,
                handler: () => queryHandler(categoryName),
              }}
              menuIndex={menuIndex}
              dropdownRef={dropdownRef}
            />
          ))
        ) : (
          <div className="spinner-border text-primary mt-3" role="status" />
        )}
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

FileMoveMenuDropdown.propTypes = {
  dropdownItems: PropTypes.arrayOf(PropTypes.string.isRequired),
  menuIndex: PropTypes.number.isRequired,
  dropdownRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]).isRequired,
  onBlur: PropTypes.func,
  rootName: PropTypes.string.isRequired,
  moveDropdownQuery: PropTypes.string.isRequired,
  setMoveDropdownQuery: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
  moveHandler: PropTypes.func,
  moveDisabled: PropTypes.bool,
}
