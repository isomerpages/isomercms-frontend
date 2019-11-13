import React from 'react';

const Header = () => (
  <div className="header">
    <div className="header-left">
      <a href="/sites">
        <button type="button">
          <i className="bx bx-chevron-left" />
Back to Sites
        </button>
      </a>
    </div>
    <div className="header-center">
      <div className="logo">
        <img src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Isomer CMS logo" />
      </div>
    </div>
    <div className="header-right">
      <button type="button" className="blue">
        Log Out
      </button>
    </div>
  </div>
);

export default Header;
