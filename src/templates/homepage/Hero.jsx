import React from 'react';

const HeroButton = ({button, url}) => (
  <a href={`{{- site.baseurl -}}${url}`} class="bp-button is-secondary is-uppercase search-button">
    {button}
  </a>
)

const HeroDropdownElem = ({ url, title }) => (
  <a class="bp-dropdown-item" href={`{{- site.baseurl -}}${url}`}>
    <h5>{title}</h5>
  </a>
)

const HeroDropdown = ({ title, options }) => (
  <div class="bp-dropdown margin--top--sm">
    <div class="bp-dropdown-trigger">
        <a class="bp-button bp-dropdown-button hero-dropdown is-centered" aria-haspopup="true" aria-controls="hero-dropdown-menu">
          <span>
              <b>
                  <p>{ title ? title : `I want to` }</p>
              </b>
          </span>
          <span class="icon is-small">
              <i class="sgds-icon sgds-icon-chevron-down is-size-4" aria-hidden="true"></i>
          </span>
        </a>
    </div>
    <div class="bp-dropdown-menu has-text-left" id="hero-dropdown-menu" role="menu">
        <div class="bp-dropdown-content is-centered">
          { options.map(({title, url}, index) => (
            (url && title) ? 
              <HeroDropdownElem key={index} title={title} url={url} /> :
              null
          ))}
        </div>
    </div>
  </div>
)

const KeyHighlightElem = ({title, description, url}) => (
  <>
    {(title || description) ?
      <div class="col">
        <a href={url} class="is-highlight">
          {/* Title */}
          {title ?
            <p class="has-text-weight-semibold has-text-white key-highlight-title is-uppercase padding--top--xs">
              {title}
            </p> 
            :
            null
          }
          {/* Description */}
          {description ? 
            <p class="has-text-white-trans padding--bottom--sm">
              {description}
            </p>
            :
            null
          }
        </a>
      </div>
      : null
    }
  </>
)

const KeyHighlights = ({highlights}) => (
  <section id="key-highlights" class="bp-section is-paddingless">
      <div class="bp-container">
          <div class="row is-gapless has-text-centered">
            {highlights.map(({title, description, url}) => (
              <KeyHighlightElem title={title} description={description} url={url} />
            ))}
          </div>
      </div>
  </section>
)

const TemplateHero = ({ hero, siteName }) => {
  let heroStyle = {
    background: `url(https://raw.githubusercontent.com/isomerpages/${siteName}/staging${hero.background}) no-repeat top left`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  }
  return (
    <>
      {/* Main hero banner */}
      <section class="bp-hero bg-hero" style={heroStyle}>
        <div class="bp-hero-body">
          <div class="bp-container margin--top--lg">
            <div class="row is-vcentered is-centered ma">
              <div class="col is-9 has-text-centered has-text-white">
                <h1 class="display padding--bottom--lg margin--none">
                  <b class="is-hidden-touch">{hero.title}</b>
                  <b class="is-hidden-desktop">{hero.title}</b>
                </h1>
                {/* Hero subtitle */}
                { hero.subtitle ?
                  <p class="is-hidden-mobile padding--bottom--lg">
                    {hero.subtitle}
                  </p>
                  : 
                  null
                }
                {/* Hero dropdown */}
                { hero.dropdown ? 
                  <HeroDropdown dropdown={hero.dropdown}/> :
                  <HeroButton url={hero.url} button={hero.button}/>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Key highlights */}
      { hero.key_highlights ? 
        <KeyHighlights highlights={hero.key_highlights} /> :
        null
      }
    </>
  )
}

export default TemplateHero