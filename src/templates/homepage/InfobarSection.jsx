import React from 'react';
import PropTypes from 'prop-types';

/* eslint
  react/no-array-index-key: 0
  jsx-a11y/anchor-is-valid: 0
 */

const TemplateInfobarSection = ({
  title, subtitle, description, url, button, sectionIndex,
}) => (
  <section className={`bp-section ${(sectionIndex % 2 === 1) ? 'bg-newssection' : null}`}>
    <div className="bp-container is-fluid">
      <div className="row">
        <div className="col is-half is-offset-one-quarter has-text-centered padding--top--xl">
          {/* Subtitle */}
          {subtitle
            ? <p className="padding--bottom eyebrow is-uppercase">{subtitle}</p>
            : null}
          {/* Title */}
          {title
            ? <h1 className="has-text-secondary padding--bottom"><b>{title}</b></h1>
            : null}
          {/* Description */}
          { description
            ? <p>{description}</p>
            : null}
        </div>
      </div>
    </div>
    {/* Button */}
    {(url && button)
      ? (
        <div className="row has-text-centered margin--top padding--bottom">
          <div className="col is-offset-one-third is-one-third">
            <a href={url} className="bp-sec-button">
              <div>
                <span>{button}</span>
                <i className="sgds-icon sgds-icon-arrow-right is-size-4" aria-hidden="true" />
              </div>
            </a>
          </div>
        </div>
      )
      : null}
  </section>
);

TemplateInfobarSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  sectionIndex: PropTypes.number.isRequired,
};

TemplateInfobarSection.defaultProps = {
  title: undefined,
  subtitle: undefined,
  description: undefined,
};


export default TemplateInfobarSection;
