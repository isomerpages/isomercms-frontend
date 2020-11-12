import React from 'react';
import PropTypes from 'prop-types';

const Hotline = ({ contact } ) => (
  <div class="col is-6">
    <div>
      <p class="has-text-weight-semibold margin--top--none margin--bottom--none">{contact.title}</p>
      { 
        contact.content.map( value => {
          if (value.includes('email')) {
            return (
              <p class="margin--top--none margin--bottom--none">
                <a href={`mailto:${value}`}><u>{value}</u></a>
              </p>
            )
          }
          return <p class="margin--top--none margin--bottom--none">value</p>
        })
      }
    </div>
  </div>
);

Hotline.propTypes = {};

export default Hotline;
