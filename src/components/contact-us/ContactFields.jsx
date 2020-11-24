import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../FormField';

const ContactFields = ({ 
  cardIndex, 
  content, 
  onFieldChange,  
}) => {  
  return (
    <div className={`d-flex flex-column`}>
      <FormField
        title="Phone"
        id={`contact-${cardIndex}-phone-0`}
        value={content[0].phone}
        onFieldChange={onFieldChange}
      />
      <FormField
        title="Email"
        id={`contact-${cardIndex}-email-1`}
        value={content[1].email}
        onFieldChange={onFieldChange}
      />
      <FormField
        title="Others"
        id={`contact-${cardIndex}-other-2`}
        value={content[2].other}
        onFieldChange={onFieldChange}
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
};
