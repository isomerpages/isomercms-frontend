import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const Header = ({ showButton }) => (
  <div className={elementStyles.header}>
    <div className={elementStyles.headerLeft}>
      { !showButton ? null : (
        <a href="/sites">
          <button type="button">
            <i className="bx bx-chevron-left" />
            Back to Sites
          </button>
        </a>
      )}
    </div>
    <div className={elementStyles.headerCenter}>
      <div className={elementStyles.logo}>
        <img src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Isomer CMS logo" />
      </div>
    </div>
    <div className={elementStyles.headerRight}>
      <button type="button" className={elementStyles.blue}>
        Log Out
      </button>
    </div>
  </div>
);

Header.defaultProps = {
  showButton: true,
};

Header.propTypes = {
  showButton: PropTypes.bool,
};

export default Header;
