// Constants
// ==========
const PERMALINK_REGEX = '^(/([a-z]+([-][a-z]+)*/)+)$';
const permalinkRegexTest = RegExp(PERMALINK_REGEX);

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
const HERO_BUTTON_TEXT_MIN_LENGTH = 2;
const HERO_BUTTON_TEXT_MAX_LENGTH = 30;
const HERO_DROPDOWN_MIN_LENGTH = 2;
const HERO_DROPDOWN_MAX_LENGTH = 30;


// Validators
// ==========
// Returns new errors.highlights[index] object
export const validateHighlights = (highlightError, field, value) => {
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
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
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
export const validateDropdownElems = (dropdownElemError, field, value) => {
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
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
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
      // Button text is too short
      if (value.length < HERO_BUTTON_TEXT_MIN_LENGTH) {
        errorMessage = `The button text should be longer than ${HERO_BUTTON_TEXT_MIN_LENGTH} characters.`;
      }
      // Button text is too long
      if (value.length > HERO_BUTTON_TEXT_MAX_LENGTH) {
        errorMessage = `The button text should be shorter than ${HERO_BUTTON_TEXT_MAX_LENGTH} characters.`;
      }
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
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
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
      if (!permalinkRegexTest.test(value)) {
        errorMessage = `The url should start and end with slashes and contain 
          lowercase words separated by hyphens only.
          `;
      }
      // TO-DO: Allow external URLs
      break;
    }
    default:
      break;
  }
  newSectionError[sectionType][field] = errorMessage;
  return newSectionError;
};

export const validateSections = (sectionError, sectionType, field, value) => {
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