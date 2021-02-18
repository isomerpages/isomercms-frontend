import React from 'react';

const TemplateNavBar = ({ links, collectionInfo, resources }) => (
  <nav className="navbar is-transparent flex-fill">
    <div className="bp-container">
      <div id="navbarExampleTransparentExample" className="bp-container is-fluid margin--none navbar-menu h-100">
        <div className="navbar-start">
          {
            links.map((link) => {
              if (link.collection) {
                return (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link is-uppercase" href="/" onClick={(event) => event.preventDefault()}>
                      { link.title }
                    </a>
                    <div className="navbar-dropdown">
                      {collectionInfo && collectionInfo[link.collection].map((collection) => (
                        <a className="navbar-item sub-link" href="/" onClick={(event) => event.preventDefault()}>
                          { collection }
                        </a>
                      ))}
                    </div>
                  </div>
                );
              }
              if (link.resource_room) {
                return (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link is-uppercase" href="/" onClick={(event) => event.preventDefault()}>
                      { link.title }
                    </a>
                    <div className="navbar-dropdown">
                      {resources && resources.map((resource) => (
                        <a className="navbar-item sub-link" href="/" onClick={(event) => event.preventDefault()}>
                          { resource }
                        </a>
                      ))}
                    </div>
                  </div>
                )
              }
              if (link.sublinks) {
                return (
                  <div className="navbar-item has-dropdown is-hoverable">
                    <a className="navbar-link is-uppercase" href="/" onClick={(event) => event.preventDefault()}>
                      { link.title }
                    </a>
                    <div className="navbar-dropdown">
                      {link.sublinks && link.sublinks.map((sublink) => (
                        <a className="navbar-item sub-link" href="/" onClick={(event) => event.preventDefault()}>
                          { sublink.title }
                        </a>
                      ))}
                    </div>
                  </div>
                )
              }
              if (link.url) {
                return (
                  <li className="navbar-item">
                    <a className="navbar-item is-uppercase" href="/" onClick={(event) => event.preventDefault()}>
                      { link.title }
                    </a>
                  </li>
                );
              }
              return (
                <p>
                  Unaccounted for
                </p>
              );
            })
          }
        </div>
      </div>
    </div>
  </nav>
);

export default TemplateNavBar;
