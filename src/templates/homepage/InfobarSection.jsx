import React from 'react';

const TemplateInfobarSection = ({title, subtitle, description, url, button, sectionIndex}) => (
  <section class={`bp-section ${(sectionIndex%2 === 1) ? `bg-newssection`: null}`}>
    <div class="bp-container is-fluid">
      <div class="row">
          <div class="col is-half is-offset-one-quarter has-text-centered padding--top--xl">
            {/* Subtitle */}
            {subtitle ?
              <p class="padding--bottom eyebrow is-uppercase">{subtitle}</p>
              :
              null
            }
            {/* Title */}
            {title ?
              <h1 class="has-text-secondary padding--bottom"><b>{title}</b></h1>
              :
              null
            }
            {/* Description */}
            { description ?
              <p>{description}</p>
              :
              null
            }
          </div>
      </div>
    </div>
    {/* Button */}
    {(url && button) ?
      <div class="row has-text-centered margin--top padding--bottom">
        <div class="col is-offset-one-third is-one-third">
            <a href={url} class="bp-sec-button">
                <div>
                    <span>{button}</span>
                    <i class="sgds-icon sgds-icon-arrow-right is-size-4" aria-hidden="true"></i>
                </div>
            </a>
        </div>
      </div>
      :
      null
    }
  </section>
)

export default TemplateInfobarSection