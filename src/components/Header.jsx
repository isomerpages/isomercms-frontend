import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const Header = ({
  showButton, title, backButtonText, backButtonUrl,
}) => (
  <div className={elementStyles.header}>
    {/* Back button section */}
    <div className={elementStyles.headerLeft}>
      { !showButton ? null : (
        <a href={backButtonUrl}>
          <button type="button">
            <i className="bx bx-chevron-left" />
            {backButtonText}
          </button>
        </a>
      )}
    </div>
    {/* Middle section */}
    <div className={elementStyles.headerCenter}>
      { title
        ? <h1>{title}</h1>
        : (
          <div className={elementStyles.logo}>
            <img src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Isomer CMS logo" />
          </div>
        )}
    </div>
    {/* Right section */}
    <div className={elementStyles.headerRight}>
      <button type="button" className={elementStyles.blue}>
        Log Out
      </button>
    </div>
  </div>
);

Header.defaultProps = {
  showButton: true,
  title: undefined,
  backButtonText: 'Back to Sites',
  backButtonUrl: '/sites',
};

Header.propTypes = {
  showButton: PropTypes.bool,
  title: PropTypes.string,
  backButtonText: PropTypes.string,
  backButtonUrl: PropTypes.string,
};

export default Header;
