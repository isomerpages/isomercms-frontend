/* eslint-disable arrow-body-style */
import React from 'react';
import PropTypes from 'prop-types';
import { deslugifyCollectionPage } from '../../utils';
import '../../styles/isomer-template.scss';

// to-do
// generate the bp-menu-list dynamically
// detect which one is the active bar

const resizeStyle = {
  'pointer-events': 'none',
  position: 'absolute',
  left: '0px',
  top: '0px',
  right: '0px',
  bottom: '0px',
  overflow: 'hidden',
  'z-index': '-1',
  visibility: 'hidden',
  'max-width': '100%',
};

const LeftNav = ({ leftNavpages, fileName }) => (
  <div className="col is-2 is-position-relative has-side-nav is-hidden-touch">
    <div className="sidenav">
      <aside className="bp-menu is-gt sidebar__inner" style={{ position: 'relative' }}>
        <ul className="bp-menu-list">
          {
            leftNavpages.map((page) => {
              const filePath = page.path.split('%2').join('/').slice(1);
              return (
                <li>
                  {
                    page.fileName === fileName ?
                      <a className="is-active" href={filePath}>{deslugifyCollectionPage(page.fileName)}</a> :
                      <a className="" href={filePath}>{deslugifyCollectionPage(page.fileName)}</a>
                  }
                </li>
              );
            })
          }
        </ul>
        <div
          dir="ltr"
          className="resize-sensor"
          style={resizeStyle}
        >
          <div
            className="resize-sensor-expand"
            style={resizeStyle}
          >
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                transition: 'all 0s ease 0s',
                width: '174px',
                height: '126px',
              }}
            />
          </div>
          <div
            className="resize-sensor-shrink"
            style={resizeStyle}
          >
            <div
              style={{
                position: 'absolute',
                left: '0px',
                top: '0px',
                transition: '0s',
                width: '200%',
                height: '200%',
              }}
            />
          </div>
        </div>
      </aside>
    </div>
    <div
      dir="ltr"
      className="resize-sensor"
      style={resizeStyle}
    >
      <div
        className="resize-sensor-expand"
        style={resizeStyle}
      >
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            transition: 'all 0s ease 0s',
            width: '198px',
            height: '306px',
          }}
        />
      </div>
      <div
        className="resize-sensor-shrink"
        style={resizeStyle}
      >
        <div
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            transition: '0s',
            width: '200%',
            height: '200%',
          }}
        />
      </div>
    </div>
  </div>
);

LeftNav.propTypes = {
  leftNavpages: PropTypes.shape({
    path: PropTypes.string,
    fileName: PropTypes.string,
  }).isRequired,
  fileName: PropTypes.string.isRequired,
};

export default LeftNav;
