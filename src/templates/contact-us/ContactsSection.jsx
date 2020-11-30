import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const Contact = React.forwardRef(( { contact }, ref ) => (  
  <div className="col is-6" ref={ref}>
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
              <div dangerouslySetInnerHTML={{__html: `${DOMPurify.sanitize(d[key])}` }} key={i}/>
            )
          }
        }
      })
    }
  </div>
));

const TemplateContactsSection = React.forwardRef(( { contacts, scrollRefs }, ref ) => (
  <div ref={ref}>
    { contacts && contacts.length  
      ? <div className="row is-multiline margin--bottom--xl">
          <div className="col is-12 padding--bottom--none">
            <h5 className="has-text-secondary"><b>Contact Us</b></h5>
          </div>
          { contacts.map((contact, i) =>  <Contact contact={contact} key={i} ref={scrollRefs[i]}/> )}
        </div>
      : null
    }
  </div>
));

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

TemplateContactsSection.propTypes = {
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

export default TemplateContactsSection;
