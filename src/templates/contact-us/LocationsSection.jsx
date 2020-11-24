import React from 'react';
import Location from './Location';
import PropTypes from 'prop-types';

const LocationsSection = ({ locations }) => (
  <>
    { locations &&
      <> 
        { locations.map( (location, i) => <Location location={location} key={i}/> ) }
      </>
    }
  </>
);

LocationsSection.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.shape({
        address: PropTypes.arrayOf(PropTypes.string),
        title: PropTypes.string,
        operating_hours: PropTypes.arrayOf(
          PropTypes.shape({
            days: PropTypes.string,
            time: PropTypes.string,
            description: PropTypes.string,
          })
        ),
        maps_link: PropTypes.string,
      }),
    })
  )
};

export default LocationsSection;