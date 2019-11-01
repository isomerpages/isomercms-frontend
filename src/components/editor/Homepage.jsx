import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';

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
}) => (
  <div className={styles.card}>
    <p><b>Infobar section: {title}</b></p>
    <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>Toggle display</button>
    <button type="button" id={`section-${sectionIndex}`} onClick={deleteHandler}>Delete section</button>
    {shouldDisplay
      ? (
        <>
          <p>Infobar title</p>
          <input placeholder="Infobar title" defaultValue={title} value={title} id={`section-${sectionIndex}-infobar-title`} onChange={onFieldChange} />
          <p>Infobar subtitle</p>
          <input placeholder="Infobar subtitle" defaultValue={subtitle} value={subtitle} id={`section-${sectionIndex}-infobar-subtitle`} onChange={onFieldChange} />
          <p>Infobar description</p>
          <input placeholder="Infobar description" defaultValue={description} value={description} id={`section-${sectionIndex}-infobar-description`} onChange={onFieldChange} />
          <p>Infobar button name</p>
          <input placeholder="Infobar button name" defaultValue={button} value={button} id={`section-${sectionIndex}-infobar-button`} onChange={onFieldChange} />
          <p>Infobar button URL</p>
          <input placeholder="Infobar button URL" defaultValue={url} value={url} id={`section-${sectionIndex}-infobar-url`} onChange={onFieldChange} />
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
}) => (
  <div className={styles.card}>
    <p><b>Resources section</b></p>
    <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>Toggle display</button>
    <button type="button" id={`section-${sectionIndex}`} onClick={deleteHandler}>Delete section</button>
    {shouldDisplay
      ? (
        <>
          <p>Resources section title</p>
          <input placeholder="Resource section title" defaultValue={title} value={title} id={`section-${sectionIndex}-resources-title`} onChange={onFieldChange} />
          <p>Resources section subtitle</p>
          <input placeholder="Resource section subtitle" defaultValue={subtitle} value={subtitle} id={`section-${sectionIndex}-resources-subtitle`} onChange={onFieldChange} />
          <p>Resources button name</p>
          <input placeholder="Resource button button" defaultValue={button} value={button} id={`section-${sectionIndex}-resources-button`} onChange={onFieldChange} />
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
  createHandler,
  shouldAllowMoreHighlights,
}) => (
  <div className={styles.card} key={highlightIndex}>
    <b>
Highlight
      {highlightIndex}: {title}
    </b>
    <br />
    {/* Create/delete/toggle buttons */}
    <button type="button" id={`highlight-${highlightIndex}-toggle`} onClick={displayHandler}>Toggle display</button>
    <button type="button" id={`highlight-${highlightIndex}-delete`} onClick={deleteHandler} key={`${highlightIndex}-delete`}>Delete highlight</button>
    {shouldAllowMoreHighlights
      ? <button type="button" id={`highlight-${highlightIndex}-create`} onClick={createHandler} key={`${highlightIndex}-create`}>Create highlight</button>
      : null}

    {/* Core highlight fields */}
    {shouldDisplay
      ? (
        <>
          <p>Highlight title</p>
          <input placeholder="Highlight title" defaultValue={title} value={title} id={`highlight-${highlightIndex}-title`} onChange={onFieldChange} key={`${highlightIndex}-title`} />
          <p>Highlight description</p>
          <input placeholder="Highlight description" defaultValue={description} value={description} id={`highlight-${highlightIndex}-description`} onChange={onFieldChange} key={`${highlightIndex}-description`} />
          <p>Highlight URL</p>
          <input placeholder="Highlight URL" defaultValue={url} value={url} id={`highlight-${highlightIndex}-url`} onChange={onFieldChange} key={`${highlightIndex}-url`} />
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
  createHandler,
  shouldDisplay,
  displayHandler,
}) => (
  <div className={styles.card}>
    <p>
      <b>
Dropdown Elem
        {dropdownsIndex}: {title}
      </b>
    </p>
    <br />
    {/* Create/delete/toggle buttons */}
    <button type="button" id={`dropdownelem-${dropdownsIndex}-toggle`} onClick={displayHandler}>Toggle display</button>
    <button type="button" id={`dropdownelem-${dropdownsIndex}-delete`} onClick={deleteHandler}>Delete dropdown element</button>
    <button type="button" id={`dropdownelem-${dropdownsIndex}-create`} onClick={createHandler}>Create dropdown element</button>
    { shouldDisplay
      ? (
        <>
          <p>Dropdown element title</p>
          <input placeholder="Hero dropdown element title" defaultValue={title} value={title} id={`dropdownelem-${dropdownsIndex}-title`} onChange={onFieldChange} />
          <p>Dropdown element URL</p>
          <input placeholder="Hero dropdown element URL" defaultValue={url} value={url} id={`dropdownelem-${dropdownsIndex}-url`} onChange={onFieldChange} />
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
}) => (
  <div className={styles.card}>
    <p>Hero dropdown</p>
    <p>Dropdown title</p>
    <input placeholder="Hero dropdown title" defaultValue={title} value={title} id="dropdown-title" onChange={onFieldChange} />
    <br />
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
                    />
                  </div>
                )}
              </Draggable>
            ))
            : <button type="button" id="dropdownelem-0-create" onClick={createHandler}>Create dropdown element</button>}
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
}) => (
  <>
    <p>Hero button</p>
    <input placeholder="Hero button name" defaultValue={button} value={button} id={`section-${sectionIndex}-hero-button`} onChange={onFieldChange} />
    <p>Hero button URL</p>
    <input placeholder="Hero button URL" defaultValue={url} value={url} id={`section-${sectionIndex}-hero-url`} onChange={onFieldChange} />
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
}) => (
  <>
    <p><b>Hero section</b></p>
    <button type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>Toggle display</button>
    {!shouldDisplay
      ? (
        <>
          <p>Hero title</p>
          <input placeholder="Hero title" defaultValue={title} value={title} id={`section-${sectionIndex}-hero-title`} onChange={onFieldChange} />
          <p>Hero subtitle</p>
          <input placeholder="Hero subtitle" defaultValue={subtitle} value={subtitle} id={`section-${sectionIndex}-hero-subtitle`} onChange={onFieldChange} />
          <p>Hero background image</p>
          <input placeholder="Hero background image" defaultValue={background} value={background} id={`section-${sectionIndex}-hero-background`} onChange={onFieldChange} />
          <p>
            <i>Note: you can only have either Key Highlights+Hero button or a Hero Dropdown</i>
          </p>
          {dropdown
            ? (
              <>
                <button type="button" id="dropdown-delete" onClick={deleteHandler}>Delete Hero Dropdown</button>
                <HeroDropdown
                  title={dropdown.title}
                  options={dropdown.options}
                  sectionIndex={sectionIndex}
                  createHandler={createHandler}
                  deleteHandler={deleteHandler}
                  onFieldChange={onFieldChange}
                  displayDropdownElems={displayDropdownElems}
                  displayHandler={displayHandler}
                />
              </>
            )
            : (
              <div className={styles.card}>
                <button type="button" id="dropdown-create" onClick={createHandler}>Create Hero Dropdown</button>
                <HeroButton
                  button={button}
                  url={url}
                  sectionIndex={sectionIndex}
                  onFieldChange={onFieldChange}
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
                                      createHandler={createHandler}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </>
                        )
                        : <button type="button" id="highlight-0-create" onClick={createHandler} key="0-create">Create highlight</button>}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
        </>
      )
      : null}
  </>
);

const NewSectionCreator = ({ createHandler, hasResources }) => (
  <>
    Create new section
    <br />
    <select name="newSection" id="section-new" onChange={createHandler}>
      <option value="">--Please choose a new section--</option>
      <option value="infobar">Infobar</option>
      {/* If homepage already has a Resources section,
        don't display the option to create one */}
      {hasResources
        ? null
        : <option value="resources">Resources</option>}
    </select>
  </>
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
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
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
};

HeroButton.propTypes = {
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
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
};

KeyHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  highlightIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  shouldAllowMoreHighlights: PropTypes.bool.isRequired,
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
};

EditorHeroSection.defaultProps = {
  highlights: undefined,
  dropdown: undefined,
};
