import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';

/* eslint
  react/no-array-index-key: 0
 */

const HeroDropdownElem = ({
  title,
  url,
  dropdownsIndex,
  onFieldChange,
  deleteHandler,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>
        Dropdown Option {dropdownsIndex + 1}: {title}
      </h2>
      <button type="button" id={`dropdownelem-${dropdownsIndex}-toggle`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`dropdownelem-${dropdownsIndex}-icon`} />
      </button>
    </div>
    { shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Dropdown element title"
              id={`dropdownelem-${dropdownsIndex}-title`}
              value={title}
              errorMessage={errors.title}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Dropdown element URL"
              id={`dropdownelem-${dropdownsIndex}-url`}
              value={url}
              errorMessage={errors.url}
              isRequired
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={elementStyles.inputGroup}>
            <button type="button" id={`dropdownelem-${dropdownsIndex}-delete`} className={`ml-auto ${elementStyles.warning}`} onClick={deleteHandler}>Delete dropdown element</button>
          </div>
        </>
      )
      : null}
  </div>
);

const HeroDropdown = ({
  title,
  options,
  createHandler,
  deleteHandler,
  onFieldChange,
  displayHandler,
  displayDropdownElems,
  errors,
}) => (
  <div>
    <p className={elementStyles.formLabel}>Hero dropdown</p>
    <FormField
      title="Hero dropdown title"
      id="dropdown-title"
      value={title}
      errorMessage={errors.sections[0].hero.dropdown}
      isRequired
      onFieldChange={onFieldChange}
    />
    <Droppable droppableId="dropdownelem" type="dropdownelem">
      {(droppableProvided) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          className={styles.card}
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
        >
          { (options && options.length > 0)
            ? options.map((option, dropdownsIndex) => (
              <Draggable
                draggableId={`dropdownelem-${dropdownsIndex}-draggable`}
                index={dropdownsIndex}
              >
                {(draggableProvided) => (
                  <div
                    className={styles.card}
                    key={dropdownsIndex}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                  >
                    <HeroDropdownElem
                      key={`dropdownelem-${dropdownsIndex}`}
                      title={option.title}
                      url={option.url}
                      dropdownsIndex={dropdownsIndex}
                      onFieldChange={onFieldChange}
                      deleteHandler={deleteHandler}
                      createHandler={createHandler}
                      displayHandler={displayHandler}
                      shouldDisplay={displayDropdownElems[dropdownsIndex]}
                      errors={errors.dropdownElems[dropdownsIndex]}
                    />
                  </div>
                )}
              </Draggable>
            ))
            : null}
          <button type="button" id={`dropdownelem-${options.length}-create`} className={`ml-auto ${elementStyles.blue}`} onClick={createHandler}>Create dropdown element</button>
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default HeroDropdown;

HeroDropdownElem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  dropdownsIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

HeroDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displayDropdownElems: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      dropdownsIndex: PropTypes.number.isRequired,
      onFieldChange: PropTypes.func.isRequired,
      shouldDisplay: PropTypes.bool.isRequired,
      displayHandler: PropTypes.func.isRequired,
    }),
  ).isRequired,
  errors: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        hero: PropTypes.shape({
          dropdown: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    ).isRequired,
    dropdownElems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};
