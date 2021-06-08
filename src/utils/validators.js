import _ from "lodash"
import {
  generatePageFileName,
  retrieveResourceFileMetadata,
  slugifyCategory,
} from "@src/utils"

// Common regexes and constants
// ==============
const PERMALINK_REGEX = "^((/([a-z0-9]+-)*[a-z0-9]+)+)/?$"
const URL_REGEX_PART_1 = "^(https://)?(www.)?("
const URL_REGEX_PART_2 = ".com/)([a-zA-Z0-9_-]+([/.])?)+$"
const PHONE_REGEX = "^\\+65(6|8|9)[0-9]{7}$"
const EMAIL_REGEX =
  '^(([^<>()\\[\\]\\.,;:\\s@\\"]+(\\.[^<>()\\[\\]\\.,;:\\s@\\"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z-0-9]+\\.)+[a-zA-Z]{2,}))$'
const DATE_REGEX = "^([0-9]{4}-[0-9]{2}-[0-9]{2})$"
const ALPHABETS_ONLY_REGEX = '^[a-zA-Z" "\\._-]+$'
const ALPHANUMERICS_ONLY_REGEX = '^[a-zA-Z0-9" "\\._-]+$'

const permalinkRegexTest = RegExp(PERMALINK_REGEX)
const phoneRegexTest = RegExp(PHONE_REGEX)
const emailRegexTest = RegExp(EMAIL_REGEX)
const dateRegexTest = RegExp(DATE_REGEX)
const alphabetsRegexTest = RegExp(ALPHABETS_ONLY_REGEX)
const alphanumericRegexTest = RegExp(ALPHANUMERICS_ONLY_REGEX)
const fileNameRegexTest = /^[a-zA-Z0-9" "_-]+$/
const fileNameExtensionRegexTest = /^[a-zA-z]{3,4}$/
const RESOURCE_CATEGORY_REGEX = "^([a-zA-Z0-9]*[- ]?)+$"
const resourceRoomNameRegexTest = /^([a-zA-Z0-9]+-)*[a-zA-Z0-9]+$/
const resourceCategoryRegexTest = RegExp(RESOURCE_CATEGORY_REGEX)

const ISOMER_TEMPLATE_PROTECTED_DIRS = [
  "data",
  "includes",
  "site",
  "layouts",
  "files",
  "images",
  "misc",
  "pages",
]

const RADIX_PARSE_INT = 10

// Homepage Editor
// ===============
// Highlights
const HIGHLIGHTS_TITLE_MIN_LENGTH = 0
const HIGHLIGHTS_TITLE_MAX_LENGTH = 30
const HIGHLIGHTS_DESCRIPTION_MIN_LENGTH = 0
const HIGHLIGHTS_DESCRIPTION_MAX_LENGTH = 30
// Dropdown Elems
const DROPDOWNELEM_TITLE_MIN_LENGTH = 0
const DROPDOWNELEM_TITLE_MAX_LENGTH = 30
// Resources
const RESOURCES_TITLE_MIN_LENGTH = 0
const RESOURCES_TITLE_MAX_LENGTH = 30
const RESOURCES_SUBTITLE_MIN_LENGTH = 0
const RESOURCES_SUBTITLE_MAX_LENGTH = 30
const RESOURCES_BUTTON_TEXT_MIN_LENGTH = 0
const RESOURCES_BUTTON_TEXT_MAX_LENGTH = 30
// Infobar
const INFOBAR_TITLE_MIN_LENGTH = 0
const INFOBAR_TITLE_MAX_LENGTH = 30
const INFOBAR_SUBTITLE_MIN_LENGTH = 0
const INFOBAR_SUBTITLE_MAX_LENGTH = 30
const INFOBAR_BUTTON_TEXT_MIN_LENGTH = 0
const INFOBAR_BUTTON_TEXT_MAX_LENGTH = 30
const INFOBAR_DESCRIPTION_MIN_LENGTH = 0
const INFOBAR_DESCRIPTION_MAX_LENGTH = 160
// Infopic
const INFOPIC_TITLE_MIN_LENGTH = 0
const INFOPIC_TITLE_MAX_LENGTH = 30
const INFOPIC_SUBTITLE_MIN_LENGTH = 0
const INFOPIC_SUBTITLE_MAX_LENGTH = 30
const INFOPIC_BUTTON_TEXT_MIN_LENGTH = 0
const INFOPIC_BUTTON_TEXT_MAX_LENGTH = 30
const INFOPIC_DESCRIPTION_MIN_LENGTH = 0
const INFOPIC_DESCRIPTION_MAX_LENGTH = 160
const INFOPIC_ALT_TEXT_MIN_LENGTH = 0
const INFOPIC_ALT_TEXT_MAX_LENGTH = 30
// Hero
const HERO_TITLE_MIN_LENGTH = 0
const HERO_TITLE_MAX_LENGTH = 30
const HERO_SUBTITLE_MIN_LENGTH = 0
const HERO_SUBTITLE_MAX_LENGTH = 160
// const HERO_BUTTON_TEXT_MIN_LENGTH = 2;
// const HERO_BUTTON_TEXT_MAX_LENGTH = 30;
const HERO_DROPDOWN_MIN_LENGTH = 0
const HERO_DROPDOWN_MAX_LENGTH = 30

// Contact Us Editor
// ===============
// Contacts
const CONTACT_TITLE_MIN_LENGTH = 1
const CONTACT_TITLE_MAX_LENGTH = 30
const CONTACT_DESCRIPTION_MAX_LENGTH = 400

// Locations
const LOCATION_TITLE_MIN_LENGTH = 1
const LOCATION_TITLE_MAX_LENGTH = 30
const LOCATION_ADDRESS_MIN_LENGTH = 2
const LOCATION_ADDRESS_MAX_LENGTH = 30
const LOCATION_OPERATING_DAYS_MIN_LENGTH = 2
const LOCATION_OPERATING_DAYS_MAX_LENGTH = 30
const LOCATION_OPERATING_HOURS_MIN_LENGTH = 2
const LOCATION_OPERATING_HOURS_MAX_LENGTH = 30
const LOCATION_OPERATING_DESCRIPTION_MAX_LENGTH = 100

// Nav Bar Editor
// ===============
const LINK_TITLE_MIN_LENGTH = 1
const LINK_TITLE_MAX_LENGTH = 30
const LINK_URL_MIN_LENGTH = 1

// Page Settings Modal
// ===================
const PAGE_SETTINGS_PERMALINK_MIN_LENGTH = 4
const PAGE_SETTINGS_PERMALINK_MAX_LENGTH = 50
const PAGE_SETTINGS_TITLE_MIN_LENGTH = 4
const PAGE_SETTINGS_TITLE_MAX_LENGTH = 100

// Resource Settings Modal
// ===================
const RESOURCE_SETTINGS_TITLE_MIN_LENGTH = 4
const RESOURCE_SETTINGS_TITLE_MAX_LENGTH = 100
const RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH = 4
const RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH = 50

// Resource Category Modal
// ===================
const RESOURCE_CATEGORY_MIN_LENGTH = 2
const RESOURCE_CATEGORY_MAX_LENGTH = 30

// Homepage Editor
// ==========
// Returns new errors.highlights[index] object
const validateHighlights = (highlightError, field, value) => {
  const newHighlightError = highlightError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < HIGHLIGHTS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${HIGHLIGHTS_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > HIGHLIGHTS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${HIGHLIGHTS_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "description": {
      // Description is too short
      if (value.length < HIGHLIGHTS_DESCRIPTION_MIN_LENGTH) {
        errorMessage = `The description should be longer than ${HIGHLIGHTS_DESCRIPTION_MIN_LENGTH} characters.`
      }
      // Description is too long
      if (value.length > HIGHLIGHTS_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `The description should be shorter than ${HIGHLIGHTS_DESCRIPTION_MAX_LENGTH} characters.`
      }
      break
    }
    case "url": {
      // Permalink fails regex
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: allow external links
      // TO-DO: Validate that link actually links to a page?
      break
    }
    default:
      break
  }
  newHighlightError[field] = errorMessage
  return newHighlightError
}

// Returns errors.dropdownElems[dropdownsIndex] object
const validateDropdownElems = (dropdownElemError, field, value) => {
  const newDropdownElemError = dropdownElemError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < DROPDOWNELEM_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${DROPDOWNELEM_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > DROPDOWNELEM_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${DROPDOWNELEM_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "url": {
      // Permalink fails regex
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: allow external links
      // TO-DO: Validate that link actually links to a page?
      break
    }
    default:
      break
  }
  newDropdownElemError[field] = errorMessage
  return newDropdownElemError
}

const validateHeroSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < HERO_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${HERO_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > HERO_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${HERO_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "subtitle": {
      // Subtitle is too short
      if (value.length < HERO_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${HERO_SUBTITLE_MIN_LENGTH} characters.`
      }
      // Subtitle is too long
      if (value.length > HERO_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${HERO_SUBTITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "background": {
      errorMessage = ""
      break
    }
    case "button": {
      // // Button text is too short
      // if (value.length < HERO_BUTTON_TEXT_MIN_LENGTH) {
      //   errorMessage = `The button text should be longer than ${HERO_BUTTON_TEXT_MIN_LENGTH} characters.`;
      // }
      // // Button text is too long
      // if (value.length > HERO_BUTTON_TEXT_MAX_LENGTH) {
      //   errorMessage = `The button text should be shorter than ${HERO_BUTTON_TEXT_MAX_LENGTH} characters.`;
      // }
      break
    }
    case "dropdown": {
      // Dropdown text is too short
      if (value.length < HERO_DROPDOWN_MIN_LENGTH) {
        errorMessage = `The dropdown text should be longer than ${HERO_DROPDOWN_MIN_LENGTH} characters.`
      }
      // Dropdown text is too long
      if (value.length > HERO_DROPDOWN_MAX_LENGTH) {
        errorMessage = `The dropdown text should be shorter than ${HERO_DROPDOWN_MAX_LENGTH} characters.`
      }
      break
    }
    case "url": {
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: Allow external URLs
      break
    }
    default:
      break
  }
  newSectionError[sectionType][field] = errorMessage
  return newSectionError
}

const validateResourcesSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < RESOURCES_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${RESOURCES_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > RESOURCES_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${RESOURCES_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "subtitle": {
      // Subtitle is too short
      if (value.length < RESOURCES_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${RESOURCES_SUBTITLE_MIN_LENGTH} characters.`
      }
      // Subtitle is too long
      if (value.length > RESOURCES_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${RESOURCES_SUBTITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "button": {
      // Button text is too short
      if (value.length < RESOURCES_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${RESOURCES_BUTTON_TEXT_MIN_LENGTH} characters.`
      }
      // Button text is too long
      if (value.length > RESOURCES_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${RESOURCES_BUTTON_TEXT_MAX_LENGTH} characters.`
      }
      break
    }
    default:
      break
  }
  newSectionError[sectionType][field] = errorMessage
  return newSectionError
}

const validateInfobarSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < INFOBAR_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${INFOBAR_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > INFOBAR_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${INFOBAR_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "subtitle": {
      // Subtitle is too short
      if (value.length < INFOBAR_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${INFOBAR_SUBTITLE_MIN_LENGTH} characters.`
      }
      // Subtitle is too long
      if (value.length > INFOBAR_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${INFOBAR_SUBTITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "description": {
      // Description is too short
      if (value.length < INFOBAR_DESCRIPTION_MIN_LENGTH) {
        errorMessage = `The description should be longer than ${INFOBAR_DESCRIPTION_MIN_LENGTH} characters.`
      }
      // Description is too long
      if (value.length > INFOBAR_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `The description should be shorter than ${INFOBAR_DESCRIPTION_MAX_LENGTH} characters.`
      }
      break
    }
    case "button": {
      // Button text is too short
      if (value.length < INFOBAR_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${INFOBAR_BUTTON_TEXT_MIN_LENGTH} characters.`
      }
      // Button text is too long
      if (value.length > INFOBAR_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${INFOBAR_BUTTON_TEXT_MAX_LENGTH} characters.`
      }
      break
    }
    case "url": {
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: Allow external URLs
      break
    }
    default:
      break
  }
  newSectionError[sectionType][field] = errorMessage
  return newSectionError
}

const validateInfopicSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError
  let errorMessage = ""
  switch (field) {
    case "title": {
      // Title is too short
      if (value.length < INFOPIC_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${INFOPIC_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > INFOPIC_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${INFOPIC_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "subtitle": {
      // Subtitle is too short
      if (value.length < INFOPIC_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${INFOPIC_SUBTITLE_MIN_LENGTH} characters.`
      }
      // Subtitle is too long
      if (value.length > INFOPIC_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${INFOPIC_SUBTITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "description": {
      // Description is too short
      if (value.length < INFOPIC_DESCRIPTION_MIN_LENGTH) {
        errorMessage = `The description should be longer than ${INFOPIC_DESCRIPTION_MIN_LENGTH} characters.`
      }
      // Description is too long
      if (value.length > INFOPIC_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `The description should be shorter than ${INFOPIC_DESCRIPTION_MAX_LENGTH} characters.`
      }
      break
    }
    case "button": {
      // Button text is too short
      if (value.length < INFOPIC_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${INFOPIC_BUTTON_TEXT_MIN_LENGTH} characters.`
      }
      // Button text is too long
      if (value.length > INFOPIC_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${INFOPIC_BUTTON_TEXT_MAX_LENGTH} characters.`
      }
      break
    }
    case "alt": {
      // Alt text is too short
      if (value.length < INFOPIC_ALT_TEXT_MIN_LENGTH) {
        errorMessage = `The image alt text should be longer than ${INFOPIC_ALT_TEXT_MIN_LENGTH} characters.`
      }
      // Alt text is too long
      if (value.length > INFOPIC_ALT_TEXT_MAX_LENGTH) {
        errorMessage = `The image alt text should be shorter than ${INFOPIC_ALT_TEXT_MAX_LENGTH} characters.`
      }
      break
    }
    default:
      break
  }
  newSectionError[sectionType][field] = errorMessage
  return newSectionError
}

const validateSections = (sectionError, sectionType, field, value) => {
  let newSectionError = sectionError
  switch (sectionType) {
    case "hero": {
      newSectionError = validateHeroSection(
        sectionError,
        sectionType,
        field,
        value
      )
      break
    }
    case "resources": {
      newSectionError = validateResourcesSection(
        sectionError,
        sectionType,
        field,
        value
      )
      break
    }
    case "infobar": {
      newSectionError = validateInfobarSection(
        sectionError,
        sectionType,
        field,
        value
      )
      break
    }
    case "infopic": {
      newSectionError = validateInfopicSection(
        sectionError,
        sectionType,
        field,
        value
      )
      break
    }
    default:
      break
  }

  return newSectionError
}

// Contact Us Editor
// ===============
// Contacts

const validateContactType = (contactType, value) => {
  let errorMessage = ""
  switch (contactType) {
    case "title": {
      if (value.length < CONTACT_TITLE_MIN_LENGTH) {
        errorMessage = `Title cannot be empty.`
      }
      if (value.length > CONTACT_TITLE_MAX_LENGTH) {
        errorMessage = `Title should be shorter than ${CONTACT_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "phone": {
      const strippedValue = value.replace(/\s/g, "")
      if (strippedValue.includes("_")) {
        errorMessage = `Field not completed`
      }
      if (_.startsWith(strippedValue, "+65")) {
        if (
          !strippedValue.includes("_") &&
          !phoneRegexTest.test(strippedValue)
        ) {
          errorMessage = `Local numbers should start with 6, 8 or 9.`
        }
      }
      break
    }
    case "email": {
      if (value && !emailRegexTest.test(value)) {
        errorMessage = `Emails should follow the format abc@def.gh and should not contain special characters such as: ?!#\\$% ` // TODO
      }
      break
    }
    case "other": {
      if (value.length > CONTACT_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `Description should be shorter than ${CONTACT_DESCRIPTION_MAX_LENGTH} characters.`
      }
      break
    }
    default:
      break
  }
  return errorMessage
}

// Locations

const validateLocationType = (locationType, value) => {
  let errorMessage = ""
  switch (locationType) {
    case "title": {
      // Title is too short
      if (value.length < LOCATION_TITLE_MIN_LENGTH) {
        errorMessage = `Title cannot be empty.`
      }
      // Title is too long
      if (value.length > LOCATION_TITLE_MAX_LENGTH) {
        errorMessage = `Title should be shorter than ${LOCATION_TITLE_MAX_LENGTH} characters.`
      }
      break
    }
    case "maps_link": {
      break
    }
    case "address": {
      const errors = []
      // check if in-between fields are empty e.g. field 3 is filled but field 2 is empty
      if (
        (value[2].length && !(value[0].length && value[1].length)) ||
        (value[1].length && !value[0].length)
      ) {
        errors.push("Please do not leave in-between fields empty.")
      } else {
        value.forEach((field) => {
          let error = ""
          // if else check necessarily because we want to push an empty string if there's no error
          if (field && field.length < LOCATION_ADDRESS_MIN_LENGTH) {
            error = `Field should be longer than ${LOCATION_ADDRESS_MIN_LENGTH} characters.`
          }
          if (field && field.length > LOCATION_ADDRESS_MAX_LENGTH) {
            error = `Field should be shorter than ${LOCATION_ADDRESS_MAX_LENGTH} characters.`
          }
          errors.push(error)
        })
      }
      errorMessage = errors
      break
    }
    // fields below are operating hours fields
    case "days": {
      if (value && !alphabetsRegexTest.test(value)) {
        errorMessage += `Field should only contain alphabets. `
      }
      if (value && value.length < LOCATION_OPERATING_DAYS_MIN_LENGTH) {
        errorMessage += `Field should be longer than ${LOCATION_OPERATING_DAYS_MIN_LENGTH} characters. `
      }
      if (value && value.length > LOCATION_OPERATING_DAYS_MAX_LENGTH) {
        errorMessage += `Field should be shorter than ${LOCATION_OPERATING_DAYS_MAX_LENGTH} characters. `
      }
      break
    }
    case "time": {
      if (value && !alphanumericRegexTest.test(value)) {
        errorMessage += `Field should only contain alphanumeric characters. `
      }
      if (value && value.length < LOCATION_OPERATING_HOURS_MIN_LENGTH) {
        errorMessage += `Field should be longer than ${LOCATION_OPERATING_HOURS_MIN_LENGTH} characters.`
      }
      if (value && value.length > LOCATION_OPERATING_HOURS_MAX_LENGTH) {
        errorMessage += `Field should be shorter than ${LOCATION_OPERATING_HOURS_MAX_LENGTH} characters.`
      }
      break
    }
    case "description": {
      if (value.length > LOCATION_OPERATING_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `Description should be shorter than ${LOCATION_OPERATING_DESCRIPTION_MAX_LENGTH} characters.`
      }
      break
    }
    default:
      break
  }
  return errorMessage
}

// Nav Bar Editor
const validateLink = (linkType, value) => {
  let errorMessage = ""
  switch (linkType) {
    case "title":
      if (value.length < LINK_TITLE_MIN_LENGTH) {
        errorMessage = `Title cannot be empty.`
      }
      if (value.length > LINK_TITLE_MAX_LENGTH) {
        errorMessage = `Title should be shorter than ${LINK_TITLE_MAX_LENGTH} characters.`
      }
      break
    case "url":
      if (value.length < LINK_URL_MIN_LENGTH) {
        errorMessage = `Permalink cannot be empty.`
      }
      break
    default:
      break
  }
  return errorMessage
}

// Resource Category Modal
// ===================
const validateCategoryName = (value, componentName, existingNames) => {
  let errorMessage = ""

  if (existingNames && existingNames.includes(slugifyCategory(value)))
    errorMessage = `Another folder with the same name exists. Please choose a different name.`
  else if (ISOMER_TEMPLATE_PROTECTED_DIRS.includes(slugifyCategory(value)))
    errorMessage = `The name chosen is a protected folder name (${ISOMER_TEMPLATE_PROTECTED_DIRS.map(
      (item) => `'${item}'`
    ).join(", ")}). Please choose a different name.`
  // Resource category is too short
  else if (value.length < RESOURCE_CATEGORY_MIN_LENGTH) {
    errorMessage = `The ${componentName} category should be longer than ${RESOURCE_CATEGORY_MIN_LENGTH} characters.`
  }
  // Resource category is too long
  else if (value.length > RESOURCE_CATEGORY_MAX_LENGTH) {
    errorMessage = `The ${componentName} category should be shorter than ${RESOURCE_CATEGORY_MAX_LENGTH} characters.`
  }
  // Resource category fails regex
  else if (!resourceCategoryRegexTest.test(value)) {
    errorMessage = `The ${componentName} category should not contain special characters such as: ?!#\\$%.`
  }

  return errorMessage
}

// Page Settings Modal
// ===================
const validatePageSettings = (id, value, folderOrderArray) => {
  let errorMessage = ""
  switch (id) {
    case "permalink": {
      // Permalink is too short
      if (value.length < PAGE_SETTINGS_PERMALINK_MIN_LENGTH) {
        errorMessage = `The permalink should be longer than ${PAGE_SETTINGS_PERMALINK_MIN_LENGTH} characters.`
      }

      // Permalink is too long
      if (value.length > PAGE_SETTINGS_PERMALINK_MAX_LENGTH) {
        errorMessage = `The permalink should be shorter than ${PAGE_SETTINGS_PERMALINK_MAX_LENGTH} characters.`
      }

      // Permalink fails regex
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only.`
      }
      break
    }
    case "title": {
      // Title is too short
      if (value.length < PAGE_SETTINGS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${PAGE_SETTINGS_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > PAGE_SETTINGS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${PAGE_SETTINGS_TITLE_MAX_LENGTH} characters.`
      }
      if (
        folderOrderArray !== undefined &&
        folderOrderArray.includes(generatePageFileName(value))
      ) {
        errorMessage = `This title is already in use. Please choose a different title.`
      }
      break
    }
    case "category": {
      if (value !== "") {
        errorMessage = validateCategoryName(value, "page")
      }
      break
    }
    default:
      break
  }
  return errorMessage
}

// Resource Settings Modal
// ===================
const validateDayOfMonth = (month, day) => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12: {
      return day > 0 && day < 32
    }
    case 4:
    case 6:
    case 9:
    case 11: {
      return day > 0 && day < 31
    }
    case 2: {
      return day > 0 && day < 29
    }
    default:
      return false
  }
}

const validateResourceSettings = (id, value, folderOrderArray) => {
  let errorMessage = ""
  switch (id) {
    case "title": {
      // Title is too short
      if (value.length < RESOURCE_SETTINGS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${RESOURCE_SETTINGS_TITLE_MIN_LENGTH} characters.`
      }
      // Title is too long
      if (value.length > RESOURCE_SETTINGS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${RESOURCE_SETTINGS_TITLE_MAX_LENGTH} characters.`
      }
      if (
        folderOrderArray !== undefined &&
        folderOrderArray
          .map((fileName) =>
            slugifyCategory(retrieveResourceFileMetadata(fileName).title)
          )
          .includes(slugifyCategory(value))
      ) {
        errorMessage = `This title is already in use. Please choose a different title.`
      }
      break
    }
    case "date": {
      // Date is in wrong format
      if (!dateRegexTest.test(value)) {
        errorMessage = "The date should be in the format YYYY-MM-DD."
      } else {
        const dateTokens = value.split("-")
        const month = parseInt(dateTokens[1], RADIX_PARSE_INT)
        const day = parseInt(dateTokens[2], RADIX_PARSE_INT)

        // Day value is invalid for the given month
        if (!validateDayOfMonth(month, day)) {
          errorMessage = "The day value is invalid for the given month."
        }

        // Month value is invalid
        if (month < 0 || month > 12) {
          errorMessage = "The month value should be from 01 to 12."
        }
      }
      break
    }
    case "permalink": {
      // Permalink is too short
      if (value.length < RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH) {
        errorMessage = `The permalink should be longer than ${RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH} characters.`
      }
      // Permalink is too long
      if (value.length > RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH) {
        errorMessage = `The permalink should be shorter than ${RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH} characters.`
      }
      // Permalink fails regex
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only.`
      }
      break
    }
    case "category": {
      errorMessage = validateCategoryName(value, "resource")
      if (value === "") {
        errorMessage = `The resource category cannot be empty.`
      }
      break
    }
    case "fileUrl": {
      if (value.length === 0) {
        errorMessage = "Please choose a file"
      }
      break
    }
    default: {
      break
    }
  }
  return errorMessage
}

const validateFileName = (value) => {
  if (!value.length) {
    return "Please input the file name"
  }

  const fileNameArr = value.split(".")
  if (fileNameArr.length !== 2) {
    return "Invalid filename: filename can only contain one full stop and must follow the structure {name}.{extension}"
  }
  if (!fileNameExtensionRegexTest.test(fileNameArr[1])) {
    return "Invalid filename: filename must end with a valid file extension (.JPG, .png, .pdf, etc.)"
  }
  if (fileNameArr[0] === "")
    return "Invalid filename: please specify a filename"
  if (!fileNameRegexTest.test(fileNameArr[0])) {
    return "Invalid filename: filename must not contain any special characters"
  }
  return ""
}

// Media Settings Modal
// ===================

const validateMediaSettings = (value, mediaFileNames) => {
  let errorMessage = validateFileName(value)

  if (mediaFileNames !== undefined && mediaFileNames.includes(value)) {
    errorMessage = `This title is already in use. Please choose a different title.`
  }
  return errorMessage
}

// Resource room creation
// ===================
const validateResourceRoomName = (value) => {
  let errorMessage = ""

  if (!resourceRoomNameRegexTest.test(value)) {
    errorMessage =
      "The resource room name should only contain alphanumeric characters or dashes."
  }

  return errorMessage
}

// Settings page
// ===================
const validateSocialMedia = (value, id) => {
  let errorMessage = ""
  const socialMediaRegexTest = RegExp(
    `${URL_REGEX_PART_1}${id}${URL_REGEX_PART_2}`
  )

  // conduct regex tests for each social media platform
  if (!socialMediaRegexTest.test(value)) {
    if (value !== "")
      errorMessage = `The URL you have entered is not a valid ${id[0].toUpperCase()}${id.slice(
        1
      )} URL.`
  }

  return errorMessage
}

export {
  validateContactType,
  validateLocationType,
  validateLink,
  validateHighlights,
  validateDropdownElems,
  validateSections,
  validatePageSettings,
  validateResourceSettings,
  validateMediaSettings,
  validateCategoryName,
  validateSocialMedia,
  validateFileName,
  validateResourceRoomName,
}
