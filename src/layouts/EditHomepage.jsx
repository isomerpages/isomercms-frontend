import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/isomer-template.scss';
import TemplateHeroSection from '../templates/homepage/HeroSection';
import TemplateInfobarSection from '../templates/homepage/InfobarSection';
import TemplateResourcesSection from '../templates/homepage/ResourcesSection';
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';
import {
  EditorInfobarSection, EditorResourcesSection, EditorHeroSection, NewSectionCreator,
} from '../components/editor/Homepage';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

// Constants
// ==========
const RADIX_PARSE_INT = 10;
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

// Section constructors
const ResourcesSectionConstructor = () => ({
  resources: {
    title: '',
    subtitle: '',
    button: '',
  },
});

const InfobarSectionConstructor = () => ({
  infobar: {
    title: '',
    subtitle: '',
    description: '',
    button: '',
    url: '',
  },
});

const KeyHighlightConstructor = () => ({
  title: '',
  description: '',
  url: '',
});

const DropdownElemConstructor = () => ({
  title: '',
  url: '',
});

const DropdownConstructor = () => ({
  title: '',
  options: [],
});

const enumSection = (type) => {
  switch (type) {
    case 'resources':
      return ResourcesSectionConstructor();
    case 'infobar':
      return InfobarSectionConstructor();
    default:
      return InfobarSectionConstructor();
  }
};

export default class EditHomepage extends Component {
  constructor(props) {
    super(props);
    this.scrollRefs = [];
    this.state = {
      frontMatter: {
        title: '',
        subtitle: '',
        description: '',
        image: '',
        notification: '',
        sections: [],
      },
      sha: null,
      hasResources: false,
      dropdownIsActive: false,
      displaySections: [],
      displayHighlights: [],
      displayDropdownElems: [],
      errors: {
        sections: [],
        highlights: [],
        dropdownElems: [],
      },
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`, {
        withCredentials: true,
      });
      const { content, sha } = resp.data;
      const base64DecodedContent = Base64.decode(content);
      const { frontMatter } = frontMatterParser(base64DecodedContent);

      // Compute hasResources and set displaySections
      let hasResources = false;
      const displaySections = [];
      let displayHighlights = [];
      let displayDropdownElems = [];
      const sectionsErrors = [];
      let dropdownElemsErrors = [];
      let highlightsErrors = [];
      frontMatter.sections.forEach((section) => {
        // If this is the hero section, hide all highlights/dropdownelems by default
        if (section.hero) {
          const { dropdown, key_highlights: keyHighlights } = section.hero;
          if (dropdown) {
            // Go through section.hero.dropdown.options
            displayDropdownElems = _.fill(Array(dropdown.options.length), false);
            // Fill in dropdown elem errors array
            dropdownElemsErrors = _.fill(Array(dropdown.options.length), DropdownElemConstructor());
            // Fill in sectionErrors for hero with dropdown
            sectionsErrors.push({
              hero: {
                title: '', subtitle: '', background: '', button: '', url: '', dropdown: '',
              },
            });
          }
          if (keyHighlights) {
            displayHighlights = _.fill(Array(keyHighlights.length), false);
            // Fill in highlights errors array
            highlightsErrors = _.fill(Array(keyHighlights.length), KeyHighlightConstructor());
            // Fill in sectionErrors for hero with key highlights
            sectionsErrors.push({
              hero: {
                title: '', subtitle: '', background: '', button: '', url: '',
              },
            });
          }
        }

        // Check if there is already a resources section
        if (section.resources) {
          sectionsErrors.push(ResourcesSectionConstructor());
          hasResources = true;
        }

        if (section.infobar) {
          sectionsErrors.push(InfobarSectionConstructor());
        }

        // Minimize all sections by default
        displaySections.push(false);
      });

      // Initialize errors object
      const errors = {
        sections: sectionsErrors,
        highlights: highlightsErrors,
        dropdownElems: dropdownElemsErrors,
      };

      this.setState({
        frontMatter,
        sha,
        hasResources,
        displaySections,
        displayDropdownElems,
        displayHighlights,
        errors,
      });
    } catch (err) {
      console.log(err);
    }
  }

  onFieldChange = async (event) => {
    try {
      const { state } = this;
      const { errors } = state;
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      switch (elemType) {
        case 'site': {
          // The field that changed belongs to a site-wide config
          const field = idArray[1]; // e.g. "title" or "subtitle"

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              [field]: value,
            },
          }));
          break;
        }
        case 'section': {
          // The field that changed belongs to a homepage section config
          const { sections } = state.frontMatter;

          // sectionIndex is the index of the section array in the frontMatter
          const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const sectionType = idArray[2]; // e.g. "hero" or "infobar" or "resources"
          const field = idArray[3]; // e.g. "title" or "subtitle"

          sections[sectionIndex][sectionType][field] = value;

          const newErrors = update(errors, {
            sections: {
              [sectionIndex]: {
                $set: validateSections(errors.sections[sectionIndex], sectionType, field, value),
              },
            },
          });

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
            errors: newErrors,
          }));

          this.scrollRefs[sectionIndex].scrollIntoView();
          break;
        }
        case 'highlight': {
          // The field that changed belongs to a hero highlight
          const { sections } = state.frontMatter;
          const highlights = sections[0].hero.key_highlights;

          // highlightsIndex is the index of the key_highlights array
          const highlightsIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const field = idArray[2]; // e.g. "title" or "url"

          highlights[highlightsIndex][field] = value;
          sections[0].hero.key_highlights = highlights;

          const newErrors = update(errors, {
            highlights: {
              [highlightsIndex]: {
                $set: validateHighlights(errors.highlights[highlightsIndex], field, value),
              },
            },
          });

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
            errors: newErrors,
          }));

          this.scrollRefs[0].scrollIntoView();
          break;
        }
        case 'dropdownelem': {
          // The field that changed is a dropdown element (i.e. dropdownelem)
          const { sections } = state.frontMatter;
          const dropdowns = sections[0].hero.dropdown.options;

          // dropdownsIndex is the index of the dropdown.options array
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const field = idArray[2]; // e.g. "title" or "url"

          dropdowns[dropdownsIndex][field] = value;
          sections[0].hero.dropdown.options = dropdowns;

          const newErrors = update(errors, {
            dropdownElems: {
              [dropdownsIndex]: {
                $set: validateDropdownElems(errors.dropdownElems[dropdownsIndex], field, value),
              },
            },
          });

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
            errors: newErrors,
          }));

          this.scrollRefs[0].scrollIntoView();
          break;
        }
        default: {
          // The field that changed is the dropdown placeholder title

          const newErrors = update(errors, {
            sections: {
              0: {
                $set: validateSections(errors.sections[0], 'hero', 'dropdown', value),
              },
            },
          });

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections: update(currState.frontMatter.sections, {
                0: {
                  hero: {
                    dropdown: {
                      title: {
                        $set: value,
                      },
                    },
                  },
                },
              }),
            },
            errors: newErrors,
          }));

          this.scrollRefs[0].scrollIntoView();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  createHandler = async (event) => {
    try {
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      const { frontMatter, errors } = this.state;
      let newSections = [];
      let newErrors = [];

      switch (elemType) {
        case 'section': {
          const sectionType = enumSection(value);

          // The Isomer site can only have 1 resources section in the homepage
          // Set hasResources to prevent the creation of more resources sections
          if (value === 'resources') {
            this.setState({ hasResources: true });
          }

          newSections = update(frontMatter.sections, {
            $push: [sectionType],
          });
          newErrors = update(errors, {
            $push: [sectionType],
          });
          break;
        }
        case 'dropdown': {
          const dropdownObj = DropdownConstructor();

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                button: {
                  $set: undefined,
                },
                url: {
                  $set: undefined,
                },
                key_highlights: {
                  $set: undefined,
                },
                dropdown: {
                  $set: dropdownObj,
                },
              },
            },
          });

          newErrors = update(errors, {
            sections: {
              0: {
                hero: {
                  button: {
                    $set: undefined,
                  },
                  url: {
                    $set: undefined,
                  },
                  dropdown: {
                    $set: '',
                  },
                },
              },
            },
            highlights: {
              $set: undefined,
            },
          });
          break;
        }
        case 'dropdownelem': {
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT) + 1;

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    $splice: [[dropdownsIndex, 0, DropdownElemConstructor()]],
                  },
                },
              },
            },
          });

          newErrors = update(errors, {
            dropdownElems: {
              $splice: [[dropdownsIndex, 0, DropdownElemConstructor()]],
            },
          });
          break;
        }
        case 'highlight': {
          const highlightIndex = parseInt(idArray[1], 10) + 1;

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                key_highlights: {
                  $splice: [[highlightIndex, 0, KeyHighlightConstructor()]],
                },
              },
            },
          });

          newErrors = update(errors, {
            highlights: {
              $splice: [[highlightIndex, 0, KeyHighlightConstructor()]],
            },
          });
          break;
        }
        default:
          return;
      }
      this.setState((currState) => ({
        ...currState,
        frontMatter: {
          ...currState.frontMatter,
          sections: newSections,
        },
        errors: newErrors,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async (event) => {
    try {
      const { id } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      const { frontMatter, errors } = this.state;
      let newSections = [];
      let newErrors = {};

      switch (elemType) {
        case 'section': {
          const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT);

          // Set hasResources to false to allow users to create a resources section
          if (frontMatter.sections[sectionIndex].resources) {
            this.setState({ hasResources: false });
          }

          newSections = update(frontMatter.sections, {
            $splice: [[sectionIndex, 1]],
          });

          newErrors = update(errors, {
            sections: {
              $splice: [[sectionIndex, 1]],
            },
          });
          break;
        }
        case 'dropdown': {
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  $set: undefined,
                },
                key_highlights: {
                  $set: [],
                },
              },
            },
          });

          newErrors = update(errors, {
            dropdownElems: {
              $set: [],
            },
            highlights: {
              $set: [],
            },
            sections: {
              0: {
                hero: {
                  dropdown: {
                    $set: '',
                  },
                },
              },
            },
          });
          break;
        }
        case 'dropdownelem': {
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    $splice: [[dropdownsIndex, 1]],
                  },
                },
              },
            },
          });

          newErrors = update(errors, {
            dropdownElems: {
              $splice: [[dropdownsIndex, 1]],
            },
          });
          break;
        }
        case 'highlight': {
          const highlightIndex = parseInt(idArray[1], 10);
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                key_highlights: {
                  $splice: [[highlightIndex, 1]],
                },
              },
            },
          });

          newErrors = update(errors, {
            highlights: {
              $splice: [[highlightIndex, 1]],
            },
          });
          break;
        }
        default:
          return;
      }
      this.setState((currState) => ({
        ...currState,
        frontMatter: {
          ...currState.frontMatter,
          sections: newSections,
        },
        errors: newErrors,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  toggleDropdown = async () => {
    try {
      this.setState((currState) => ({
        dropdownIsActive: !currState.dropdownIsActive,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  displayHandler = async (event) => {
    try {
      const { id } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];
      switch (elemType) {
        case 'section': {
          const { displaySections } = this.state;
          const sectionId = idArray[1];
          const newDisplaySections = displaySections;
          newDisplaySections[sectionId] = !newDisplaySections[sectionId];

          this.setState({
            displaySections: newDisplaySections,
          });
          break;
        }
        case 'highlight': {
          const { displayHighlights } = this.state;
          const highlightIndex = idArray[1];
          const newDisplayHighlights = displayHighlights;
          newDisplayHighlights[highlightIndex] = !newDisplayHighlights[highlightIndex];

          this.setState({
            displayHighlights: newDisplayHighlights,
          });
          break;
        }
        case 'dropdownelem': {
          const { displayDropdownElems } = this.state;
          const dropdownsIndex = idArray[1];
          const newDisplayDropdownElems = displayDropdownElems;
          newDisplayDropdownElems[dropdownsIndex] = !newDisplayDropdownElems[dropdownsIndex];

          this.setState({
            displayDropdownElems: newDisplayDropdownElems,
          });
          break;
        }
        default:
          return;
      }
    } catch (err) {
      console.log(err);
    }
  }

  savePage = async () => {
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;
      const content = concatFrontMatterMdBody(state.frontMatter, '');
      const base64EncodedContent = Base64.encode(content);

      const params = {
        content: base64EncodedContent,
        sha: state.sha,
      };

      const resp = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`, params, {
        withCredentials: true,
      });

      const { sha } = resp.data;

      this.setState({ sha });
    } catch (err) {
      console.log(err);
    }
  }

  onDragEnd = (result) => {
    const { source, destination, type } = result;
    const { frontMatter, errors } = this.state;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    let newSections = [];
    let newErrors = [];

    switch (type) {
      case 'editor': {
        const draggedElem = frontMatter.sections[source.index];
        newSections = update(frontMatter.sections, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedElem], // Splice elem into its new position
          ],
        });

        const draggedError = errors.sections[source.index];
        newErrors = update(errors, {
          sections: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        });
        break;
      }
      case 'dropdownelem': {
        const draggedElem = frontMatter.sections[0].hero.dropdown.options[source.index];
        newSections = update(frontMatter.sections, {
          0: {
            hero: {
              dropdown: {
                options: {
                  $splice: [
                    [source.index, 1], // Remove elem from its original position
                    [destination.index, 0, draggedElem], // Splice elem into its new position
                  ],
                },
              },
            },
          },
        });

        const draggedError = errors.dropdownElems[source.index];
        newErrors = update(errors, {
          dropdownElems: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        });
        break;
      }
      case 'highlight': {
        const draggedElem = frontMatter.sections[0].hero.key_highlights[source.index];
        newSections = update(frontMatter.sections, {
          0: {
            hero: {
              key_highlights: {
                $splice: [
                  [source.index, 1], // Remove elem from its original position
                  [destination.index, 0, draggedElem], // Splice elem into its new position
                ],
              },
            },
          },
        });

        const draggedError = errors.highlights[source.index];
        newErrors = update(errors, {
          highlights: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        });
        break;
      }
      default:
        return;
    }
    this.setState((currState) => ({
      ...currState,
      frontMatter: {
        ...currState.frontMatter,
        sections: newSections,
      },
      errors: newErrors,
    }));
  }

  render() {
    const {
      frontMatter,
      hasResources,
      dropdownIsActive,
      displaySections,
      displayHighlights,
      displayDropdownElems,
      errors,
    } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <Header />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <h3>
                Editing homepage
            </h3>
            <div>
              <div>
                {/* Site-wide configuration */}
                {/* <div className={styles.card}>
                    <h4>
                      <b>
                      Site-wide configurations
                      </b>
                    </h4>
                    <p>Site Title</p>
                    <input
                      placeholder="Title"
                      defaultValue={frontMatter.title}
                      value={frontMatter.title}
                      id="site-title"
                      onChange={this.onFieldChange}
                    />
                    <p>Site Subtitle</p>
                    <input
                      placeholder="Subtitle"
                      defaultValue={frontMatter.subtitle}
                      value={frontMatter.subtitle}
                      id="site-subtitle"
                      onChange={this.onFieldChange}
                    />
                    <p>Site description</p>
                    <input
                      placeholder="Description"
                      defaultValue={frontMatter.description}
                      value={frontMatter.description}
                      id="site-description"
                      onChange={this.onFieldChange}
                    />
                    <p>Site image</p>
                    <input
                      placeholder="Image"
                      defaultValue={frontMatter.image}
                      value={frontMatter.image}
                      id="site-image"
                      onChange={this.onFieldChange}
                    />
                  </div> */}
                {/* <div>
                    <p><b>Site notification</b></p>
                    <input
                      placeholder="Notification"
                      defaultValue={frontMatter.notification}
                      value={frontMatter.notification}
                      id="site-notification"
                      onChange={this.onFieldChange} />
                  </div> */}

                {/* Homepage section configurations */}
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="leftPane" type="editor">
                    {(droppableProvided) => (
                      <div
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                      >
                        {frontMatter.sections.map((section, sectionIndex) => (
                          <>
                            {/* Hero section */}
                            {section.hero ? (
                              <>
                                <EditorHeroSection
                                  key={`section-${sectionIndex}`}
                                  title={section.hero.title}
                                  subtitle={section.hero.subtitle}
                                  background={section.hero.background}
                                  button={section.hero.button}
                                  url={section.hero.url}
                                  dropdown={section.hero.dropdown}
                                  sectionIndex={sectionIndex}
                                  highlights={section.hero.key_highlights}
                                  onFieldChange={this.onFieldChange}
                                  createHandler={this.createHandler}
                                  deleteHandler={this.deleteHandler}
                                  shouldDisplay={displaySections[sectionIndex]}
                                  displayHighlights={displayHighlights}
                                  displayDropdownElems={displayDropdownElems}
                                  displayHandler={this.displayHandler}
                                  onDragEnd={this.onDragEnd}
                                  errors={errors}
                                />
                              </>
                            ) : (
                              null
                            )}

                            {/* Resources section */}
                            {section.resources ? (
                              <Draggable
                                draggableId={`resources-${sectionIndex}-draggable`}
                                index={sectionIndex}
                              >
                                {(draggableProvided) => (
                                  <div
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    ref={draggableProvided.innerRef}
                                  >
                                    <EditorResourcesSection
                                      key={`section-${sectionIndex}`}
                                      title={section.resources.title}
                                      subtitle={section.resources.subtitle}
                                      button={section.resources.button}
                                      sectionIndex={sectionIndex}
                                      deleteHandler={this.deleteHandler}
                                      onFieldChange={this.onFieldChange}
                                      shouldDisplay={displaySections[sectionIndex]}
                                      displayHandler={this.displayHandler}
                                      errors={errors.sections[sectionIndex].resources}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ) : (
                              null
                            )}

                            {/* Infobar section */}
                            {section.infobar ? (
                              <Draggable
                                draggableId={`infobar-${sectionIndex}-draggable`}
                                index={sectionIndex}
                              >
                                {(draggableProvided) => (
                                  <div
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                    ref={draggableProvided.innerRef}
                                  >
                                    <EditorInfobarSection
                                      key={`section-${sectionIndex}`}
                                      title={section.infobar.title}
                                      subtitle={section.infobar.subtitle}
                                      description={section.infobar.description}
                                      button={section.infobar.button}
                                      url={section.infobar.url}
                                      sectionIndex={sectionIndex}
                                      deleteHandler={this.deleteHandler}
                                      onFieldChange={this.onFieldChange}
                                      shouldDisplay={displaySections[sectionIndex]}
                                      displayHandler={this.displayHandler}
                                      errors={errors.sections[sectionIndex].infobar}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ) : (
                              null
                            )}

                            {/* Infopic section */}
                            {/* TO-DO */}

                            {/* Carousel section */}
                            {/* TO-DO */}

                          </>
                        ))}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* Section creator */}
                <NewSectionCreator
                  hasResources={hasResources}
                  createHandler={this.createHandler}
                />
              </div>
            </div>
          </div>
          <div className={editorStyles.homepageEditorMain}>
            {/* Isomer Template Pane */}
            {frontMatter.sections.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero
                  ? (
                    <div ref={(ref) => { this.scrollRefs[sectionIndex] = ref; }}>
                      <TemplateHeroSection
                        key={`section-${sectionIndex}`}
                        hero={section.hero}
                        siteName={siteName}
                        dropdownIsActive={dropdownIsActive}
                        toggleDropdown={this.toggleDropdown}
                      />
                    </div>
                  )
                  : null}
                {/* Resources section */}
                {section.resources
                  ? (
                    <div ref={(ref) => { this.scrollRefs[sectionIndex] = ref; }}>
                      <TemplateResourcesSection
                        key={`section-${sectionIndex}`}
                        title={section.resources.title}
                        subtitle={section.resources.subtitle}
                        button={section.resources.button}
                        sectionIndex={sectionIndex}
                      />
                    </div>
                  )
                  : null}
                {/* Infobar section */}
                {section.infobar
                  ? (
                    <div ref={(ref) => { this.scrollRefs[sectionIndex] = ref; }}>
                      <TemplateInfobarSection
                        key={`section-${sectionIndex}`}
                        title={section.infobar.title}
                        subtitle={section.infobar.subtitle}
                        description={section.infobar.description}
                        url={section.infobar.url}
                        button={section.infobar.button}
                        sectionIndex={sectionIndex}
                      />
                    </div>
                  )
                  : null}
              </>
            ))}
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <button type="button" className={elementStyles.blue} onClick={this.savePage}>Save</button>
          </div>
        </div>
      </>
    );
  }
}

EditHomepage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
