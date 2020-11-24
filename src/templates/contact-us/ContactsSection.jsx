import React from 'react';
import Contact from './Contact';
import PropTypes from 'prop-types';

const ContactsSection = ({ contacts }) => (
  <>
    { contacts && 
      <div className="row is-multiline margin--bottom--xl">
        <div className="col is-12 padding--bottom--none">
          <h5 className="has-text-secondary"><b>Contact Us</b></h5>
        </div>
        { contacts.map( (contact, i) => <Contact contact={contact} key={i}/> ) }
      </div>
    }
  </>
);


ContactsSection.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
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
    }),
  ),
};

export default ContactsSection;
