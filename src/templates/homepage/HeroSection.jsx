import PropTypes from "prop-types"
import React, { useState } from "react"
import { useQuery } from "react-query"

import { fetchImageURL } from "utils"

/* eslint
  react/no-array-index-key: 0
 */

const HeroButton = ({ button }) => (
  <>
    {button ? (
      <div className="bp-button is-secondary is-uppercase search-button default">
        {button}
      </div>
    ) : null}
  </>
)

const HeroDropdownElem = ({ title }) => (
  <>
    {title ? (
      <div className="bp-dropdown-item">
        <h5>{title}</h5>
      </div>
    ) : null}
  </>
)

const HeroDropdown = ({ title, options = [] }) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false)
  const toggleDropdown = () => setDropdownIsActive((prevState) => !prevState)
  return (
    <div
      className={`bp-dropdown margin--top--sm ${
        dropdownIsActive ? "is-active" : null
      }`}
    >
      <div className="bp-dropdown-trigger">
        <a
          className="bp-button bp-dropdown-button hero-dropdown is-centered"
          role="button"
          tabIndex="0"
          aria-haspopup="true"
          aria-controls="hero-dropdown-menu"
          onClick={toggleDropdown}
          onKeyDown={toggleDropdown}
        >
          <span>
            <b>
              <p>{title}</p>
            </b>
          </span>
          <span className="icon is-small">
            <i
              className="sgds-icon sgds-icon-chevron-down is-size-4"
              aria-hidden="true"
            />
          </span>
        </a>
      </div>
      <div
        className="bp-dropdown-menu has-text-left"
        id="hero-dropdown-menu"
        role="menu"
      >
        <div className="bp-dropdown-content is-centered">
          {options.map(({ title }, index) => (
            <HeroDropdownElem key={`dropdown-${index}`} title={title} />
          ))}
        </div>
      </div>
    </div>
  )
}

const KeyHighlightElem = ({ title, description }) => (
  <>
    {title || description ? (
      <div className="col">
        <div className="is-highlight">
          {/* Title */}
          {title ? (
            <p className="has-text-weight-semibold has-text-white key-highlight-title is-uppercase padding--top--xs">
              {title}
            </p>
          ) : null}
          {/* Description */}
          {description ? (
            <p className="has-text-white-trans padding--bottom--sm">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    ) : null}
  </>
)

const KeyHighlights = ({ highlights = [] }) => (
  <section id="key-highlights" className="bp-section is-paddingless">
    <div className="bp-container">
      <div className="row is-gapless has-text-centered">
        {highlights.map(({ title, description }, idx) => (
          <KeyHighlightElem
            title={title}
            description={description}
            key={`${title}-${idx}`}
          />
        ))}
      </div>
    </div>
  </section>
)

const TemplateHeroSection = ({ hero, siteName }, ref) => {
  const { data: loadedImageURL, status } = useQuery(
    `${siteName}/${hero.background}`,
    () => fetchImageURL(siteName, decodeURI(hero.background)),
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Never automatically refetch image unless query is invalidated
    }
  )

  const heroStyle = {
    // See j08691's answer at https://stackoverflow.com/questions/21388712/background-size-doesnt-work
    background: `url(${loadedImageURL}) no-repeat center center/cover`,
  }
  return (
    <div ref={ref}>
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
                {hero.subtitle ? (
                  <p className="is-hidden-mobile padding--bottom--lg">
                    {hero.subtitle}
                  </p>
                ) : null}
                {/* Hero dropdown */}
                {!_.isEmpty(hero.dropdown) ? (
                  <HeroDropdown
                    title={hero.dropdown.title}
                    options={hero.dropdown.options}
                  />
                ) : (
                  <HeroButton button={hero.button} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Key highlights */}
      {hero.key_highlights ? (
        <KeyHighlights highlights={hero.key_highlights} />
      ) : null}
    </div>
  )
}

export default React.forwardRef(TemplateHeroSection)

HeroButton.propTypes = {
  button: PropTypes.string,
}

HeroDropdownElem.propTypes = {
  title: PropTypes.string,
}

HeroDropdown.propTypes = {
  title: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ).isRequired,
}

KeyHighlightElem.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
}

KeyHighlightElem.defaultProps = {
  title: undefined,
  description: undefined,
}

KeyHighlights.propTypes = {
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    })
  ).isRequired,
}

TemplateHeroSection.propTypes = {
  hero: PropTypes.shape({
    background: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    button: PropTypes.string,
    dropdown: PropTypes.shape({
      title: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
        })
      ).isRequired,
    }),
    key_highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
      })
    ),
  }).isRequired,
  siteName: PropTypes.string.isRequired,
}
