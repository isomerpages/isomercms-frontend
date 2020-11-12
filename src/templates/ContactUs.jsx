import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './pageComponents/Breadcrumb';
import Address from './contact-us/Address'
import Hotline from './contact-us/Hotline'

const ContactUs = ({ title, locations, contacts, feedbackUrl, imageUrl }) => (
  <div>
    {/* contact us header */}
    <section class="bp-section">
      <div class="bp-container">
        <div class="row is-inverted">
          <div class="col is-8 is-offset-2">
            <Breadcrumb title={'Contact Us'} />
          </div>
        </div>
        <div class="row">
          <div class="col is-8 is-offset-2">
            <h1 class="display has-text-weight-semibold">Get in touch with {title}</h1>
          </div>
        </div>
      </div>
    </section>

    {/* contact us content */}
    <section class="bp-section is-small padding--bottom--lg">
      <div class="bp-container">
        <div class="row">
          <div class="col is-8 is-offset-2">
            {/* address section */}
            { 
              locations.map( (location) => {
                return <Address location={location}/>
              })
            }
            {/* hotline section */}
            <div class="row is-multiline margin--bottom--xl">
              <div class="col is-12 padding--bottom--none">
                <h5 class="has-text-secondary"><b>Contact Us</b></h5>
              </div>
              { 
                contacts.map( (contact) => {
                  return <Hotline contact={contact}/>
                })
              }
            </div>
            {/* feedback url section */}
            { 
              feedbackUrl 
              ? 
              <div class="row is-multiline margin--bottom--lg">
                <div class="col is-12 padding--bottom--none">
                  <h5 class="has-text-secondary has-text-weight-semibold">Send us your feedback</h5>
                </div>
                <div class="col is-8">
                  <p>
                    If you have a query, feedback or wish to report a problem related to this website,
                    please fill in the <a href="{feedbackUrl}}" target="_blank"><u>online form</u></a>.
                  </p>
                </div>
              </div>  
              :
              null
            }
          </div>
        </div>
      </div>
    </section>

    {/* contact us image */}
    {
      imageUrl
      ?
      <section class="bp-section is-vh-60 bg-contact"></section>
      :
      null
    }
  </div>
);


ContactUs.propTypes = {};

export default ContactUs;
