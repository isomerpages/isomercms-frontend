import React from 'react';
import PropTypes from 'prop-types';

const LocationHours = ({ operatingHours }) => (
  <div className="col is-6">
    { operatingHours && operatingHours.map((operation, i) => { 
      return (
        <p className="margin--top--none" key={i}>
          <b>{operation.days}</b>:&nbsp;{operation.time}<br/>
          {operation.description}
        </p>
      )
    })}
  </div>
);

const LocationAddress = ({ location } ) => (
  <div className="col is-6">
    <div>
      { location.address.map((value, i) => <p className="content margin--top--none margin--bottom--none" key={i}>{value}</p>) }
      <a 
        href={location.maps_link || `https://maps.google.com/?q=${location.address.join('+').replace(/\s/g, '+')}`} 
        className="bp-sec-button has-text-secondary margin--top"
        rel="noopener noreferrer" 
        target="_blank"
      >
        <div>
          <span>VIEW MAP</span>
          <i className="sgds-icon sgds-icon-arrow-right" aria-hidden="true"></i>
        </div>
      </a>
    </div>
  </div>
);

const Location = React.forwardRef( ( { location }, ref ) => (
  <div className="row is-multiline margin--bottom" ref={ref}>
    { location.address && location.title &&
      <div className="col is-6 padding--bottom--none">
        <h5 className="has-text-secondary"><b>{location.title}</b></h5>
      </div>
    }
    
    <div className="col is-6 padding--bottom--none is-hidden-mobile">
      { location.operating_hours && location.operating_hours.length 
        ? <h5 className="has-text-secondary"><b>Operating Hours</b></h5>
        : null
      }
    </div>
    <LocationAddress location={location}/>
    <LocationHours operatingHours={location.operating_hours}/>
  </div>
));

const TemplateLocationsSection = React.forwardRef(( { locations, scrollRefs }, ref) => (
  <div ref={ref}>
    { locations &&
      <> 
        { locations.map( (location, i) => <Location location={location} key={i} ref={scrollRefs[i]}/> )}
      </>
    }
  </div>
));

LocationAddress.propTypes = {
  location: PropTypes.shape({
    address: PropTypes.arrayOf(PropTypes.string),
    maps_link: PropTypes.string,
  }),
}

LocationHours.propTypes = {
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    })
  ),
}

Location.propTypes = {
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
};

TemplateLocationsSection.propTypes = {
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

export default TemplateLocationsSection;