import React from 'react';

const ResourcePost = () => (
    <div class="col">
        <a href="" class="is-media-card">
            <div class="media-card-plain bg-media-color-0 padding--lg">
                <div>
                    <small class="has-text-white padding--bottom">DEMO CATEGORY</small>
                    <h4 class="has-text-white padding--bottom--lg"><b>TITLE</b></h4>
                </div>
                <div class="is-fluid padding--top--md description">
                    <small class="has-text-white">DATE</small>
                </div>
            </div>
        </a>
    </div>
)

const TemplateResourceSection = ({title, subtitle, button}) => (
  <section class="bp-section {{ gray_container_class }}">
      <div class="bp-container">
          <div class="row">
              <div class="col is-half is-offset-one-quarter has-text-centered padding--top--lg">
                {/* Subtitle */}
                {subtitle ?
                  <p class="padding--bottom eyebrow is-uppercase">
                    {subtitle}
                  </p>
                  :
                  null
                }
                {/* Title */}
                {title ?
                  <h1 class="has-text-secondary padding--bottom">
                    <b>
                      {title}
                    </b>
                  </h1>
                  :
                  null
                }
              </div>
          </div>
          <div class="row padding--bottom">
              <ResourcePost />
              <ResourcePost />
              <ResourcePost />
          </div>
          <div class="row has-text-centered margin--top padding--bottom--lg">
              <div class="col is-offset-one-third is-one-third">
                  <a href="{{- site.baseurl -}}/{{- site.resources_name -}}/" class="bp-sec-button">
                      <div>
                          <span>
                            {button ?
                              button
                              :
                              `MORE`
                            }
                          </span>
                          <i class="sgds-icon sgds-icon-arrow-right is-size-4" aria-hidden="true"></i>
                      </div>
                  </a>
              </div>
          </div>
      </div>
  </section>
)

export default TemplateResourceSection