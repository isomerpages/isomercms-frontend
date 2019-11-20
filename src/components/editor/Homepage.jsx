import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';

/* eslint
  react/no-array-index-key: 0
 */

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4;

const EditorInfobarSection = ({
  title,
  subtitle,
  description,
  button,
  url,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>
Infobar section:
        {title}
      </h2>
      <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionIndex}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Infobar title"
              id={`section-${sectionIndex}-infobar-title`}
              value={title}
              errorMessage={errors.title}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infobar subtitle"
              id={`section-${sectionIndex}-infobar-subtitle`}
              value={subtitle}
              errorMessage={errors.subtitle}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infobar description"
              id={`section-${sectionIndex}-infobar-description`}
              value={description}
              errorMessage={errors.description}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infobar button name"
              id={`section-${sectionIndex}-infobar-button`}
              value={button}
              errorMessage={errors.button}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infobar button URL"
              id={`section-${sectionIndex}-infobar-url`}
              value={url}
              errorMessage={errors.url}
              isRequired
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={elementStyles.inputGroup}>
            <button type="button" id={`section-${sectionIndex}`} className={elementStyles.warning} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
);

const EditorResourcesSection = ({
  title,
  subtitle,
  button,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>
Resources section:
        {title}
      </h2>
      <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionIndex}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Resources section title"
              id={`section-${sectionIndex}-resources-title`}
              value={title}
              errorMessage={errors.title}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Resources section subtitle"
              id={`section-${sectionIndex}-resources-subtitle`}
              value={subtitle}
              errorMessage={errors.subtitle}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Resources button name"
              id={`section-${sectionIndex}-resources-button`}
              value={button}
              errorMessage={errors.button}
              isRequired
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={elementStyles.inputGroup}>
            <button type="button" id={`section-${sectionIndex}`} className={elementStyles.warning} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
);

const KeyHighlight = ({
  title,
  description,
  url,
  highlightIndex,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  deleteHandler,
  errors,
}) => (

  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>
Highlight
        {highlightIndex + 1}
:
        {title}
      </h2>
      <button type="button" id={`highlight-${highlightIndex}-toggle`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`highlight-${highlightIndex}-icon`} />
      </button>
    </div>
    {/* Core highlight fields */}
    {shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Highlight title"
              id={`highlight-${highlightIndex}-title`}
              value={title}
              errorMessage={errors.title}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Highlight description"
              id={`highlight-${highlightIndex}-description`}
              value={description}
              errorMessage={errors.description}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Highlight URL"
              id={`highlight-${highlightIndex}-url`}
              value={url}
              errorMessage={errors.url}
              isRequired
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={elementStyles.inputGroup}>
            <button type="button" id={`highlight-${highlightIndex}-delete`} className={elementStyles.warning} onClick={deleteHandler} key={`${highlightIndex}-delete`}>Delete highlight</button>
          </div>
        </>
      )
      : null}
  </div>
);

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
Dropdown Elem
        {dropdownsIndex + 1}
:
        {title}
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
            <button type="button" id={`dropdownelem-${dropdownsIndex}-delete`} className={elementStyles.warning} onClick={deleteHandler}>Delete dropdown element</button>
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
  <div className={styles.card}>
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
          <button type="button" id={`dropdownelem-${options.length}-create`} className={elementStyles.blue} onClick={createHandler}>Create dropdown element</button>
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

const HeroButton = ({
  button,
  url,
  sectionIndex,
  onFieldChange,
  errors,
}) => (
  <>
    <FormField
      title="Hero button"
      id={`section-${sectionIndex}-hero-button`}
      value={button}
      errorMessage={errors.button}
      isRequired
      onFieldChange={onFieldChange}
    />
    <FormField
      title="Hero button URL"
      id={`section-${sectionIndex}-hero-url`}
      value={url}
      errorMessage={errors.url}
      isRequired
      onFieldChange={onFieldChange}
    />
  </>
);

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

const NewSectionCreator = ({ createHandler, hasResources }) => (
  <div className={`${elementStyles.card} ${elementStyles.addNew}`}>
    <h2>
Add a new section
      <i className="bx bx-plus" />
    </h2>
    <select name="newSection" id="section-new" onChange={createHandler}>
      <option value="">--Please choose a new section--</option>
      <option value="infobar">Infobar</option>
      {/* If homepage already has a Resources section,
        don't display the option to create one */}
      {hasResources
        ? null
        : <option value="resources">Resources</option>}
    </select>
  </div>
);

export {
  EditorInfobarSection, EditorResourcesSection, EditorHeroSection, NewSectionCreator,
};

NewSectionCreator.propTypes = {
  createHandler: PropTypes.func.isRequired,
  hasResources: PropTypes.bool.isRequired,
};

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

HeroButton.propTypes = {
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    button: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

EditorInfobarSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

EditorResourcesSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    button: PropTypes.string.isRequired,
  }).isRequired,
};

KeyHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  highlightIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

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
