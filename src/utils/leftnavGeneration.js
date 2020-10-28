import React from 'react';
import _ from 'lodash';
import { deslugifyCollectionPage } from '../utils';

export const generateLeftNav = (leftNavPages, fileName) => {
    const currentFileThirdNavTitle = retrieveCurrentFileThirdNavTitle(leftNavPages, fileName)

    // Counters to keep track of accordion state
    let isPartOfThirdNav = false;
    let currentThirdNavTitle = '';
    let thirdNavElements = [];

    const leftNavBar = leftNavPages.map((page) => {
        const { third_nav_title: elementThirdNavTitle, fileName: elementFileName } = page

        // Element is part of third nav
        if (elementThirdNavTitle) {
            // First element of third nav section
            if (!isPartOfThirdNav) {
                isPartOfThirdNav = true;
                currentThirdNavTitle = elementThirdNavTitle;
                thirdNavElements.push(
                <li key={page.fileName}>
                    <a className={`third-level-nav-item padding--top--none ${fileName === elementFileName? 'has-text-secondary has-text-weight-bold': ''}`}>
                    {deslugifyCollectionPage(elementFileName)}
                    </a>
                </li>
                )

                return (
                <li className="third-level-nav-header" key={elementFileName} onClick={accordionHandler}>
                    <a className={`third-level-nav-header ${calculateThirdNavHeaderState(currentFileThirdNavTitle, currentThirdNavTitle, elementThirdNavTitle, fileName, elementFileName)}`}>
                    {currentThirdNavTitle}
                    <i
                        className={`sgds-icon is-pulled-right is-size-4 ${calculateThirdNavHeaderChevronState(currentFileThirdNavTitle, currentThirdNavTitle, elementThirdNavTitle, fileName, elementFileName)}`}
                        aria-hidden="true"
                    ></i>
                    </a>
                </li>
                )

            // Already part of third nav
            } else {
                // Consecutive third nav sections
                if (currentThirdNavTitle !== elementThirdNavTitle) {
                    const prevThirdNavElements = _.cloneDeep(thirdNavElements);

                    // Reset counters to start a new third nav
                    isPartOfThirdNav = false;
                    thirdNavElements = [];

                    thirdNavElements.push(
                        <li key={elementFileName}>
                        <a className={`third-level-nav-item padding--top--none ${fileName === elementFileName? 'has-text-secondary has-text-weight-bold': ''}`}>
                            {deslugifyCollectionPage(elementFileName)}
                        </a>
                        </li>
                    )

                    // Generate third nav elements for third nav right before the current third nav
                    return generateThirdNavDiv(
                        currentFileThirdNavTitle,
                        prevThirdNavElements,
                        currentThirdNavTitle,
                        elementThirdNavTitle,
                        fileName,
                        elementFileName,
                    )
                }

                // Add to third nav array
                thirdNavElements.push(
                <li key={elementFileName}>
                    <a className={`third-level-nav-item padding--top--none ${fileName === elementFileName? 'has-text-secondary has-text-weight-bold': ''}`}>
                    {deslugifyCollectionPage(elementFileName)}
                    </a>
                </li>
                )
                return
            }
        }

        const prevThirdNavElements = _.cloneDeep(thirdNavElements);

        // Reset counters now that we're not in a third nav
        isPartOfThirdNav = false;
        thirdNavElements = [];

        return (
        <>
            {
            // Generate left nav entries for previous third nav section's third nav elements
            generateThirdNavDiv(
                currentFileThirdNavTitle,
                prevThirdNavElements,
                currentThirdNavTitle,
                elementThirdNavTitle,
                fileName,
                elementFileName,
            )
            }
            {/* Current on-third-nav section */}
            <li>
                <a className={`${fileName === elementFileName ? 'is-active': ''}`}>
                    {deslugifyCollectionPage(elementFileName)}
                </a>
            </li>
        </>
        )
    })

    // If final accordion element is a third nav element, they are stuck in the thirdNavElements array
    const finalLeftNavElement = leftNavPages[leftNavPages.length -1]
    if (thirdNavElements.length > 0) leftNavBar.push(
        generateThirdNavDiv(
            currentFileThirdNavTitle,
            thirdNavElements,
            currentThirdNavTitle,
            finalLeftNavElement.third_nav_title,
            fileName,
            finalLeftNavElement.fileName,
        )
    )

    return leftNavBar
}

const retrieveCurrentFileThirdNavTitle = (leftNavPages, fileName) => {
    let currentFileThirdNavTitle = ''
    leftNavPages.forEach((page) => {
        if (fileName == page.fileName) {
        if (page.third_nav_title) currentFileThirdNavTitle = page.third_nav_title
        }
    })
    return currentFileThirdNavTitle
}

const calculateThirdNavHeaderState = (currentFileThirdNavTitle, currentThirdNavTitle, currentElementThirdNavTitle, fileName, elementFileName) => {
    if (currentFileThirdNavTitle !== currentThirdNavTitle) {
      return ''
    } else if (fileName === elementFileName || currentThirdNavTitle === currentElementThirdNavTitle) {
      return 'is-active'
    }
  }
  
const calculateThirdNavHeaderChevronState = (currentFileThirdNavTitle, currentThirdNavTitle, currentElementThirdNavTitle, fileName, elementFileName) => {
    if (currentFileThirdNavTitle !== currentThirdNavTitle) {
        return 'sgds-icon-chevron-down'
    } else if (fileName === elementFileName || currentThirdNavTitle === currentElementThirdNavTitle) {
        return 'sgds-icon-chevron-up'
    }
}

const calculateThirdNavElementState = (currentFileThirdNavTitle, currentThirdNavTitle, currentElementThirdNavTitle, fileName, elementFileName) => {
    if (currentThirdNavTitle === currentElementThirdNavTitle) {
        if (fileName === elementFileName) {
            return ''
        }
}

if (currentFileThirdNavTitle === currentThirdNavTitle) return ''
    return 'is-hidden';
}

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
    const hiddenState = ' is-hidden'
    if (accordionElementClass.includes(hiddenState)) {
        return accordionElementClass.replace(hiddenState, '')
    }
    return accordionElementClass + hiddenState
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

const generateThirdNavDiv = (currentFileThirdNavTitle, thirdNavElements, currentThirdNavTitle, elementThirdNavTitle, fileName, elementFileName) => (
    thirdNavElements.length > 0
        ? (
        <div className={`third-level-nav-div ${calculateThirdNavElementState(currentFileThirdNavTitle, currentThirdNavTitle, elementThirdNavTitle, fileName, elementFileName)}`}>
            {thirdNavElements.map((thirdNav) => thirdNav)}
        </div>
        )
        : ''
)
  