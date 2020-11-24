import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../FormField';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import _ from 'lodash';

const DEFAULT_NUM_OPERATING_FIELDS = 5;

const LocationHoursFields = ({ 
  operatingHours,
  cardIndex,
  onFieldChange,
}) => {
  
  return (
    <div class = "mt-4">
      <h6> Operating Hours </h6>
      { operatingHours && operatingHours.map( (operations, operationsIndex) => ( 
        <div class = "mb-1">
            <div class="d-flex flex-row">
              {/* containers used for custom padding around FormField */}
              <div class="flex-fill pr-1"> 
                <FormField
                  title="Days"
                  id={`location-${cardIndex}-operating_hours-${operationsIndex}-days`}
                  value={operations.days}
                  onFieldChange={onFieldChange}
                />
              </div>
              <div class="flex-fill pl-1">
                <FormField
                  title="Hours"
                  id={`location-${cardIndex}-operating_hours-${operationsIndex}-time`}
                  value={operations.time}
                  onFieldChange={onFieldChange}
                />
              </div>
            </div>
            <div>
              <FormField
                title="Description"
                id={`location-${cardIndex}-operating_hours-${operationsIndex}-description`}
                value={operations.description}
                onFieldChange={onFieldChange}
              />
            </div>
          <a class={elementStyles.formFixedText} id={`location-${cardIndex}-remove_operating_hours-${operationsIndex}`} href="#" onClick={onFieldChange}>
            Remove
          </a> 
        </div>
      ))} 
      <div className = "mt-3">
        { operatingHours.length < DEFAULT_NUM_OPERATING_FIELDS  
          ? <a class={elementStyles.formLabel}  id={`location-${cardIndex}-add_operating_hours`} href="#" onClick={onFieldChange}>
              Add operating hours
            </a>
          : <p class={elementStyles.formLabel}> Maximum 5 operating hours fields</p>
        }
      </div>
  </div>
  )
};

const LocationAddressFields = ({ 
  title,
  address,
  cardIndex,
  onFieldChange,
}) => {
  
  return (
    <>
      { address.map( (addressValue, addressIndex) => ( // sets default address length
        // div used for custom padding around FormField
        <div className="py-1" key={addressIndex}> 
          <FormField 
            title={ addressIndex === 0 ? title : null }
            id={`location-${cardIndex}-address-${addressIndex}`}
            value={addressValue}
            onFieldChange={onFieldChange}
          />
        </div>
      ))}
    </>
  )
};

export {
  LocationHoursFields,
  LocationAddressFields,
}

LocationHoursFields.propTypes = {
  operatingHours: PropTypes.arrayOf(
    PropTypes.shape({
      days: PropTypes.string,
      time: PropTypes.string,
      description: PropTypes.string,
    }),
  ),
  cardIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

LocationAddressFields.propTypes = {
  title: PropTypes.string,
  address: PropTypes.arrayOf(PropTypes.string),
  cardIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
