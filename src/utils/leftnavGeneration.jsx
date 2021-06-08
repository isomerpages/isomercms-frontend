import React from "react"

import _ from "lodash"

import { deslugifyDirectory,deslugifyPage } from "@src/utils"

const retrieveCurrentFileThirdNavTitle = (leftNavPages, fileName) => {
  let currentFileThirdNavTitle = ""
  leftNavPages.forEach((page) => {
    if (fileName === page.fileName) {
      if (page.third_nav_title) currentFileThirdNavTitle = page.third_nav_title
    }
  })
  return currentFileThirdNavTitle
}

const calculateThirdNavHeaderState = (
  currentFileThirdNavTitle,
  currentThirdNavTitle,
  currentElementThirdNavTitle,
  fileName,
  elementFileName
) => {
  if (currentFileThirdNavTitle !== currentThirdNavTitle) {
    return ""
    // The second condition is for elements in the same third nav as the current file
  }
  if (
    fileName === elementFileName ||
    currentThirdNavTitle === currentElementThirdNavTitle
  ) {
    return "is-active"
  }
  return undefined
}

const calculateThirdNavHeaderChevronState = (
  currentFileThirdNavTitle,
  currentThirdNavTitle,
  currentElementThirdNavTitle,
  fileName,
  elementFileName
) => {
  if (currentFileThirdNavTitle !== currentThirdNavTitle) {
    return "sgds-icon-chevron-down"
  }
  if (
    fileName === elementFileName ||
    currentThirdNavTitle === currentElementThirdNavTitle
  ) {
    return "sgds-icon-chevron-up"
  }
  return undefined
}

const calculateThirdNavElementState = (
  currentFileThirdNavTitle,
  currentThirdNavTitle,
  currentElementThirdNavTitle,
  fileName,
  elementFileName
) => {
  if (currentThirdNavTitle === currentElementThirdNavTitle) {
    if (fileName === elementFileName) {
      return ""
    }
  }
  if (currentFileThirdNavTitle === currentThirdNavTitle) return ""
  return "is-hidden"
}

const accordionIconToggle = (accordionIconClass) => {
  const upChevronIconClassName = "sgds-icon-chevron-up"
  const downChevronIconClassName = "sgds-icon-chevron-down"

  if (accordionIconClass.includes(upChevronIconClassName)) {
    return accordionIconClass.replace(
      upChevronIconClassName,
      downChevronIconClassName
    )
  }
  if (accordionIconClass.includes(downChevronIconClassName)) {
    return accordionIconClass.replace(
      downChevronIconClassName,
      upChevronIconClassName
    )
  }
  return undefined
}

const accordionElementToggle = (accordionElementClass) => {
  const hiddenState = " is-hidden"
  if (accordionElementClass.includes(hiddenState)) {
    return accordionElementClass.replace(hiddenState, "")
  }
  return accordionElementClass + hiddenState
}

const accordionHandler = (e) => {
  let accordionElement
  if (e.target.className.includes("third-level-nav-header")) {
    accordionElement = e.target.parentElement

    // There are only two levels, the child element, third-level-nav-header, or the grandchild,
    // the accordion icon
  } else {
    accordionElement = e.target.parentElement.parentElement
  }

  // Hierarchy is li > a > i
  const accordionIcon = accordionElement.children[0].children[0]
  accordionIcon.className = accordionIconToggle(accordionIcon.className)

  accordionElement.nextSibling.className = accordionElementToggle(
    accordionElement.nextSibling.className
  )
}

const generateThirdNavDiv = (
  currentFileThirdNavTitle,
  thirdNavElements,
  currentThirdNavTitle,
  elementThirdNavTitle,
  fileName,
  elementFileName
) => thirdNavElements.length > 0 ? (
    <div
      key={`${currentThirdNavTitle}-div`}
      className={`third-level-nav-div ${calculateThirdNavElementState(
        currentFileThirdNavTitle,
        currentThirdNavTitle,
        elementThirdNavTitle,
        fileName,
        elementFileName
      )}`}
    >
      {thirdNavElements.map((thirdNav) => thirdNav)}
    </div>
  ) : (
    ""
  )

const generateThirdNavHeader = (
  currentFileThirdNavTitle,
  currentThirdNavTitle,
  elementThirdNavTitle,
  fileName,
  elementFileName
) => (
  <li
    className="third-level-nav-header"
    key={`${currentThirdNavTitle}-header`}
    onClick={accordionHandler}
  >
    <a
      className={`third-level-nav-header ${calculateThirdNavHeaderState(
        currentFileThirdNavTitle,
        currentThirdNavTitle,
        elementThirdNavTitle,
        fileName,
        elementFileName
      )}`}
    >
      {deslugifyDirectory(currentThirdNavTitle)}
      <i
        className={`sgds-icon is-pulled-right is-size-4 ${calculateThirdNavHeaderChevronState(
          currentFileThirdNavTitle,
          currentThirdNavTitle,
          elementThirdNavTitle,
          fileName,
          elementFileName
        )}`}
        aria-hidden="true"
      />
    </a>
  </li>
)

export const generateLeftNav = (leftNavPages, fileName) => {
  const currentFileThirdNavTitle = retrieveCurrentFileThirdNavTitle(
    leftNavPages,
    fileName
  )

  // Store accordion elements
  const accordionElements = []

  // Counters to keep track of accordion state
  let isPartOfThirdNav = false
  let currentThirdNavTitle = ""
  let thirdNavElements = []

  leftNavPages.forEach((page) => {
    const {
      third_nav_title: elementThirdNavTitle,
      fileName: elementFileName,
    } = page

    // Element is part of third nav
    if (elementThirdNavTitle) {
      // First element of third nav section
      if (!isPartOfThirdNav) {
        isPartOfThirdNav = true
        currentThirdNavTitle = elementThirdNavTitle
        accordionElements.push(
          generateThirdNavHeader(
            currentFileThirdNavTitle,
            currentThirdNavTitle,
            elementThirdNavTitle,
            fileName,
            elementFileName
          )
        )
        thirdNavElements.push(
          <li key={elementFileName}>
            <a
              className={`third-level-nav-item padding--top--none ${
                fileName === elementFileName
                  ? "has-text-secondary has-text-weight-bold"
                  : ""
              }`}
            >
              {deslugifyPage(elementFileName)}
            </a>
          </li>
        )
        return
        // Already part of third nav
      }
      // Consecutive third nav sections
      if (currentThirdNavTitle !== elementThirdNavTitle) {
        const prevThirdNavTitle = currentThirdNavTitle
        const prevThirdNavElements = _.cloneDeep(thirdNavElements)
        currentThirdNavTitle = elementThirdNavTitle

        // Generate third nav elements for third nav right before the current third nav
        accordionElements.push(
          generateThirdNavDiv(
            currentFileThirdNavTitle,
            prevThirdNavElements,
            prevThirdNavTitle,
            elementThirdNavTitle,
            fileName,
            elementFileName
          ),
          generateThirdNavHeader(
            currentFileThirdNavTitle,
            currentThirdNavTitle,
            elementThirdNavTitle,
            fileName,
            elementFileName
          )
        )

        // Reset accumulation of third nav elements to start a new third nav
        thirdNavElements = []
        thirdNavElements.push(
          <li key={elementFileName}>
            <a
              className={`third-level-nav-item padding--top--none ${
                fileName === elementFileName
                  ? "has-text-secondary has-text-weight-bold"
                  : ""
              }`}
            >
              {deslugifyPage(elementFileName)}
            </a>
          </li>
        )
        return
      }

      // Add to third nav array
      thirdNavElements.push(
        <li key={elementFileName}>
          <a
            className={`third-level-nav-item padding--top--none ${
              fileName === elementFileName
                ? "has-text-secondary has-text-weight-bold"
                : ""
            }`}
          >
            {deslugifyPage(elementFileName)}
          </a>
        </li>
      )
      return
    }

    const prevThirdNavElements = _.cloneDeep(thirdNavElements)

    // Reset counters now that we're not in a third nav
    isPartOfThirdNav = false
    thirdNavElements = []

    accordionElements.push(
      <>
        {
          // Generate left nav entries for previous third nav section's third nav elements
          generateThirdNavDiv(
            currentFileThirdNavTitle,
            prevThirdNavElements,
            currentThirdNavTitle,
            elementThirdNavTitle,
            fileName,
            elementFileName
          )
        }
        {/* Current on-third-nav section */}
        <li key={elementFileName}>
          <a className={`${fileName === elementFileName ? "is-active" : ""}`}>
            {deslugifyPage(elementFileName)}
          </a>
        </li>
      </>
    )
  })

  // If final accordion element is a third nav element, they are stuck in the thirdNavElements array
  const finalLeftNavElement = leftNavPages[leftNavPages.length - 1]
  if (thirdNavElements.length > 0)
    accordionElements.push(
      generateThirdNavDiv(
        currentFileThirdNavTitle,
        thirdNavElements,
        currentThirdNavTitle,
        finalLeftNavElement.third_nav_title,
        fileName,
        finalLeftNavElement.fileName
      )
    )

  return accordionElements
}
