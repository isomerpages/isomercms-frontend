import React from 'react';
import PropTypes from 'prop-types';

/* eslint
  react/no-array-index-key: 0
  jsx-a11y/anchor-is-valid: 0
 */

const HeroButton = ({ button, url }) => (
  <a href={`{{- site.baseurl -}}${url}`} className="bp-button is-secondary is-uppercase search-button">
    {button}
  </a>
);

const HeroDropdownElem = ({ url, title }) => (
  <a className="bp-dropdown-item" href={`{{- site.baseurl -}}${url}`}>
    <h5>{title}</h5>
  </a>
);

const HeroDropdown = ({ title, options }) => (
  <div className="bp-dropdown margin--top--sm">
    <div className="bp-dropdown-trigger">
      <a className="bp-button bp-dropdown-button hero-dropdown is-centered" aria-haspopup="true" aria-controls="hero-dropdown-menu">
        <span>
          <b>
            <p>{ title || 'I want to' }</p>
          </b>
        </span>
        <span className="icon is-small">
          <i className="sgds-icon sgds-icon-chevron-down is-size-4" aria-hidden="true" />
        </span>
      </a>
    </div>
    <div className="bp-dropdown-menu has-text-left" id="hero-dropdown-menu" role="menu">
      <div className="bp-dropdown-content is-centered">
        { options.map((option, index) => (
          (option.url && option.title)
            ? <HeroDropdownElem key={`dropdown-${index}`} title={option.title} url={option.url} />
            : null
        ))}
      </div>
    </div>
  </div>
);

const KeyHighlightElem = ({ title, description, url }) => (
  <>
    {(title || description)
      ? (
        <div className="col">
          <a href={url} className="is-highlight">
            {/* Title */}
            {title
              ? (
                <p className="has-text-weight-semibold has-text-white key-highlight-title is-uppercase padding--top--xs">
                  {title}
                </p>
              )
              : null}
            {/* Description */}
            {description
              ? (
                <p className="has-text-white-trans padding--bottom--sm">
                  {description}
                </p>
              )
              : null}
          </a>
        </div>
      )
      : null}
  </>
);

const KeyHighlights = ({ highlights }) => (
  <section id="key-highlights" className="bp-section is-paddingless">
    <div className="bp-container">
      <div className="row is-gapless has-text-centered">
        {highlights.map(({ title, description, url }) => (
          <KeyHighlightElem title={title} description={description} url={url} />
        ))}
      </div>
    </div>
  </section>
);

const TemplateHeroSection = ({ hero, siteName }) => {
  const heroStyle = {
    background: `url(https://raw.githubusercontent.com/isomerpages/${siteName}/staging${hero.background}) no-repeat top left`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
  };
  return (
    <>
      {/* Main hero banner */}
      <section className="bp-hero bg-hero" style={heroStyle}>
        <div className="bp-hero-body">
          <div className="bp-container margin--top--lg">
            <div className="row is-vcentered is-centered ma">
              <div className="col is-9 has-text-centered has-text-white">
                <h1 className="display padding--bottom--lg margin--none">
                  <b className="is-hidden-touch">{hero.title}</b>
                  <b className="is-hidden-desktop">{hero.title}</b>
                </h1>
                {/* Hero subtitle */}
                { hero.subtitle
                  ? (
                    <p className="is-hidden-mobile padding--bottom--lg">
                      {hero.subtitle}
                    </p>
                  )
                  : null}
                {/* Hero dropdown */}
                { hero.dropdown
                  ? <HeroDropdown dropdown={hero.dropdown} />
                  : <HeroButton url={hero.url} button={hero.button} />}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Key highlights */}
      { hero.key_highlights
        ? <KeyHighlights highlights={hero.key_highlights} />
        : null}
    </>
  );
};

export default TemplateHeroSection;

HeroButton.propTypes = {
  button: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

HeroDropdownElem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

HeroDropdown.propTypes = {
  title: PropTypes.string.isRequired,
  options:
    PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
};

KeyHighlightElem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string.isRequired,
};

KeyHighlightElem.defaultProps = {
  title: undefined,
  description: undefined,
};

KeyHighlights.propTypes = {
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

TemplateHeroSection.propTypes = {
  hero: PropTypes.shape({
    background: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    button: PropTypes.string,
    url: PropTypes.string,
    dropdown: PropTypes.shape({
      title: PropTypes.string.isRequired,
      options:
        PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
          }),
        ).isRequired,
    }),
    key_highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  siteName: PropTypes.string.isRequired,
};
