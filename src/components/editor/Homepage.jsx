import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../styles/App.module.scss';

/* eslint
  react/no-array-index-key: 0
 */

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4;

const EditorInfobarSection = ({
  title, subtitle, description, button, url, sectionIndex, deleteSection, onFieldChange,
}) => (
  <div className={styles.card}>
    <p><b>Infobar section</b></p>
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
    <br />
    <button type="button" id={`section-${sectionIndex}`} onClick={deleteSection}>Delete section</button>
  </div>
);

const EditorResourcesSection = ({
  title, subtitle, button, sectionIndex, deleteSection, onFieldChange,
}) => (
  <div className={styles.card}>
    <p><b>Resources section</b></p>
    <p>Resources section title</p>
    <input placeholder="Resource section title" defaultValue={title} value={title} id={`section-${sectionIndex}-resources-title`} onChange={onFieldChange} />
    <p>Resources section subtitle</p>
    <input placeholder="Resource section subtitle" defaultValue={subtitle} value={subtitle} id={`section-${sectionIndex}-resources-subtitle`} onChange={onFieldChange} />
    <p>Resources button name</p>
    <input placeholder="Resource button button" defaultValue={button} value={button} id={`section-${sectionIndex}-resources-button`} onChange={onFieldChange} />
    <br />
    <button type="button" id={`section-${sectionIndex}`} onClick={deleteSection}>Delete section</button>
  </div>
);

const KeyHighlight = ({
  title,
  description,
  url,
  highlightIndex,
  onFieldChange
}) => (
  <div className={styles.card} key={highlightIndex}>
    <b>Highlight {highlightIndex}</b>
    <p>Highlight title</p>
    <input placeholder="Highlight title" defaultValue={title} value={title} id={`highlight-${highlightIndex}-title`} onChange={onFieldChange} key={`${highlightIndex}-title`} />
    <p>Highlight description</p>
    <input placeholder="Highlight description" defaultValue={description} value={description} id={`highlight-${highlightIndex}-description`} onChange={onFieldChange} key={`${highlightIndex}-description`} />
    <p>Highlight URL</p>
    <input placeholder="Highlight URL" defaultValue={url} value={url} id={`highlight-${highlightIndex}-url`} onChange={onFieldChange} key={`${highlightIndex}-url`} />
    <br />
  </div>
);

const HeroDropdownElem = ({title, url, dropdownsIndex, onFieldChange}) => (
  <div className={styles.card}>
    <p>Dropdown element title</p>
    <input placeholder="Hero dropdown element title" defaultValue={title} value={title} id={`dropdownelem-${dropdownsIndex}-title`} onChange={onFieldChange} />
    <p>Dropdown element URL</p>
    <input placeholder="Hero dropdown element URL" defaultValue={url} value={url} id={`dropdownelem-${dropdownsIndex}-url`} onChange={onFieldChange} />
  </div>
)

const HeroDropdown = ({
  title, 
  options, 
  createHeroDropdownElem, 
  deleteHeroDropdownElem,
  onFieldChange}) => (
  <div className={styles.card}>
    <p>Hero dropdown</p>
    <p>Dropdown title</p>
    <input placeholder="Hero dropdown title" defaultValue={title} value={title} id={`dropdown-title`} onChange={onFieldChange} />
    {/* Initial button to create dropdown element */}
    { (options && options.length > 0) ? 
      options.map((option, dropdownsIndex) => (
        <>
          <HeroDropdownElem 
            title={option.title} 
            url={option.url} 
            dropdownsIndex={dropdownsIndex} 
            onFieldChange={onFieldChange}/>
            <button type="button" id={`dropdownelem-${dropdownsIndex}-delete`} onClick={deleteHeroDropdownElem}>Delete dropdown element</button>
            <button type="button" id={`dropdownelem-${dropdownsIndex}-create`} onClick={createHeroDropdownElem}>Create dropdown element</button>
        </>
      ))
    :
      <button type="button" id="dropdownelem-0-create" onClick={createHeroDropdownElem}>Create dropdown element</button>
    }
  </div>
)

const HeroButton = ({button, url, sectionIndex, onFieldChange}) => (
  <>
    <p>Hero button</p>
    <input placeholder="Hero button name" defaultValue={button} value={button} id={`section-${sectionIndex}-hero-button`} onChange={onFieldChange} />
    <p>Hero button URL</p>
    <input placeholder="Hero button URL" defaultValue={url} value={url} id={`section-${sectionIndex}-hero-url`} onChange={onFieldChange} />
  </>
)

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
  createHighlight,
  deleteHighlight,
  createHeroDropdownElem,
  deleteHeroDropdownElem,
  createHeroDropdown,
  deleteHeroDropdown
}) => (
  <>
    <p><b>Hero section</b></p>
    <p>Hero title</p>
    <input placeholder="Hero title" defaultValue={title} value={title} id={`section-${sectionIndex}-hero-title`} onChange={onFieldChange} />
    <p>Hero subtitle</p>
    <input placeholder="Hero subtitle" defaultValue={subtitle} value={subtitle} id={`section-${sectionIndex}-hero-subtitle`} onChange={onFieldChange} />
    <p>Hero background image</p>
    <input placeholder="Hero background image" defaultValue={background} value={background} id={`section-${sectionIndex}-hero-background`} onChange={onFieldChange} />
    <p><i>Note: you can only have either Key Highlights and a Hero button or a Hero Dropdown</i></p>
    {dropdown ? 
      <>
        <button type="button" onClick={deleteHeroDropdown}>Delete Hero Dropdown</button>
        <HeroDropdown 
          title={dropdown.title} 
          options={dropdown.options} 
          sectionIndex={sectionIndex} 
          createHeroDropdownElem={createHeroDropdownElem}
          deleteHeroDropdownElem={deleteHeroDropdownElem}
          onFieldChange={onFieldChange} />
      </>
      :
      <div className={styles.card}>
        <button type="button" onClick={createHeroDropdown}>Create Hero Dropdown</button>
        <HeroButton button={button} url={url} sectionIndex={sectionIndex} onFieldChange={onFieldChange} />
        {(highlights && highlights.length > 0) ? 
          <>
            <b>Hero highlights</b>
            {highlights.map((highlight, highlightIndex) => (
              <div className={styles.card} key={highlightIndex}>
                <KeyHighlight
                  title={highlight.title}
                  description={highlight.description}
                  background={highlight.background}
                  url={highlight.url}
                  highlightIndex={highlightIndex}
                  onFieldChange={onFieldChange}
                />
                <button type="button" id={`highlight-${highlightIndex}-delete`} onClick={deleteHighlight} key={`${highlightIndex}-delete`}>Delete highlight</button>
                {highlights.length < MAX_NUM_KEY_HIGHLIGHTS
                  ? <button type="button" id={`highlight-${highlightIndex}-create`} onClick={createHighlight} key={`${highlightIndex}-create`}>Create highlight</button>
                  : null}
              </div>
            ))}
          </>
        :
          <button type="button" id={`highlight-0-create`} onClick={createHighlight} key="0-create" >Create highlight</button>
        }
      </div>
    }
  </>
);

export { EditorInfobarSection, EditorResourcesSection, EditorHeroSection };

EditorInfobarSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteSection: PropTypes.func.isRequired,
};

EditorResourcesSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteSection: PropTypes.func.isRequired,
};

KeyHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  highlightIndex: PropTypes.number.isRequired,
  deleteHighlight: PropTypes.func.isRequired,
  createHighlight: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  allowMoreHighlights: PropTypes.bool.isRequired,
};

EditorHeroSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      highlightIndex: PropTypes.number.isRequired,
      deleteHighlight: PropTypes.func.isRequired,
      createHighlight: PropTypes.func.isRequired,
      onFieldChange: PropTypes.func.isRequired,
      allowMoreHighlights: PropTypes.bool.isRequired,
    }),
  ),
  onFieldChange: PropTypes.func.isRequired,
  createHighlight: PropTypes.func.isRequired,
  deleteHighlight: PropTypes.func.isRequired,
};

EditorHeroSection.defaultProps = {
  highlights: undefined,
};
