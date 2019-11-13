import React from 'react';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const Header = () => (
  <div className={elementStyles.header}>
    <div className={elementStyles.headerLeft}>
      <a href="/sites">
        <button type="button">
          <i className="bx bx-chevron-left" />
Back to Sites
        </button>
      </a>
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

export default Header;
