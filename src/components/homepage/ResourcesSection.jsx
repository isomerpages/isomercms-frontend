import React from 'react';

import PropTypes from 'prop-types';

import { isEmpty } from '@src/utils';

import elementStyles from '@styles/isomer-cms/Elements.module.scss';

import FormField from '@components/FormField';

/* eslint
  react/no-array-index-key: 0
 */

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
  <div className={`${elementStyles.card} ${!shouldDisplay && !isEmpty(errors) ? elementStyles.error : ''} move`}>
    <div className={elementStyles.cardHeader}>
      <h2>
        Resources section: {title}
      </h2>
      <button className="pl-3" type="button" id={`section-${sectionIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionIndex}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Resources section subtitle"
              id={`section-${sectionIndex}-resources-subtitle`}
              value={subtitle}
              errorMessage={errors.subtitle}
              isRequired
              onFieldChange={onFieldChange}
            />
            <FormField
              title="Resources section title"
              id={`section-${sectionIndex}-resources-title`}
              value={title}
              errorMessage={errors.title}
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
            <button type="button" id={`section-${sectionIndex}`} className={`ml-auto ${elementStyles.warning}`} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
);

export default EditorResourcesSection;

EditorResourcesSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  button: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    button: PropTypes.string,
  }).isRequired,
};
