import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import HeroButton from './HeroButton';
import HeroDropdown from './HeroDropdown';
import KeyHighlight from './KeyHighlight';

/* eslint
  react/no-array-index-key: 0
 */

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4;

const EditorHeroSection = ({
  title,
  subtitle,
  background,
  button,
  url,
  dropdown,
  sectionIndex,
  highlights,
  onFieldChange,
  createHandler,
  deleteHandler,
  shouldDisplay,
  displayHandler,
  displayDropdownElems,
  displayHighlights,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>Hero section</h2>
      <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionIndex}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <FormField
            title="Hero title"
            id={`section-${sectionIndex}-hero-title`}
            value={title}
            errorMessage={errors.sections[0].hero.title}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Hero subtitle"
            id={`section-${sectionIndex}-hero-subtitle`}
            value={subtitle}
            errorMessage={errors.sections[0].hero.subtitle}
            isRequired
            onFieldChange={onFieldChange}
          />
          <FormField
            title="Hero background image"
            id={`section-${sectionIndex}-hero-background`}
            value={background}
            errorMessage={errors.sections[0].hero.background}
            isRequired
            onFieldChange={onFieldChange}
          />
          <span>
            <i>Note: you can only have either Key Highlights+Hero button or a Hero Dropdown</i>
          </span>
          <div className={styles.card}>
            {dropdown
              ? (
                <>
                  <button type="button" id="dropdown-delete" className={elementStyles.warning} onClick={deleteHandler}>Delete Hero Dropdown</button>
                  <HeroDropdown
                    title={dropdown.title}
                    options={dropdown.options}
                    sectionIndex={sectionIndex}
                    createHandler={createHandler}
                    deleteHandler={deleteHandler}
                    onFieldChange={onFieldChange}
                    displayDropdownElems={displayDropdownElems}
                    displayHandler={displayHandler}
                    errors={errors}
                  />
                </>
              )
              : (
                <>
                  <button type="button" id="dropdown-create" className={elementStyles.blue} onClick={createHandler}>Create Hero Dropdown</button>
                  <HeroButton
                    button={button}
                    url={url}
                    sectionIndex={sectionIndex}
                    onFieldChange={onFieldChange}
                    errors={errors.sections[0].hero}
                  />
                  <Droppable droppableId="highlight" type="highlight">
                    {(droppableProvided) => (
                    /* eslint-disable react/jsx-props-no-spreading */
                      <div
                        className={styles.card}
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                      >
                        {(highlights && highlights.length > 0)
                          ? (
                            <>
                              <b>Hero highlights</b>
                              {highlights.map((highlight, highlightIndex) => (
                                <Draggable
                                  draggableId={`highlight-${highlightIndex}-draggable`}
                                  index={highlightIndex}
                                >
                                  {(draggableProvided) => (
                                    <div
                                      className={styles.card}
                                      key={highlightIndex}
                                      {...draggableProvided.draggableProps}
                                      {...draggableProvided.dragHandleProps}
                                      ref={draggableProvided.innerRef}
                                    >
                                      <KeyHighlight
                                        key={`highlight-${highlightIndex}`}
                                        title={highlight.title}
                                        description={highlight.description}
                                        background={highlight.background}
                                        url={highlight.url}
                                        highlightIndex={highlightIndex}
                                        onFieldChange={onFieldChange}
                                        shouldDisplay={displayHighlights[highlightIndex]}
                                        displayHandler={displayHandler}
                                        shouldAllowMoreHighlights={
                                          highlights.length < MAX_NUM_KEY_HIGHLIGHTS
                                        }
                                        deleteHandler={deleteHandler}
                                        errors={errors.highlights[highlightIndex]}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </>
                          )
                          : null }
                        {highlights.length < MAX_NUM_KEY_HIGHLIGHTS
                          ? <button type="button" id={`highlight-${highlights.length}-create`} className={elementStyles.blue} onClick={createHandler}>Create highlight</button>
                          : <button type="button" disabled className={elementStyles.disabled}>Create highlight</button>}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </>
              )}
          </div>
        </>
      )
      : null}
  </div>
);

export default EditorHeroSection;

EditorHeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displayHighlights: PropTypes.func.isRequired,
  displayDropdownElems: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      highlightIndex: PropTypes.number.isRequired,
      createHandler: PropTypes.func.isRequired,
      deleteHandler: PropTypes.func.isRequired,
      onFieldChange: PropTypes.func.isRequired,
      allowMoreHighlights: PropTypes.bool.isRequired,
    }),
  ),
  dropdown: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        dropdownsIndex: PropTypes.number.isRequired,
        onFieldChange: PropTypes.func.isRequired,
      }),
    ).isRequired,
    title: PropTypes.string.isRequired,
  }),
  errors: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        hero: PropTypes.shape({
          title: PropTypes.string.isRequired,
          subtitle: PropTypes.string.isRequired,
          background: PropTypes.string.isRequired,
          button: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          dropdown: PropTypes.string.isRequired,
        }),
      }),
    ),
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
};

EditorHeroSection.defaultProps = {
  highlights: undefined,
  dropdown: undefined,
};
