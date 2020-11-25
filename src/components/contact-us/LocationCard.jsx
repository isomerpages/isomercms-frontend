import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import { LocationHoursFields, LocationAddressFields } from './LocationFields'
/* eslint
  react/no-array-index-key: 0
 */

const EditorLocationSection = ({
  title,
  address,
  operatingHours,
  mapUrl,
  cardIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  cardErrors,
}) => (
  <div className={`${elementStyles.card} move`}>
    <div className={elementStyles.cardHeader}>
      <h2>
        {title}
      </h2>
      <button type="button" id={`location-${cardIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`location-${cardIndex}-icon`} />
      </button>
    </div>
    { shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Title"
              id={`location-${cardIndex}-title`}
              value={title}
              onFieldChange={onFieldChange}
              errorMessage={cardErrors.title}
            />
            <LocationAddressFields
              title="Address"
              cardIndex={cardIndex}
              address={address}
              onFieldChange={onFieldChange}
              errors={cardErrors.address}
            />
            <FormField
              title="Map url"
              id={`location-${cardIndex}-maps_link`}
              value={mapUrl}
              onFieldChange={onFieldChange}
              errorMessage={cardErrors.maps_link}
            />
            <LocationHoursFields
              operatingHours={operatingHours}
              onFieldChange={onFieldChange}
              cardIndex={cardIndex}
              errors={cardErrors.operating_hours}
            />
          </div>
          <div className={`${elementStyles.inputGroup} pt-5`}>
            <button type="button" id={`location-${cardIndex}`} className={`btn-block ${elementStyles.warning}`} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
);

export default EditorLocationSection;

EditorLocationSection.propTypes = {
  title: PropTypes.string,
  address: PropTypes.arrayOf(PropTypes.string),
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  mapUrl: PropTypes.string,
  cardIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  cardErrors: PropTypes.shape({
    title: PropTypes.string,
    address: PropTypes.arrayOf(PropTypes.string),
    operatingHours: PropTypes.arrayOf(
      PropTypes.shape({
        days: PropTypes.string,
        time: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    mapUrl: PropTypes.string,
  })
};
