
// Common regexes and constants
// ==============
const PERMALINK_REGEX = '^(/([a-z]+([-][a-z]+)*/)+)$';
const permalinkRegexTest = RegExp(PERMALINK_REGEX);
const DATE_REGEX = '^([0-9]{4}-[0-9]{2}-[0-9]{2})$';
const dateRegexTest = RegExp(DATE_REGEX);
const fileNameRegexTest = /^[^<>:;,?"*|/]+\.[a-zA-z]{3}$/;
const RESOURCE_CATEGORY_REGEX = '^(([a-zA-Z0-9]+([\\s][a-zA-Z0-9]+)*)+)$';
const resourceCategoryRegexTest = RegExp(RESOURCE_CATEGORY_REGEX);
const RADIX_PARSE_INT = 10;

// Homepage Editor
// ===============
// Highlights
const HIGHLIGHTS_TITLE_MIN_LENGTH = 2;
const HIGHLIGHTS_TITLE_MAX_LENGTH = 30;
const HIGHLIGHTS_DESCRIPTION_MIN_LENGTH = 2;
const HIGHLIGHTS_DESCRIPTION_MAX_LENGTH = 30;
// Dropdown Elems
const DROPDOWNELEM_TITLE_MIN_LENGTH = 2;
const DROPDOWNELEM_TITLE_MAX_LENGTH = 30;
// Resources
const RESOURCES_TITLE_MIN_LENGTH = 2;
const RESOURCES_TITLE_MAX_LENGTH = 30;
const RESOURCES_SUBTITLE_MIN_LENGTH = 2;
const RESOURCES_SUBTITLE_MAX_LENGTH = 30;
const RESOURCES_BUTTON_TEXT_MIN_LENGTH = 2;
const RESOURCES_BUTTON_TEXT_MAX_LENGTH = 30;
// Infobar
const INFOBAR_TITLE_MIN_LENGTH = 2;
const INFOBAR_TITLE_MAX_LENGTH = 30;
const INFOBAR_SUBTITLE_MIN_LENGTH = 2;
const INFOBAR_SUBTITLE_MAX_LENGTH = 30;
const INFOBAR_BUTTON_TEXT_MIN_LENGTH = 2;
const INFOBAR_BUTTON_TEXT_MAX_LENGTH = 30;
const INFOBAR_DESCRIPTION_MIN_LENGTH = 2;
const INFOBAR_DESCRIPTION_MAX_LENGTH = 30;
// Hero
const HERO_TITLE_MIN_LENGTH = 2;
const HERO_TITLE_MAX_LENGTH = 30;
const HERO_SUBTITLE_MIN_LENGTH = 2;
const HERO_SUBTITLE_MAX_LENGTH = 30;
// const HERO_BUTTON_TEXT_MIN_LENGTH = 2;
// const HERO_BUTTON_TEXT_MAX_LENGTH = 30;
const HERO_DROPDOWN_MIN_LENGTH = 2;
const HERO_DROPDOWN_MAX_LENGTH = 30;

// Page Settings Modal
// ===================
const PAGE_SETTINGS_PERMALINK_MIN_LENGTH = 4;
const PAGE_SETTINGS_PERMALINK_MAX_LENGTH = 50;
const PAGE_SETTINGS_TITLE_MIN_LENGTH = 4;
const PAGE_SETTINGS_TITLE_MAX_LENGTH = 100;

// Resource Settings Modal
// ===================
const RESOURCE_SETTINGS_TITLE_MIN_LENGTH = 4;
const RESOURCE_SETTINGS_TITLE_MAX_LENGTH = 100;
const RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH = 4;
const RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH = 50;

// Resource Category Modal
// ===================
const RESOURCE_CATEGORY_MIN_LENGTH = 2;
const RESOURCE_CATEGORY_MAX_LENGTH = 30;

// Homepage Editor
// ==========
// Returns new errors.highlights[index] object
const validateHighlights = (highlightError, field, value) => {
  const newHighlightError = highlightError;
  let errorMessage = '';
  switch (field) {
    case 'title': {
      // Title is too short
      if (value.length < HIGHLIGHTS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${HIGHLIGHTS_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > HIGHLIGHTS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${HIGHLIGHTS_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'description': {
      // Description is too short
      if (value.length < HIGHLIGHTS_DESCRIPTION_MIN_LENGTH) {
        errorMessage = `The description should be longer than ${HIGHLIGHTS_DESCRIPTION_MIN_LENGTH} characters.`;
      }
      // Description is too long
      if (value.length > HIGHLIGHTS_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `The description should be shorter than ${HIGHLIGHTS_DESCRIPTION_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'url': {
      // Permalink fails regex
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: allow external links
      // TO-DO: Validate that link actually links to a page?
      break;
    }
    default:
      break;
  }
  newHighlightError[field] = errorMessage;
  return newHighlightError;
};

// Returns errors.dropdownElems[dropdownsIndex] object
const validateDropdownElems = (dropdownElemError, field, value) => {
  const newDropdownElemError = dropdownElemError;
  let errorMessage = '';
  switch (field) {
    case 'title': {
      // Title is too short
      if (value.length < DROPDOWNELEM_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${DROPDOWNELEM_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > DROPDOWNELEM_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${DROPDOWNELEM_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'url': {
      // Permalink fails regex
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: allow external links
      // TO-DO: Validate that link actually links to a page?
      break;
    }
    default:
      break;
  }
  newDropdownElemError[field] = errorMessage;
  return newDropdownElemError;
};

const validateHeroSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError;
  let errorMessage = '';
  switch (field) {
    case 'title': {
      // Title is too short
      if (value.length < HERO_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${HERO_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > HERO_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${HERO_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'subtitle': {
      // Subtitle is too short
      if (value.length < HERO_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${HERO_SUBTITLE_MIN_LENGTH} characters.`;
      }
      // Subtitle is too long
      if (value.length > HERO_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${HERO_SUBTITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'background': {
      errorMessage = '';
      break;
    }
    case 'button': {
      // // Button text is too short
      // if (value.length < HERO_BUTTON_TEXT_MIN_LENGTH) {
      //   errorMessage = `The button text should be longer than ${HERO_BUTTON_TEXT_MIN_LENGTH} characters.`;
      // }
      // // Button text is too long
      // if (value.length > HERO_BUTTON_TEXT_MAX_LENGTH) {
      //   errorMessage = `The button text should be shorter than ${HERO_BUTTON_TEXT_MAX_LENGTH} characters.`;
      // }
      break;
    }
    case 'dropdown': {
      // Dropdown text is too short
      if (value.length < HERO_DROPDOWN_MIN_LENGTH) {
        errorMessage = `The dropdown text should be longer than ${HERO_DROPDOWN_MIN_LENGTH} characters.`;
      }
      // Dropdown text is too long
      if (value.length > HERO_DROPDOWN_MAX_LENGTH) {
        errorMessage = `The dropdown text should be shorter than ${HERO_DROPDOWN_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'url': {
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: Allow external URLs
      break;
    }
    default:
      break;
  }
  newSectionError[sectionType][field] = errorMessage;
  return newSectionError;
};

const validateResourcesSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError;
  let errorMessage = '';
  switch (field) {
    case 'title': {
      // Title is too short
      if (value.length < RESOURCES_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${RESOURCES_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > RESOURCES_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${RESOURCES_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'subtitle': {
      // Subtitle is too short
      if (value.length < RESOURCES_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${RESOURCES_SUBTITLE_MIN_LENGTH} characters.`;
      }
      // Subtitle is too long
      if (value.length > RESOURCES_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${RESOURCES_SUBTITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'button': {
      // Button text is too short
      if (value.length < RESOURCES_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${RESOURCES_BUTTON_TEXT_MIN_LENGTH} characters.`;
      }
      // Button text is too long
      if (value.length > RESOURCES_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${RESOURCES_BUTTON_TEXT_MAX_LENGTH} characters.`;
      }
      break;
    }
    default:
      break;
  }
  newSectionError[sectionType][field] = errorMessage;
  return newSectionError;
};

const validateInfobarSection = (sectionError, sectionType, field, value) => {
  const newSectionError = sectionError;
  let errorMessage = '';
  switch (field) {
    case 'title': {
      // Title is too short
      if (value.length < INFOBAR_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${INFOBAR_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > INFOBAR_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${INFOBAR_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'subtitle': {
      // Subtitle is too short
      if (value.length < INFOBAR_SUBTITLE_MIN_LENGTH) {
        errorMessage = `The subtitle should be longer than ${INFOBAR_SUBTITLE_MIN_LENGTH} characters.`;
      }
      // Subtitle is too long
      if (value.length > INFOBAR_SUBTITLE_MAX_LENGTH) {
        errorMessage = `The subtitle should be shorter than ${INFOBAR_SUBTITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'description': {
      // Description is too short
      if (value.length < INFOBAR_DESCRIPTION_MIN_LENGTH) {
        errorMessage = `The description should be longer than ${INFOBAR_DESCRIPTION_MIN_LENGTH} characters.`;
      }
      // Description is too long
      if (value.length > INFOBAR_DESCRIPTION_MAX_LENGTH) {
        errorMessage = `The description should be shorter than ${INFOBAR_DESCRIPTION_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'button': {
      // Button text is too short
      if (value.length < INFOBAR_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${INFOBAR_BUTTON_TEXT_MIN_LENGTH} characters.`;
      }
      // Button text is too long
      if (value.length > INFOBAR_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${INFOBAR_BUTTON_TEXT_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'url': {
      // if (!permalinkRegexTest.test(value)) {
      //   errorMessage = `The url should start and end with slashes and contain
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO: Allow external URLs
      break;
    }
    default:
      break;
  }
  newSectionError[sectionType][field] = errorMessage;
  return newSectionError;
};

const validateSections = (sectionError, sectionType, field, value) => {
  let newSectionError = sectionError;
  switch (sectionType) {
    case 'hero': {
      newSectionError = validateHeroSection(sectionError, sectionType, field, value);
      break;
    }
    case 'resources': {
      newSectionError = validateResourcesSection(sectionError, sectionType, field, value);
      break;
    }
    case 'infobar': {
      newSectionError = validateInfobarSection(sectionError, sectionType, field, value);
      break;
    }
    default:
      break;
  }

  return newSectionError;
};

// Page Settings Modal
// ===================
const validatePageSettings = (id, value) => {
  let errorMessage = '';
  switch (id) {
    case 'permalink': {
      // Permalink is too short
      if (value.length < PAGE_SETTINGS_PERMALINK_MIN_LENGTH) {
        errorMessage = `The permalink should be longer than ${PAGE_SETTINGS_PERMALINK_MIN_LENGTH} characters.`;
      }

      // Permalink is too long
      if (value.length > PAGE_SETTINGS_PERMALINK_MAX_LENGTH) {
        errorMessage = `The permalink should be shorter than ${PAGE_SETTINGS_PERMALINK_MAX_LENGTH} characters.`;
      }

      // Permalink fails regex
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The permalink should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
      break;
    }
    case 'title': {
      // Title is too short
      if (value.length < PAGE_SETTINGS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${PAGE_SETTINGS_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > PAGE_SETTINGS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${PAGE_SETTINGS_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    default:
      break;
  }
  return errorMessage;
};

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
    case 12:
    {
      return day > 0 && day < 32;
    }
    case 4:
    case 6:
    case 9:
    case 11:
    {
      return day > 0 && day < 31;
    }
    case 2:
    {
      return day > 0 && day < 29;
    }
    default:
      return false;
  }
};

const validateResourceSettings = (id, value) => {
  let errorMessage = '';
  switch (id) {
    case 'title': {
      // Title is too short
      if (value.length < RESOURCE_SETTINGS_TITLE_MIN_LENGTH) {
        errorMessage = `The title should be longer than ${RESOURCE_SETTINGS_TITLE_MIN_LENGTH} characters.`;
      }
      // Title is too long
      if (value.length > RESOURCE_SETTINGS_TITLE_MAX_LENGTH) {
        errorMessage = `The title should be shorter than ${RESOURCE_SETTINGS_TITLE_MAX_LENGTH} characters.`;
      }
      break;
    }
    case 'date': {
      // Date is in wrong format
      if (!dateRegexTest.test(value)) {
        errorMessage = 'The date should be in the format YYYY-MM-DD.';
      } else {
        const dateTokens = value.split('-');
        const month = parseInt(dateTokens[1], RADIX_PARSE_INT);
        const day = parseInt(dateTokens[2], RADIX_PARSE_INT);

        // Day value is invalid for the given month
        if (!validateDayOfMonth(month, day)) {
          errorMessage = 'The day value is invalid for the given month.';
        }

        // Month value is invalid
        if (month < 0 || month > 12) {
          errorMessage = 'The month value should be from 01 to 12.';
        }
      }
      break;
    }
    case 'permalink': {
      // Permalink is too short
      if (value.length < RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH) {
        errorMessage = `The permalink should be longer than ${RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH} characters.`;
      }
      // Permalink is too long
      if (value.length > RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH) {
        errorMessage = `The permalink should be shorter than ${RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH} characters.`;
      }
      // Permalink fails regex
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The permalink should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
      break;
    }
    case 'fileUrl': {
      // File URL is too short
      // if (value.length < RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH) {
      //   errorMessage = `The file URL should be longer than ${RESOURCE_SETTINGS_PERMALINK_MIN_LENGTH} characters.`;
      // }
      // // File URL is too long
      // if (value.length > RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH) {
      //   errorMessage = `The file URL should be shorter than ${RESOURCE_SETTINGS_PERMALINK_MAX_LENGTH} characters.`;
      // }
      // File URL fails regex
      // if (!permalinkRegexTest.test(value)) {
      //   console.log('FAILED');
      //   errorMessage = `The permalink should start and end with slashes and contain 
      //     lowercase words separated by hyphens only.
      //     `;
      // }
      // TO-DO
      // Check if file exists
      break;
    }
    default: {
      break;
    }
  }
  return errorMessage;
};

// Resource Category Modal
// ===================
const validateResourceCategory = (value) => {
  let errorMessage = '';

  // Resource category is too short
  if (value.length < RESOURCE_CATEGORY_MIN_LENGTH) {
    errorMessage = `The resource category should be longer than ${RESOURCE_CATEGORY_MIN_LENGTH} characters.`;
  }
  // Resource category is too long
  if (value.length > RESOURCE_CATEGORY_MAX_LENGTH) {
    errorMessage = `The resource category should be shorter than ${RESOURCE_CATEGORY_MAX_LENGTH} characters.`;
  }
  // Resource category fails regex
  if (!resourceCategoryRegexTest.test(value)) {
    errorMessage = 'The resource category should only have alphanumeric characters separated by whitespace.';
  }

  return errorMessage;
};

const validateFileName = (value) => {
  if (!value.length) {
    return 'Please input the file name';
  }
  if (!fileNameRegexTest.test(value)) {
    return 'Invalid filename';
  }
  return '';
};

export {
  validateHighlights,
  validateDropdownElems,
  validateSections,
  validatePageSettings,
  validateResourceSettings,
  validateResourceCategory,
  validateFileName,
};
