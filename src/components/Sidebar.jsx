import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const sidebarPathDict = [
  {
    pathname: 'pages',
    title: 'Pages',
  },
  {
    pathname: 'collections',
    title: 'Collections',
  },
  {
    pathname: 'menus',
    title: 'Menus',
  },
  {
    pathname: 'resources',
    title: 'Resources',
  },
  {
    pathname: 'images',
    title: 'Images',
  },
  {
    pathname: 'files',
    title: 'Files',
  },
  {
    pathname: 'settings',
    title: 'Settings',
  },
];

const Sidebar = ({ siteName, currPath }) => (
  <div className="admin-sidebar">
    <div className="site-intro">
      <div className="site-name">{siteName}</div>
      <div className="site-date">Updated 2 days ago</div>
    </div>
    <div className="sidebar-navigation">
      <ul>
        {sidebarPathDict.map(({ pathname, title }) => (
          <li className={`/sites/${siteName}/${pathname}` === currPath ? 'active' : null}>
            <Link to={`/sites/${siteName}/${pathname}`}>{title}</Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default Sidebar;

Sidebar.propTypes = {
  siteName: PropTypes.string.isRequired,
  currPath: PropTypes.string.isRequired,
};
