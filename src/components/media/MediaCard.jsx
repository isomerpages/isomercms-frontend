import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { MenuDropdown } from '../MenuDropdown'
import FileMoveMenuDropdown from '../FileMoveMenuDropdown'

import mediaStyles from '../../styles/isomer-cms/pages/Media.module.scss';
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss';

const MediaCard = ({
  type, 
  siteName, 
  onClick, 
  media, 
  mediaItemIndex,
  isSelected,
  setSelectedMedia,
  setSelectedPath,
  allCategories,
  showSettings,
  moveDropdownQuery,
  setIsMoveModalActive,
  setIsMediaSettingsActive, 
  setIsDeleteModalActive,
  setMoveDropdownQuery,
  clearMoveDropdownQueryState,
}) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFileMoveDropdown, setShowFileMoveDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const fileMoveDropdownRef = useRef(null)

  useEffect(() => {
      if (showDropdown) dropdownRef.current.focus()
      if (showFileMoveDropdown) fileMoveDropdownRef.current.focus()
  }, [showDropdown, showFileMoveDropdown])

  const handleBlur = (event) => {
      // if the blur was because of outside focus
      // currentTarget is the parent element, relatedTarget is the clicked element
      if (!event.currentTarget.contains(event.relatedTarget)) {
          setShowFileMoveDropdown(false)
          clearMoveDropdownQueryState()
      }
  }

  const toggleDropdownModals = () => {
      setShowFileMoveDropdown(!showFileMoveDropdown)
      setShowDropdown(!showDropdown)
  }

  const generateDropdownItems = () => {
    const dropdownItems = [
      {
        type: 'edit',
        handler: () => setIsMediaSettingsActive(true)
      },
      {
        type: 'move',
        handler: toggleDropdownModals
      },
      {
        type: 'delete',
        handler: () => setIsDeleteModalActive(true)
      },
    ]
    return dropdownItems
  }

  return (
    <div
      className={isSelected ? mediaStyles.selectedMediaCard : mediaStyles.mediaCard}
      key={media.path}
      onClick={(e) => { 
        e.preventDefault(); 
        if (onClick) onClick();
      }}
    > 
      {
        type === 'images' && (
          <div className={mediaStyles.mediaCardImagePreviewContainer}>
            <img
              className={mediaStyles.mediaCardImage}
              alt={`${media.fileName}`}
              // The sanitise parameter is for SVGs. It converts the raw svg data into an image
              src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${media.path}${media.path.endsWith('.svg') ? '?sanitize=true' : ''}`}
            />
          </div>
        )
      }
      {
        type === 'files' && (
          <div className={mediaStyles.mediaCardFilePreviewContainer}>
            <p>{media.fileName.split('.').pop().toUpperCase()}</p>
          </div>
        )
      }
      {
        type === 'dirs' && (
          <div className={mediaStyles.mediaCardFilePreviewContainer}>
            <p><i className={`bx bx-lg bxs-folder`}/></p>
          </div>
        )
      }
      <div className={mediaStyles.mediaCardDescription}>
        <div className={mediaStyles.mediaCardName}>{media.fileName}</div>
        {/* Settings dropdown */}
        { showSettings && (
          <div className={`position-relative mt-auto mb-auto`}>
            <button
              className={`${showDropdown ? contentStyles.optionsIconFocus : contentStyles.optionsIcon}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setShowDropdown(true)
                setSelectedMedia(media)
              }}
            >
              <i className="bx bx-dots-vertical-rounded" />
            </button>
            { showDropdown &&
              <MenuDropdown
                menuIndex={mediaItemIndex}
                dropdownItems={generateDropdownItems()}
                dropdownRef={dropdownRef}
                tabIndex={2}
                onBlur={()=>setShowDropdown(false)}
              />
            }
            { showFileMoveDropdown &&
              <FileMoveMenuDropdown 
                dropdownItems={allCategories}
                dropdownRef={fileMoveDropdownRef}
                menuIndex={mediaItemIndex}
                onBlur={handleBlur}
                rootName={type}
                moveDropdownQuery={moveDropdownQuery}
                setMoveDropdownQuery={setMoveDropdownQuery}
                backHandler={toggleDropdownModals}
                moveHandler={() => {
                  setSelectedPath(moveDropdownQuery)
                  setIsMoveModalActive(true)
                }}
              />
            }
          </div>
        )}
      </div>
    </div>
  )
};

MediaCard.propTypes = {
  type: PropTypes.oneOf(['images', 'files', 'dirs']).isRequired,
  siteName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  media: PropTypes.shape({
    fileName: PropTypes.string,
    path: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
  canShowEditIcon: PropTypes.bool,
};

MediaCard.defaultProps = {
  siteName: '',
  isSelected: false,
  canShowEditIcon: false,
};

export default MediaCard;
