import React from 'react';
import PropTypes from 'prop-types';

const Contact = ({ contact } ) => (
  <div className="col is-6">
    <p className="has-text-weight-semibold margin--top--none margin--bottom--none">{contact.title}</p>
    { 
      contact.content.map( (d, i) => {
        
        const key = Object.keys(d)[0];
        switch (key) {
          case 'phone': {
            return (
              <a href={`tel:${d[key].replace(/\s/g, '')}`} key={i}>
                <p className="margin--top--none margin--bottom--none">
                  <u>{d[key]}</u>
                </p>
              </a>
            )
          }
          case 'email': {
            return (
              <a href={`mailto:${d[key]}`}  key={i}>              
                <p className="margin--top--none margin--bottom--none">
                  <u>{d[key]}</u>
                </p>
              </a>
            )
          }
          default: { // others  
            return (
              /* TODO: CSP validation should be done on html elements before rendering */
              <div dangerouslySetInnerHTML={{__html: d[key]}} key={i}/>
            )
          }
        }
      })
    }
  </div>
);

Contact.propTypes = {
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
};

export default Contact;
