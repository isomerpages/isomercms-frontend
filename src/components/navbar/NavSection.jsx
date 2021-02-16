import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select/creatable';
import { SINGLE_PAGE_IDENTIFIER, SUBLINK_IDENTIFIER, RESOURCE_ROOM_IDENTIFIER } from '../../utils';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import Dropdown from '../Dropdown'
import NavSublinkSection from './NavSublinkSection'

/* eslint
  react/no-array-index-key: 0
 */

const defaultText = '--Choose a collection--'

const NavElem = ({
  title,
  options,
  collection,
  isResourceRoom,
  resourceRoomName,
  url,
  linkIndex,
  sublinks,
  onFieldChange,
  createHandler,
  deleteHandler,
  displayHandler,
  shouldDisplay,
  displaySublinks,
}) => {
  const collectionDropdownHandler = (newValue) => {
    let event;
    if (!newValue) {
      // Field was cleared
      event = {
        target: {
          id: `link-${linkIndex}-collection`,
          value: '',
        }
      }
    } else {
      const { value } = newValue
      event = {
        target: {
          id: `link-${linkIndex}-collection`,
          value,
        }
      }
    }
    
    onFieldChange(event);
  };

  const generateDefaultValue = () => {
    if (collection) {
      return {
        value: collection,
        label: collection,
      }
    } else if (isResourceRoom) {
      return {
        value: RESOURCE_ROOM_IDENTIFIER,
        label: resourceRoomName,
      }
    } else if (sublinks) {
      return {
        value: SUBLINK_IDENTIFIER,
        label: 'Create Sublinks',
      }
    } else if (url) {
      return {
        value: SINGLE_PAGE_IDENTIFIER,
        label: 'Single Page',
      }
    }
  }

  return (
    <div className={elementStyles.card}>
      <div className={elementStyles.cardHeader}>
        <h2>
          {title}
        </h2>
        <button type="button" id={`link-${linkIndex}-toggle`} onClick={displayHandler}>
          <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`link-${linkIndex}-icon`} />
        </button>
      </div>
      { shouldDisplay
        ? (
          <>
            <div className={elementStyles.cardContent}>
              <FormField
                title="Nav title"
                id={`link-${linkIndex}-title`}
                value={title}
                isRequired
                onFieldChange={onFieldChange}
              />
              <p className={elementStyles.formLabel}>Collection</p>
              <Select
                isClearable
                className="w-100"
                onChange={collectionDropdownHandler}
                placeholder={"Select a collection or resource room..."}
                defaultValue={generateDefaultValue()}
                options={options}
              />
              <span className={elementStyles.info}>
                Note: you can specify a collection or resource room to automatically populate its links. Select "Create Sublinks" if you want to specify your own links.
              </span>
              {
                sublinks &&
                <NavSublinkSection
                  linkIndex={linkIndex}
                  sublinks={sublinks}
                  createHandler={createHandler}
                  deleteHandler={deleteHandler}
                  onFieldChange={onFieldChange}
                  displayHandler={displayHandler}
                  displaySublinks={displaySublinks}
                />
              }
            </div>
            <div className={elementStyles.inputGroup}>
              <button type="button" id={`link-${linkIndex}-delete`} className={`ml-auto ${elementStyles.warning}`} onClick={deleteHandler}>Delete link</button>
            </div>
          </>
        )
        : null}
    </div>
  )
};

const NavSection = ({
  links,
  options,
  createHandler,
  deleteHandler,
  onFieldChange,
  displayHandler,
  displayLinks,
  displaySublinks,
  resourceRoomName,
}) => (
  <>
    <Droppable droppableId="link" type="link">
      {(droppableProvided) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          className={styles.card}
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
        >
          { (links && links.length > 0)
            ? <>
                <b>Links</b>
                {links.map((link, linkIndex) => (
                  <Draggable
                    draggableId={`link-${linkIndex}-draggable`}
                    index={linkIndex}
                  >
                    {(draggableProvided) => (
                      <div
                        className={styles.card}
                        key={linkIndex}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        ref={draggableProvided.innerRef}
                      >
                        <NavElem
                          key={`link-${linkIndex}`}
                          title={links[linkIndex].title}
                          options={options}
                          collection={link.collection}
                          isResourceRoom={link.resource_room}
                          resourceRoomName={resourceRoomName}
                          sublinks={link.sublinks}
                          url={link.url}
                          linkIndex={linkIndex}
                          onFieldChange={onFieldChange}
                          createHandler={createHandler}
                          deleteHandler={deleteHandler}
                          displayHandler={displayHandler}
                          shouldDisplay={displayLinks[linkIndex]}
                          displaySublinks={displaySublinks[linkIndex]}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              </>
            : null}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
    <button type="button" id={`link-${links.length}-create`} className={`ml-auto ${elementStyles.blue}`} onClick={createHandler}>Create New Link</button>
  </>
);

export default NavSection;
