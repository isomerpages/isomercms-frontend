// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

import PropTypes from "prop-types"
import { forwardRef } from "react"
import { useQuery } from "react-query"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { fetchImageURL, getClassNames } from "utils"

/* eslint
  react/no-array-index-key: 0
 */

const HeroButton = ({ button }) => (
  <>
    {button ? (
      <div
        className={getClassNames(
          editorStyles,
          ["bp-button, is-uppercase, search-button, default"],
          ["is-secondary"]
        )}
      >
        {button}
      </div>
    ) : null}
  </>
)

const HeroDropdownElem = ({ title }) => (
  <div className={editorStyles["bp-dropdown-item"]}>
    <h5>{title}</h5>
  </div>
)

const HeroDropdown = ({ title, options, isActive, toggleDropdown }) => (
  <div
    className={getClassNames(editorStyles, [
      "bp-dropdown",
      "margin--top--sm",
      `${isActive ? "is-active" : null}`,
    ])}
  >
    <div className={editorStyles["bp-dropdown-trigger"]}>
      <a
        className={getClassNames(editorStyles, [
          "bp-button",
          "bp-dropdown-button",
          "hero-dropdown",
          "is-centered",
        ])}
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
        <span className={getClassNames(editorStyles, ["icon", "is-small"])}>
          <i
            className={getClassNames(editorStyles, [
              "sgds-icon",
              "sgds-icon-chevron-down",
              "is-size-4",
            ])}
            aria-hidden="true"
          />
        </span>
      </a>
    </div>
    <div
      className={getClassNames(editorStyles, [
        "bp-dropdown-menu",
        "has-text-left",
      ])}
      id={editorStyles["hero-dropdown-menu"]}
      role="menu"
    >
      <div
        className={getClassNames(editorStyles, [
          "bp-dropdown-content",
          "is-centered",
        ])}
      >
        {options
          ? options.map((option, index) =>
              option.title ? (
                <HeroDropdownElem
                  key={`dropdown-${index}`}
                  title={option.title}
                />
              ) : null
            )
          : null}
      </div>
    </div>
  </div>
)

const KeyHighlightElem = ({ title, description }) => (
  <>
    {title || description ? (
      <div className={getClassNames(editorStyles, ["col"], ["col"])}>
        <div className={editorStyles["is-highlight"]}>
          {/* Title */}
          {title ? (
            <p
              className={getClassNames(editorStyles, [
                "has-text-weight-semibold",
                "has-text-white",
                "key-highlight-title",
                "is-uppercase",
                "padding--top--xs",
              ])}
            >
              {title}
            </p>
          ) : null}
          {/* Description */}
          {description ? (
            <p
              className={getClassNames(editorStyles, [
                "has-text-white-trans",
                "padding--bottom--sm",
              ])}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    ) : null}
  </>
)

const KeyHighlights = ({ highlights }) => (
  <section
    id={editorStyles["key-highlights"]}
    className={getClassNames(editorStyles, ["bp-section is-paddingless"])}
  >
    <div
      id="key-highlights"
      className={getClassNames(editorStyles, ["bp-container"])}
    >
      <div
        className={getClassNames(editorStyles, [
          "row",
          "is-gapless",
          "has-text-centered",
        ])}
      >
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

const TemplateHeroSection = (
  { hero, siteName, dropdownIsActive, toggleDropdown },
  ref
) => {
  const { data: loadedImageURL } = useQuery(
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
      <section
        className={getClassNames(editorStyles, ["bp-hero", "bg-hero"])}
        style={heroStyle}
      >
        <div className={editorStyles["bp-hero-body"]}>
          <div
            className={getClassNames(editorStyles, [
              "bp-container",
              "margin--top--lg",
            ])}
          >
            <div
              className={getClassNames(editorStyles, [
                "row",
                "is-vcentered",
                "is-centered",
                "ma",
              ])}
            >
              <div
                className={getClassNames(editorStyles, [
                  "col",
                  "is-9",
                  "has-text-centered",
                  "has-text-white",
                ])}
              >
                <h1
                  className={getClassNames(editorStyles, [
                    "display",
                    "padding--bottom--lg",
                    "margin--none",
                  ])}
                >
                  <b className={editorStyles["is-hidden-touch"]}>
                    {hero.title}
                  </b>
                  <b className={editorStyles["is-hidden-desktop"]}>
                    {hero.title}
                  </b>
                </h1>
                {/* Hero subtitle */}
                {hero.subtitle ? (
                  <p
                    className={getClassNames(editorStyles, [
                      "is-hidden-mobile",
                      "padding--bottom--lg",
                    ])}
                  >
                    {hero.subtitle}
                  </p>
                ) : null}
                {/* Hero dropdown */}
                {hero.dropdown ? (
                  <HeroDropdown
                    title={hero.dropdown.title}
                    options={hero.dropdown.options}
                    isActive={dropdownIsActive}
                    toggleDropdown={toggleDropdown}
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
      {!hero.dropdown && hero.key_highlights ? (
        <KeyHighlights highlights={hero.key_highlights} />
      ) : null}
    </div>
  )
}

export default forwardRef(TemplateHeroSection)

HeroButton.propTypes = {
  button: PropTypes.string,
}

HeroDropdownElem.propTypes = {
  title: PropTypes.string,
}

HeroDropdown.propTypes = {
  title: PropTypes.string,
  isActive: PropTypes.bool,
  toggleDropdown: PropTypes.func,
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
  dropdownIsActive: PropTypes.bool.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
}
