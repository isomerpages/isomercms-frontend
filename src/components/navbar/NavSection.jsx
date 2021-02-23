import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Select from 'react-select';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import NavSublinkSection from './NavSublinkSection'

/* eslint
  react/no-array-index-key: 0
 */

const defaultText = '--Choose a collection--'

const NavElem = ({
  title,
  options,
  collection,
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

  const generateTitle = () => {
    if (collection) {
      return `Collection: ${title}`
    }
    if (sublinks) {
      return `Sublinks: ${title}`
    }
    if (url) {
      return `Page: ${title}`
    }
    return `Resource: ${title}`
  }

  return (
    <div className={elementStyles.card}>
      <div className={elementStyles.cardHeader}>
        <h2>
          {generateTitle()}
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
              {
                collection &&
                <>
                  <p className={elementStyles.formLabel}>Collection</p>
                  <Select
                    className="w-100"
                    onChange={collectionDropdownHandler}
                    placeholder={"Select a collection..."}
                    defaultValue={{
                      value: collection,
                      label: collection,
                    }}
                    options={options}
                  />
                </>
              }
              {
                (url || sublinks) &&
                <FormField
                  title="Permalink"
                  id={`link-${linkIndex}-url`}
                  value={url}
                  onFieldChange={onFieldChange}
                />
              }
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
  hasResources,
}) => {
  const [newSectionType, setNewSectionType] = useState()
  const selectInputRef = useRef()
  const sectionCreationHandler = () => {
    selectInputRef.current.select.clearValue()
    const event = {
      target: {
        id: `link-create`,
        value: newSectionType
      }
    }
    createHandler(event)
  }
  const sectionCreationOptions = [
    {
      value: 'collectionLink',
      label: 'Collection',
    },
    ... !hasResources 
      ? [{
        value: 'resourceLink',
        label: 'Resource Room',
      }]
      : [],
    {
      value: 'pageLink',
      label: 'Single Page',
    },
    {
      value: 'sublinkLink',
      label: 'Sublinks',
    },
  ]
  return (
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
                      key={`link-${linkIndex}-draggable`}
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
                            title={link.title}
                            options={options}
                            collection={link.collection}
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
      <div className='d-flex justify-content-between'>
        <Select
          ref={selectInputRef}
          className='w-50'
          onChange={(option) => setNewSectionType(option ? option.value : '')}
          placeholder={"Select link type..."}
          options={sectionCreationOptions}
        />
        <button type="button" className={newSectionType ? elementStyles.blue: elementStyles.disabled} onClick={sectionCreationHandler} disabled={!newSectionType}>Create New Link</button>
      </div>
      <span className={elementStyles.info}>
        Note: you can specify a collection or resource room to automatically populate its links. Select "Sublinks" if you want to specify your own links.
      </span>
    </>
  )
};

export default NavSection;

NavElem.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  collection: PropTypes.string,
  sublinks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  linkIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  displayHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool,
  displaySublinks: PropTypes.arrayOf(PropTypes.bool),
};

NavSection.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      collection: PropTypes.string,
      resource_room: PropTypes.bool,
      sublinks: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          url: PropTypes.string,
        }),
      )
    }),
  ).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displayLinks: PropTypes.arrayOf(PropTypes.bool).isRequired,
  displaySublinks: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
  hasResources: PropTypes.bool.isRequired,
};
