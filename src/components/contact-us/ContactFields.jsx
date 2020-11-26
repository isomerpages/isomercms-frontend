import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../FormField';

const ContactFields = ({ 
  cardIndex, 
  content, 
  onFieldChange,  
  errors,
  sectionId,
}) => {  
  return (
    <div className={`d-flex flex-column`}>
      <FormField
        title="Phone"
        id={`${sectionId}-${cardIndex}-phone-0`}
        value={content[0].phone}
        onFieldChange={onFieldChange}
        errorMessage={errors[0].phone}
      />
      <FormField
        title="Email"
        id={`${sectionId}-${cardIndex}-email-1`}
        value={content[1].email}
        onFieldChange={onFieldChange}
        errorMessage={errors[1].email}
      />
      <FormField
        title="Others"
        id={`${sectionId}-${cardIndex}-other-2`}
        value={content[2].other}
        onFieldChange={onFieldChange}
        errorMessage={errors[2].other}
      />
    </div>
  )
};

export default ContactFields;

ContactFields.propTypes = {
  cardIndex: PropTypes.number.isRequired,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      phone: PropTypes.string,
    }),
    PropTypes.shape({
      email: PropTypes.string,
    }),
    PropTypes.shape({
      other: PropTypes.string,
    }),
  ),
  onFieldChange: PropTypes.func.isRequired, 
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      phone: PropTypes.string,
    }),
    PropTypes.shape({
      email: PropTypes.string,
    }),
    PropTypes.shape({
      other: PropTypes.string,
    }),
  ),
  sectionId: PropTypes.string,
};
