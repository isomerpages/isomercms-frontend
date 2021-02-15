import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
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
  linkIndex,
  sublinks,
  onFieldChange,
  createHandler,
  deleteHandler,
  displayHandler,
  shouldDisplay,
  displaySublinks,
}) => (
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
            <h2>
              Choose a collection
            </h2>
            <span className={elementStyles.info}>
              Note: you can specify a collection or resource room to automatically populate its links. Select "Create Sublinks" if you want to specify your own links.
            </span>
            <Dropdown 
              options={options}
              defaultOption={defaultText}
              emptyDefault={true}
              name='newSection'
              id='section-new'
              onFieldChange={onFieldChange}
            />
            {
              collection === '' && !isResourceRoom &&
              <NavSublinkSection
                linkIndex={linkIndex}
                sublinks={sublinks}
                createHandler={createHandler}
                deleteHandler={deleteHandler}
                onFieldChange={onFieldChange}
                displayHandler={displayHandler}
                displaySublinks={displaySublinks[linkIndex]}
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
);

const NavSection = ({
  links,
  options,
  createHandler,
  deleteHandler,
  onFieldChange,
  displayHandler,
  displayLinks,
  displaySublinks,
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
                          sublinks={link.sublinks}
                          linkIndex={linkIndex}
                          onFieldChange={onFieldChange}
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
