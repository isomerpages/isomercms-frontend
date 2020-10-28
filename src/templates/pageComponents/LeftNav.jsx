/* eslint-disable arrow-body-style */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { deslugifyCollectionPage } from '../../utils';
import '../../styles/isomer-template.scss';

const accordionIconToggle = (accordionIconClass) => {
  const upChevronIconClassName = 'sgds-icon-chevron-up'
  const downChevronIconClassName = 'sgds-icon-chevron-down'

  if (accordionIconClass.includes(upChevronIconClassName)) {
    return accordionIconClass.replace(upChevronIconClassName, downChevronIconClassName)
  }
  if (accordionIconClass.includes(downChevronIconClassName)) {
    return accordionIconClass.replace(downChevronIconClassName, upChevronIconClassName)
  }
}

const accordionElementToggle = (accordionElementClass) => {
  if (accordionElementClass.includes(' is-hidden')) {
    return accordionElementClass.replace(' is-hidden', '')
  }
  return accordionElementClass + ' is-hidden'
}

const accordionHandler = (e) => {
  let accordionElement
  if (e.target.className.includes('third-level-nav-header')) {
    accordionElement = e.target.parentElement

  // There are only two levels, the child element, third-level-nav-header, or the grandchild,
  // the accordion icon
  } else {
    accordionElement = e.target.parentElement.parentElement
  }

  // Hierarchy is li > a > i
  const accordionIcon = accordionElement.children[0].children[0]
  accordionIcon.className = accordionIconToggle(accordionIcon.className)

  accordionElement.nextSibling.className = accordionElementToggle(accordionElement.nextSibling.className)
}

const generateThirdNavDiv = (thirdNavElements) => (
  thirdNavElements.length > 0
    ? (
      <div className="third-level-nav-div">
        {thirdNavElements.map((thirdNav) => thirdNav)}
      </div>
    )
    : ''
)

const generateLeftNav = (leftNavPages) => {
  let isPartOfThirdNav = false;
  let thirdNavElements = [];
  const leftNavBar = leftNavPages.map((page) => {
    if (page.third_nav_title) {
      // Begin third nav section
      if (!isPartOfThirdNav) {
        isPartOfThirdNav = true

        // Add to third nav array
        thirdNavElements.push(
          <li key={page.fileName}>
            <a className="third-level-nav-item padding--top--none ">
              {deslugifyCollectionPage(page.fileName)}
            </a>
          </li>
        )
        return (
          <li className="third-level-nav-header" key={page.fileName} onClick={accordionHandler}>
            <a className="third-level-nav-header">
              {page.third_nav_title}
              <i className="sgds-icon is-pulled-right is-size-4 sgds-icon-chevron-up" aria-hidden="true"></i>
            </a>
          </li>
        )
      } else {
        // Add to third nav array
        thirdNavElements.push(
          <li key={page.fileName}>
            <a className="third-level-nav-item padding--top--none ">
              {deslugifyCollectionPage(page.fileName)}
            </a>
          </li>
        )
        return
      }
    }

    // Generate left nav entries for remaining third nav elements
    const prevThirdNavElements = _.cloneDeep(thirdNavElements);
    isPartOfThirdNav = false;
    thirdNavElements = [];
    return (
      <>
        {
          generateThirdNavDiv(prevThirdNavElements)
        }
        <li>
          <a>
            {deslugifyCollectionPage(page.fileName)}
          </a>
        </li>
      </>
    )
  })

  if (thirdNavElements.length > 0) leftNavBar.push(generateThirdNavDiv(thirdNavElements))
  return leftNavBar
}

const LeftNav = ({ leftNavPages, fileName }) => (
  <div className="col is-2 is-position-relative has-side-nav is-hidden-touch">
    <div className="sidenav">
      <aside className="bp-menu is-gt sidebar__inner">
        <ul className="bp-menu-list">
          {
            generateLeftNav(leftNavPages)
          }
        </ul>
        <div
          dir="ltr"
          className="resize resize-sensor"
        >
          <div
            className="resize resize-sensor-expand"
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
            className="resize resize-sensor-shrink"
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
      className="resize resize-sensor"
    >
      <div
        className="resize resize-sensor-expand"
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
        className="resize resize-sensor-shrink"
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
  leftNavPages: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    fileName: PropTypes.string,
  })).isRequired,
  fileName: PropTypes.string.isRequired,
};

export default LeftNav;
