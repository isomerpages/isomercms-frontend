import React, { Component } from 'react';

const NavPreview = ({ navItems }) => (
  <nav className="navbar is-transparent flex-fill">
    <div className="bp-container">
      <div className="navbar-brand">
        {/* <a className="navbar-item" href="/">
          {/* <img src="{{- site.data.navigation.logo -}}" alt="Homepage" style="max-height:75px;max-width:200px;height:auto;width:auto;" />
        </a>

        <div className="navbar-burger burger" data-target="navbarExampleTransparentExample">
          <span />
          <span />
          <span />
        </div> */}
      </div>
      <div id="navbarExampleTransparentExample" className="bp-container is-fluid margin--none navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item is-hidden-widescreen is-search-bar">
            <form action="/search/" method="get">
              <div className="field has-addons">
                <div className="control has-icons-left is-expanded">
                  <input className="input is-fullwidth" id="search-box-mobile" type="text" placeholder="What are you looking for?" name="query" />
                  <span className="is-large is-left">
                    <i className="sgds-icon sgds-icon-search search-bar" />
                  </span>
                </div>
              </div>
            </form>
          </div>
          {
                navItems.map((navItem) => {
                  switch (navItem.type) {
                    case 'collection':
                      return (
                        <div className="navbar-item has-dropdown is-hoverable">
                          <a className="navbar-link is-uppercase" href="/">
                            { navItem.title }
                          </a>
                          <div className="navbar-dropdown">
                            {navItem.leftNavPages && navItem.leftNavPages.map((leftNavPage) => (
                              <a className="navbar-item sub-link" href="/">
                                { leftNavPage.title }
                              </a>
                            ))}
                          </div>
                        </div>
                      );
                    case 'page':
                    case 'resource room':
                    case 'collection-page':
                    case 'thirdnav-page':
                      return (
                        <li className="navbar-item">
                          <a className="navbar-item is-uppercase" href="/">
                            { navItem.title }
                          </a>
                        </li>
                      );
                    default:
                      return (
                        <p>
                          Unaccounted for
                          {' '}
                          {navItem.type}
                        </p>
                      );
                  }
                })
              }
          {/* {%- assign navitems = site.data.navigation.links -%}
              {%- for navitem in navitems -%}
                  {%- if navitem.collection -%}
                      {%- comment -%} Leftnav page {%- endcomment -%}

                      {%- assign active = "" -%}

                      <div class="navbar-item has-dropdown is-hoverable">
                          <a class="navbar-link is-uppercase" href="{{site[navitem.collection].first.url}}">
                              {{- navitem.title -}}
                          </a>
                          <div class="navbar-dropdown">
                              {%- comment -%} You can't initalize an array in liquid so we have to do this {%- endcomment -%}
                              {% assign third_nav_titles = "" | split: ", " %}
                              {%- for leftnavpage in site[navitem.collection] -%}
                                  {%- if page.url == leftnavpage.url -%}
                                      {%- assign active = " active" -%}
                                  {%- endif -%}
                                  {%- comment -%} Only show second level pages and the first page in third level pages {%- endcomment -%}
                                  {%- if leftnavpage.third_nav_title -%}
                                      {%- unless third_nav_titles contains leftnavpage.third_nav_title -%}
                                          {%- comment -%} This is the first page in this third level nav, display link {%- endcomment -%}
                                          <a class="navbar-item sub-link" href="{{leftnavpage.url}}">
                                              {{- leftnavpage.third_nav_title -}}
                                          </a>
                                          {%- assign third_nav_titles = third_nav_titles | push: leftnavpage.third_nav_title -%}
                                      {%- endunless -%}
                                  {%- else -%}
                                      <a class="navbar-item sub-link" href="{{leftnavpage.url}}">
                                          {{- leftnavpage.title -}}
                                      </a>
                                  {%- endif -%}
                              {%- endfor -%}
                          </div>
                          <div class="selector is-hidden-touch is-hidden-desktop-only{{active}}"></div>
                      </div>
                  {%- elsif navitem.sublinks -%}
                      {%- comment -%} Leftnav page with custom sublinks {%- endcomment -%}
                      {%- assign active = "" -%}
                      <div class="navbar-item has-dropdown is-hoverable">
                          {%- assign url_input = navitem.url -%}
                          {%- include functions/external_url.html -%}
                          <a {{anchor}} class="navbar-link is-uppercase">
                              {{- navitem.title -}}
                          </a>

                          {%- if page.url == navitem.url -%}
                              {%- assign active = " active" -%}
                          {%- endif -%}

                          <div class="navbar-dropdown">
                              {%- for sublink in navitem.sublinks -%}
                                  {%- assign url_input = sublink.url -%}
                                  {%- include functions/external_url.html -%}
                                  <a {{anchor}} class="navbar-item sub-link">
                                      {{- sublink.title -}}
                                  </a>

                                  {%- if page.url == navitem.url -%}
                                      {%- assign active = " active" -%}
                                  {%- endif -%}
                              {%- endfor -%}
                          </div>
                          <div class="selector is-hidden-touch is-hidden-desktop-only{{active}}"></div>
                      </div>
                  {%- elsif navitem.resource_room -%}
                      {%- assign active = "" -%}
                      {%- if page.collection == "posts" or page.layout == "resources" or page.layout == "resources-alt" -%}
                          {%- assign active = " active" -%}
                      {%- endif -%}
                      <div class="navbar-item has-dropdown is-hoverable">
                          <a class="navbar-link is-uppercase" href="/{{site.resources_name}}/">
                              {{- navitem.title -}}
                          </a>
                          <div class="navbar-dropdown">
                              {%- unless site.categories.size < 3 -%}
                                  {%- comment -%}
                                      No point displaying the 'all' entry if there is only 1 category
                                      The numbers are all incremented by 1 as the resource room folder itself is counted as 1 category
                                  {%- endcomment -%}
                                  <a class="navbar-item sub-link" href="/{{site.resources_name}}/">
                                      All
                                  </a>
                              {%- endunless -%}
                              {%- comment -%} Sort resource rooms category alphabetically by name {%- endcomment -%}
                              {%- assign categories = "" | split: "," -%}
                              {%- for category in site.categories -%}
                                  {%- if category[0] != site.resources_name -%}
                                      {%- assign categories = categories | push: category[0] -%}
                                  {%- endif -%}
                              {%- endfor -%}
                              {%- assign categories = categories | sort_natural -%}
                              {%- comment -%} Display navlink for each category {%- endcomment -%}
                              {%- for category in categories -%}
                                  <a class="navbar-item sub-link" href="/{{site.resources_name}}/{{category}}/">
                                      {%- assign words = category | replace: "-", " " | replace: "_", " " | split: " " -%}
                                      {%- comment -%} Right now words are all in lowercase, and we want to Title Case them {%- endcomment -%}
                                      {%- for word in words -%}
                                          {{- word | capitalize | append: " " -}}
                                      {%- endfor -%}
                                  </a>
                              {%- endfor -%}
                          </div>
                          <div class="selector is-hidden-touch is-hidden-desktop-only{{active}}"></div>
                      </div>
                  {%- else -%}
                      {%- comment -%} Single page {%- endcomment -%}
                      <li class="navbar-item">
                          {%- assign url_input = navitem.url -%}
                          {%- include functions/external_url.html -%}
                          <a {{anchor}} class="navbar-item is-uppercase" style="height:100%;width:100%;">
                              {{- navitem.title -}}
                          </a>

                          {%- assign active = "" -%}
                          {%- if page.url == navitem.url -%}
                              {%- assign active = " active" -%}
                          {%- endif -%}

                          <div class="selector is-hidden-touch is-hidden-desktop-only{{active}}"></div>
                      </li>
                  {%- endif -%}
              {%- endfor -%}
          </div>

          <div class="navbar-end is-hidden-touch is-hidden-desktop-only">
              <div class="navbar-item">
                  {%- if page.layout != 'search' -%}
                      <a class="bp-button is-text is-large" style="text-decoration: none" id="search-activate">
                          <span class="sgds-icon sgds-icon-search is-size-4"></span>
                      </a>
                  {%- else -%}
                      <a class="bp-button is-text is-large" style="text-decoration: none; pointer-events: none;" id="search-activate" disabled></a>
                  {%- endif -%} */}
        </div>
      </div>
    </div>
  </nav>
);

export default NavPreview;
