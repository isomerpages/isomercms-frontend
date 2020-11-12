import React from 'react';
import PropTypes from 'prop-types';

const AddressHours = ({ operatingHours }) => (
  <div class="col is-6">
    {
    operatingHours 
    ? 
      operatingHours.map( (hours) => { 
        return (
          <div> 
            <p class="margin--top--none">
              <b>{hours.days}</b>:&nbsp;{hours.time}
              {hours.description}
            </p>
          </div>
        )
      })
    :
    null
    }
  </div>
);

const AddressLocation = ({ location } ) => (
  <div class="col is-6">
      <p class="margin--top--none margin--bottom--none"><b>{location.title}</b></p>
      <p class="content margin--top--none">{location.address}</p>
        <a href={location.directions} target="_blank" class="bp-sec-button has-text-secondary">
          <div>
              <span>FIND DIRECTIONS</span>
              <i class="sgds-icon sgds-icon-arrow-right" aria-hidden="true"></i>
          </div>
        </a>
    </div>
);

const Address = ({ location }) => (
  <div class="row is-multiline margin--bottom">
    <div class="col is-6 padding-bottom-none">
      <p></p>
      <h5 class="has-text-secondary"><b>HQ Address</b></h5>
    </div>
    <div class="col is-6 padding-bottom-none">
      { location.operatingHours  ?  <h5 class="has-text-secondary"><b>Operating Hours</b></h5> : null }
    </div>
    <AddressLocation location={location}/>
    <AddressHours operatingHours={location.operatingHours}/>
  </div>
);

Address.propTypes = {};

export default Address;