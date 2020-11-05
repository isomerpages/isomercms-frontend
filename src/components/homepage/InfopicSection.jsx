import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import FormFieldMedia from '../FormFieldMedia';

/* eslint
  react/no-array-index-key: 0
 */

const EditorInfopicSection = ({
  title,
  subtitle,
  description,
  button,
  url,
  imageUrl,
  imageAlt,
  sectionIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  errors,
  siteName,
}) => (
  <div className={`${elementStyles.card} move`}>
    <div className={elementStyles.cardHeader}>
      <h2>
        Infopic section: {title}
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
              title="Infopic title"
              id={`section-${sectionIndex}-infopic-title`}
              value={title}
              errorMessage={errors.title}
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infopic subtitle"
              id={`section-${sectionIndex}-infopic-subtitle`}
              value={subtitle}
              errorMessage={errors.subtitle}
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infopic description"
              id={`section-${sectionIndex}-infopic-description`}
              value={description}
              errorMessage={errors.description}
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infopic button name"
              id={`section-${sectionIndex}-infopic-button`}
              value={button}
              errorMessage={errors.button}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Infopic button URL"
              placeholder="Insert permalink or external URL"
              id={`section-${sectionIndex}-infopic-url`}
              value={url}
              errorMessage={errors.url}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormFieldMedia
              title="Infopic image URL"
              id={`section-${sectionIndex}-infopic-image`}
              value={imageUrl}
              errorMessage={errors.image}
              isRequired
              onFieldChange={onFieldChange}
              inlineButtonText="Choose Image"
              placeholder=" "
              siteName={siteName}
              type="image"
            />
            <FormField
              title="Infopic image alt text"
              id={`section-${sectionIndex}-infopic-alt`}
              value={imageAlt}
              errorMessage={errors.alt}
              isRequired
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={elementStyles.inputGroup}>
            <button type="button" id={`section-${sectionIndex}`} className={`ml-auto ${elementStyles.warning}`} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
);

export default EditorInfopicSection;

EditorInfopicSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
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
    imageUrl: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
  }).isRequired,
};
