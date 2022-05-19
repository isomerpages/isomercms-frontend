import PropTypes from "prop-types"

const NavDropdownSection = ({ children, link }) => (
  <div className="navbar-item has-dropdown is-hoverable">
    <a
      className="navbar-link is-uppercase"
      href="/"
      onClick={(event) => event.preventDefault()}
    >
      {link.title}
    </a>
    <div className="navbar-dropdown">{children}</div>
  </div>
)

const TemplateNavBar = ({ links, collectionInfo, resources }) => (
  <nav className="navbar is-transparent flex-fill">
    <div className="bp-container">
      <div className="bp-container is-fluid margin--none navbar-menu h-100">
        <div className="navbar-start">
          {links.map((link, linkIndex) => {
            if (link.collection) {
              return (
                <NavDropdownSection link={link} linkIndex={linkIndex}>
                  {collectionInfo &&
                    collectionInfo[link.collection].map((collection) => (
                      <a
                        className="navbar-item sub-link"
                        href="/"
                        onClick={(event) => event.preventDefault()}
                      >
                        {collection}
                      </a>
                    ))}
                </NavDropdownSection>
              )
            }
            if (link.resource_room) {
              return (
                <NavDropdownSection link={link} linkIndex={linkIndex}>
                  {resources &&
                    resources.map((resource) => (
                      <a
                        className="navbar-item sub-link"
                        href="/"
                        onClick={(event) => event.preventDefault()}
                      >
                        {resource}
                      </a>
                    ))}
                </NavDropdownSection>
              )
            }
            if (link.sublinks) {
              return (
                <NavDropdownSection link={link} linkIndex={linkIndex}>
                  {link.sublinks &&
                    link.sublinks.map((sublink) => (
                      <a
                        className="navbar-item sub-link"
                        href="/"
                        onClick={(event) => event.preventDefault()}
                      >
                        {sublink.title}
                      </a>
                    ))}
                </NavDropdownSection>
              )
            }
            // Single Page
            return (
              <li className="navbar-item">
                <a
                  className="navbar-item is-uppercase"
                  href="/"
                  onClick={(event) => event.preventDefault()}
                >
                  {link.title}
                </a>
              </li>
            )
          })}
        </div>
      </div>
    </div>
  </nav>
)

export default TemplateNavBar

NavDropdownSection.propTypes = {
  link: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
    collection: PropTypes.string,
    resource_room: PropTypes.bool,
    sublinks: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }).isRequired,
}

TemplateNavBar.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      collection: PropTypes.string,
      resource_room: PropTypes.bool,
      sublinks: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          url: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  collectionInfo: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  resources: PropTypes.arrayOf(PropTypes.string),
}
