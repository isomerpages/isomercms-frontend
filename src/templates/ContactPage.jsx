import React from 'react';
import PropTypes from 'prop-types';

const TemplateContactPage = ({
  agencyName,
  locations,
  contacts
}) => (
  <div>
    {/* Breadcrumb header */}
    <section class="bp-section">
      <div class="bp-container">
        <div class="row is-inverted">
          <div class="col is-8 is-offset-2">
            <nav className="bp-breadcrumb" aria-label="breadcrumbs">
              <ul>
                <li><a href="/"><small>HOME</small></a></li>
                <li><a href="/contact-us/"><small>CONTACT US</small></a></li>
              </ul>
            </nav>
          </div>
        </div>
        <div class="row">
          <div class="col is-8 is-offset-2">
            <h1 class="display has-text-weight-semibold">Get in touch with<br />
              <span class="has-text-secondary">{ agencyName }</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
    
    {/* Main body */}
    <section class="bp-section is-small padding--bottom--lg">
      <div class="bp-container">
        <div class="row">
          <div class="col is-8 is-offset-2">
            {/* Locations array */}
            { 
              locations && 
              locations.length > 0 && 
              locations.map(location => (
              <div class="row is-multiline margin--bottom">
                <div class="col is-6 padding--bottom--none">
                  <h5 class="has-text-secondary"><b>{ location.title }</b></h5>
                </div>
                <div class="col is-6 padding--bottom--none">
                  { location.operating_hours ?
                    <h5 class="has-text-secondary"><b>Operating Hours</b></h5>
                  : null }
                </div>
                <div class="col is-6">
                  <div>
                    {/* Display address */}
                    { location.address &&
                      location.address.length > 0 &&
                      location.address.map(addressLine => (
                        <p class="content margin--top--none margin--bottom--none">
                          { addressLine }
                        </p>
                    ))}

                    {/* Display maps link */}
                    {/* If maps_link isn't provided, search google for it */}
                    <a href={ location.maps_link ?
                      location.maps_link
                      : 
                      `https://www.google.com/maps/place/${location.address}`
                    } class="bp-sec-button has-text-secondary margin--top">
                      <div>
                        <span>VIEW MAP</span>
                        <i class="sgds-icon sgds-icon-arrow-right" aria-hidden="true"></i>
                      </div>
                    </a>
                  </div>
                </div>
                <div class="col is-6">
                  <div>
                    { location.operating_hours &&
                      location.operating_hours.length > 0 &&
                      location.operating_hours.map(operation => (
                      <p class="margin--top--none">
                        <b>{operation.days}{' '}</b>{operation.time}<br />
                        {operation.description}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Contact information */}
            <div class="row is-multiline margin--bottom--xl">
              <div class="col is-12 padding--bottom--none">
                <h5 class="has-text-secondary"><b>Contact Us</b></h5>
              </div>
              { contacts && 
                contacts.length > 0 && 
                contacts.map(contact => (
                <div class="col is-6">
                  <div>
                    <p class="has-text-weight-semibold margin--top--none margin--bottom--none">{contact.title}</p>
                    { contact.content &&
                      contact.content.length > 0 &&
                      contact.content.map(contentLine => (
                      <p class="margin--top--none margin--bottom--none">
                        {/* Email info */}
                        {contentLine.email ? 
                          <a href={`mailto:${contentLine.email}`}>
                            <u>{contentLine.email}</u>
                          </a>
                        : null}

                        {/* Phone contact info */}
                        {contentLine.phone ?
                          <a href={`tel:${contentLine.phone}`}>
                            <u>{contentLine.phone}</u>
                          </a>
                        : null }

                        {/* Other contact info */}
                        {contentLine.other}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
)

export default TemplateContactPage