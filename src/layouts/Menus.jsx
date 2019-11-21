import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const Menus = ({ match, location }) => {
  const { siteName } = match.params;
  return (
    <>
      <Header />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />

        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>Menus</h1>
          </div>
          <div className={contentStyles.contentContainerBars}>
            {/* Page cards */}
            <ul>
              <li>
                <Link to={`/sites/${siteName}/main-menu`}>Main Menu</Link>
              </li>
              <li>
                <Link to={`/sites/${siteName}/footer`}>Footer</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menus;

Menus.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
