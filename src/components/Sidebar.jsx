import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from '../styles/isomer-cms/pages/Admin.module.scss';

const sidebarPathDict = [
  {
    pathname: 'pages',
    title: 'Pages',
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
    pathname: 'media',
    title: 'Media',
  },
  {
    pathname: 'settings',
    title: 'Settings',
  },
];

const Sidebar = ({ siteName, currPath }) => (
  <div className={styles.adminSidebar}>
    <div className={styles.siteIntro}>
      <div className={styles.siteName}>{siteName}</div>
      <div className={styles.siteDate}>Updated 2 days ago</div>
    </div>
    <div className={styles.sidebarNavigation}>
      <ul>
        {sidebarPathDict.map(({ pathname, title }) => (
          <li className={`/sites/${siteName}/${pathname}` === currPath ? styles.active : null}>
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
