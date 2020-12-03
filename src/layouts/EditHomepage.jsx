import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/isomer-template.scss';
import TemplateHeroSection from '../templates/homepage/HeroSection';
import TemplateInfobarSection from '../templates/homepage/InfobarSection';
import TemplateInfopicLeftSection from '../templates/homepage/InfopicLeftSection';
import TemplateInfopicRightSection from '../templates/homepage/InfopicRightSection';
import TemplateResourcesSection from '../templates/homepage/ResourcesSection';
import { DEFAULT_ERROR_TOAST_MSG, frontMatterParser, concatFrontMatterMdBody } from '../utils';
import EditorInfobarSection from '../components/homepage/InfobarSection';
import EditorInfopicSection from '../components/homepage/InfopicSection';
import EditorResourcesSection from '../components/homepage/ResourcesSection';
import EditorHeroSection from '../components/homepage/HeroSection';
import NewSectionCreator from '../components/homepage/NewSectionCreator';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import Header from '../components/Header';
import LoadingButton from '../components/LoadingButton';
import { validateSections, validateHighlights, validateDropdownElems } from '../utils/validators';
import DeleteWarningModal from '../components/DeleteWarningModal';
import { toast } from 'react-toastify';
import Toast from '../components/Toast';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

// Constants
// ==========
const RADIX_PARSE_INT = 10;

// Section constructors
const ResourcesSectionConstructor = (isErrorConstructor) => ({
  resources: {
    title: isErrorConstructor ? '' : 'Resources Section Title',
    subtitle: isErrorConstructor ? '' : 'Resources Section Subtitle',
    button: isErrorConstructor ? '' : 'Resources Button Name',
  },
});

const InfobarSectionConstructor = (isErrorConstructor) => ({
  infobar: {
    title: isErrorConstructor ? '' : 'Infobar Title',
    subtitle: isErrorConstructor ? '' : 'Infobar Subtitle',
    description: isErrorConstructor ? '' : 'Infobar description',
    button: isErrorConstructor ? '' : 'Button Text',
    url: '', // No default value so that no broken link is created
  },
});

const InfopicSectionConstructor = (isErrorConstructor) => ({
  infopic: {
    title: isErrorConstructor ? '' : 'Infopic Title',
    subtitle: isErrorConstructor ? '' : 'Infopic Subtitle',
    description: isErrorConstructor ? '' : 'Infopic description',
    button: isErrorConstructor ? '' : 'Button Text',
    url: '', // No default value so that no broken link is created
    image: '', // Always blank since the image modal handles this
    alt: isErrorConstructor ? '' : 'Image alt text',
  },
});

const KeyHighlightConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? '' : 'Key Highlight Title',
  description: isErrorConstructor ? '' : 'Key Highlight description',
  url: '', // No default value so that no broken link is created
});

const DropdownElemConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? '' : 'Hero Dropdown Element Title',
  url: '', // No default value so that no broken link is created
});

const DropdownConstructor = () => ({
  title: 'Hero Dropdown Title',
  options: [],
});

const enumSection = (type, isErrorConstructor) => {
  switch (type) {
    case 'resources':
      return ResourcesSectionConstructor(isErrorConstructor);
    case 'infobar':
      return InfobarSectionConstructor(isErrorConstructor);
    case 'infopic':
      return InfopicSectionConstructor(isErrorConstructor);
    default:
      return InfobarSectionConstructor(isErrorConstructor);
  }
};

export default class EditHomepage extends Component {
  _isMounted = false 

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
      itemPendingForDelete: {
        id: '',
        type: '',
      },
      savedHeroElems: '',
      savedHeroErrors: '',
      shouldRedirect: false
    };
  }

  async componentDidMount() {
    this._isMounted = true
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
            dropdownElemsErrors = _.map(dropdown.options, () => DropdownElemConstructor(true));
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
            highlightsErrors = _.map(keyHighlights, () => KeyHighlightConstructor(true));
            // Fill in sectionErrors for hero with key highlights
            sectionsErrors.push({
              hero: {
                title: '', subtitle: '', background: '', button: '', url: '',
              },
            });
          }
          if (!dropdown && !keyHighlights) {
            sectionsErrors.push({
              hero: {
                title: '', subtitle: '', background: '', button: '', url: '',
              },
            });
          }
        }

        // Check if there is already a resources section
        if (section.resources) {
          sectionsErrors.push(ResourcesSectionConstructor(true));
          hasResources = true;
        }

        if (section.infobar) {
          sectionsErrors.push(InfobarSectionConstructor(true));
        }

        if (section.infopic) {
          sectionsErrors.push(InfopicSectionConstructor(true));
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

      if (this._isMounted) this.setState({
        frontMatter,
        originalFrontMatter: _.cloneDeep(frontMatter),
        sha,
        hasResources,
        displaySections,
        displayDropdownElems,
        displayHighlights,
        errors,
      });
    } catch (err) {
      console.log(err);
      this.setState({ shouldRedirect: true })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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

          const newSections = update(sections, {
            [sectionIndex]: {
              [sectionType]: {
                [field]: {
                  $set: value,
                },
              },
            },
          });

          let newSectionError

          // Set special error message if hero button has text but hero url is empty
          // This needs to be done separately because it relies on the state of another field
          if (
            field === 'url' && !value && this.state.frontMatter.sections[sectionIndex][sectionType].button
            && (this.state.frontMatter.sections[sectionIndex][sectionType].button || this.state.frontMatter.sections[sectionIndex][sectionType].url)
          ) {
            const errorMessage = 'Please specify a URL for your button'
            newSectionError = _.cloneDeep(errors.sections[sectionIndex])
            newSectionError[sectionType][field] = errorMessage
          } else if (
            field === 'button' && !this.state.frontMatter.sections[sectionIndex][sectionType].url
            && (this.state.frontMatter.sections[sectionIndex][sectionType].button || this.state.frontMatter.sections[sectionIndex][sectionType].url)
          ) {
            const errorMessage = 'Please specify a URL for your button'
            newSectionError = _.cloneDeep(errors.sections[sectionIndex])
            newSectionError[sectionType]['url'] = errorMessage
          } else {
            newSectionError = validateSections(errors.sections[sectionIndex], sectionType, field, value)

            if (!this.state.frontMatter.sections[sectionIndex][sectionType].button && !this.state.frontMatter.sections[sectionIndex][sectionType].url) {
              newSectionError[sectionType]['button'] = ''
              newSectionError[sectionType]['url'] = ''
            }
          }

          const newErrors = update(errors, {
            sections: {
              [sectionIndex]: {
                $set: newSectionError,
              },
            },
          });

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections: newSections,
            },
            errors: newErrors,
          }));

          this.scrollRefs[sectionIndex].scrollIntoView();
          break;
        }
        case 'highlight': {
          // The field that changed belongs to a hero highlight
          const { sections } = state.frontMatter;

          // highlightsIndex is the index of the key_highlights array
          const highlightsIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const field = idArray[2]; // e.g. "title" or "url"

          const newSections = update(sections, {
            [0]: {
              hero: {
                key_highlights: {
                  [highlightsIndex]: {
                    [field]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          });

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
              sections: newSections,
            },
            errors: newErrors,
          }));

          this.scrollRefs[0].scrollIntoView();
          break;
        }
        case 'dropdownelem': {
          // The field that changed is a dropdown element (i.e. dropdownelem)
          const { sections } = state.frontMatter;

          // dropdownsIndex is the index of the dropdown.options array
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const field = idArray[2]; // e.g. "title" or "url"

          const newSections = update(sections, {
            [0]: {
              hero: {
                dropdown: {
                  options: {
                    [dropdownsIndex]: {
                      [field]: {
                        $set: value,
                      },
                    },
                  },
                },
              },
            },
          });

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
              sections: newSections,
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

      const {
        frontMatter, errors, displaySections, displayDropdownElems, displayHighlights,
      } = this.state;
      let newSections = [];
      let newErrors = [];

      switch (elemType) {
        case 'section': {
          // The Isomer site can only have 1 resources section in the homepage
          // Set hasResources to prevent the creation of more resources sections
          if (value === 'resources') {
            this.setState({ hasResources: true });
          }

          newSections = update(frontMatter.sections, {
            $push: [enumSection(value, false)],
          });
          newErrors = update(errors, {
            sections: {
              $push: [enumSection(value, true)],
            },
          });

          const newDisplaySections = update(displaySections, {
            $push: [true],
          });

          this.setState({
            displaySections: newDisplaySections,
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
                    $splice: [[dropdownsIndex, 0, DropdownElemConstructor(false)]],
                  },
                },
              },
            },
          });

          newErrors = update(errors, {
            dropdownElems: {
              $splice: [[dropdownsIndex, 0, DropdownElemConstructor(true)]],
            },
          });

          const newDisplayDropdownElems = update(displayDropdownElems, {
            $splice: [[dropdownsIndex, 0, true]],
          });

          this.setState({
            displayDropdownElems: newDisplayDropdownElems,
          });
          break;
        }
        case 'highlight': {
          // If key highlights section exists
          if (!_.isEmpty(frontMatter.sections[0].hero.key_highlights)) {
            const highlightIndex = parseInt(idArray[1], 10) + 1;

            newSections = update(frontMatter.sections, {
              0: {
                hero: {
                  key_highlights: {
                    $splice: [[highlightIndex, 0, KeyHighlightConstructor(false)]],
                  },
                },
              },
            });

            newErrors = update(errors, {
              highlights: {
                $splice: [[highlightIndex, 0, KeyHighlightConstructor(true)]],
              },
            });

            const newDisplayHighlights = update(displayHighlights, {
              $splice: [[highlightIndex, 0, true]],
            });

            this.setState({
              displayHighlights: newDisplayHighlights,
            });
          // If neither key highlights nor dropdown section exists, create new key highlights array
          } else {
            newSections = _.cloneDeep(frontMatter.sections)
            newSections[0].hero.key_highlights = [KeyHighlightConstructor(false)];

            newErrors = _.cloneDeep(errors)
            newErrors.highlights = [KeyHighlightConstructor(true)]

            const newDisplayHighlights = [true]

            this.setState({
              displayHighlights: newDisplayHighlights,
            });
          }
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

  deleteHandler = async (id) => {
    try {
      const idArray = id.split('-');
      const elemType = idArray[0];

      const {
        frontMatter, errors, displaySections, displayDropdownElems, displayHighlights,
      } = this.state;
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

          const newDisplaySections = update(displaySections, {
            $splice: [[sectionIndex, 1]],
          });

          this.setState({
            displaySections: newDisplaySections,
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

          const newDisplayDropdownElems = update(displayDropdownElems, {
            $splice: [[dropdownsIndex, 1]],
          });

          this.setState({
            displayDropdownElems: newDisplayDropdownElems,
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

          const newDisplayHighlights = update(displayHighlights, {
            $splice: [[highlightIndex, 1]],
          });

          this.setState({
            displayHighlights: newDisplayHighlights,
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

  handleHighlightDropdownToggle = (event) => {
    const {
      frontMatter, errors,
    } = this.state;
    let newSections = [];
    let newErrors = {};
    const { target: { value } } = event;
    if (value === 'highlights') {
      if (!frontMatter.sections[0].hero.dropdown) return
      let highlightObj, highlightErrors, buttonObj, buttonErrors, urlObj, urlErrors
      if (this.state.savedHeroElems) {
        highlightObj = this.state.savedHeroElems.key_highlights || []
        highlightErrors = this.state.savedHeroErrors.highlights || []
        buttonObj = this.state.savedHeroElems.button || ''
        buttonErrors = this.state.savedHeroErrors.button || ''
        urlObj = this.state.savedHeroElems.url || ''
        urlErrors = this.state.savedHeroErrors.url || ''
      } else {
        highlightObj = [];
        highlightErrors = [];
        buttonObj = ''
        buttonErrors = ''
        urlObj = ''
        urlErrors = ''
      }
      this.setState({
        savedHeroElems: this.state.frontMatter.sections[0].hero,
        savedHeroErrors: {
          dropdown: this.state.errors.sections[0].hero.dropdown,
          dropdownElems: this.state.errors.dropdownElems
        },
      });

      newSections = update(frontMatter.sections, {
        0: {
          hero: {
            dropdown: {
              $set: '',
            },
            key_highlights: {
              $set: highlightObj,
            },
            button: {
              $set: buttonObj,
            },
            url: {
              $set: urlObj,
            },
          },
        },
      });

      newErrors = update(errors, {
        dropdownElems: {
          $set: [],
        },
        highlights: {
          $set: highlightErrors,
        },
        sections: {
          0: {
            hero: {
              dropdown: {
                $set: '',
              },
              button: {
                $set: buttonErrors,
              },
              url: {
                $set: urlErrors,
              },
            },
          },
        },
      });
    } else {
      if (frontMatter.sections[0].hero.dropdown) return
      let dropdownObj, dropdownErrors, dropdownElemErrors
      if (this.state.savedHeroElems) {
        dropdownObj = this.state.savedHeroElems.dropdown || DropdownConstructor();
        dropdownErrors = this.state.savedHeroErrors.dropdown || ''
        dropdownElemErrors = this.state.savedHeroErrors.dropdownElems || ''
      } else {
        dropdownObj = DropdownConstructor();
        dropdownErrors = ''
        dropdownElemErrors = []
      }

      this.setState({
        savedHeroElems: this.state.frontMatter.sections[0].hero,
        savedHeroErrors: {
          highlights: this.state.errors.highlights,
          button: this.state.errors.sections[0].hero.button,
          url: this.state.errors.sections[0].hero.url,
        },
      });

      newSections = update(frontMatter.sections, {
        0: {
          hero: {
            button: {
              $set: '',
            },
            url: {
              $set: '',
            },
            key_highlights: {
              $set: '',
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
                $set: '',
              },
              url: {
                $set: '',
              },
              dropdown: {
                $set: dropdownErrors,
              },
            },
          },
        },
        highlights: {
          $set: '',
        },
        dropdownElems: {
          $set: dropdownElemErrors
        }
      });
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
          const newDisplaySections = update(displaySections, {
            [sectionId]: {
              $set: !displaySections[sectionId],
            },
          });

          this.setState({
            displaySections: newDisplaySections,
          });
          break;
        }
        case 'highlight': {
          const { displayHighlights } = this.state;
          const highlightIndex = idArray[1];
          const newDisplayHighlights = update(displayHighlights, {
            [highlightIndex]: {
              $set: !displayHighlights[highlightIndex],
            },
          });

          this.setState({
            displayHighlights: newDisplayHighlights,
          });
          break;
        }
        case 'dropdownelem': {
          const { displayDropdownElems } = this.state;
          const dropdownsIndex = idArray[1];
          const newDisplayDropdownElems = update(displayDropdownElems, {
            [dropdownsIndex]: {
              $set: !displayDropdownElems[dropdownsIndex],
            },
          });

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
      let filteredFrontMatter = _.cloneDeep(state.frontMatter)
      // Filter out components which have no input
      filteredFrontMatter.sections = state.frontMatter.sections.map((section) => {
        let newSection = {}
        for (const sectionName in section) {
          newSection[sectionName] = _.cloneDeep(_.omitBy(section[sectionName], _.isEmpty))
        }
        return newSection
      })
      const content = concatFrontMatterMdBody(filteredFrontMatter, '');
      const base64EncodedContent = Base64.encode(content);

      const params = {
        content: base64EncodedContent,
        sha: state.sha,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to save your homepage. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
      console.log(err);
      this.setState({shouldRedirect: true})
    }
  }

  onDragEnd = (result) => {
    const { source, destination, type } = result;
    const {
      frontMatter, errors, displaySections, displayDropdownElems, displayHighlights,
    } = this.state;

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

        const displayBool = displaySections[source.index];
        const newDisplaySections = update(displaySections, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        });

        this.setState({
          displaySections: newDisplaySections,
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

        const displayBool = displayDropdownElems[source.index];
        const newDisplayDropdownElems = update(displayDropdownElems, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        });

        this.setState({
          displayDropdownElems: newDisplayDropdownElems,
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

        const displayBool = displayHighlights[source.index];
        const newDisplayHighlights = update(displayHighlights, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        });

        this.setState({
          displayHighlights: newDisplayHighlights,
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
      originalFrontMatter,
      hasResources,
      dropdownIsActive,
      displaySections,
      displayHighlights,
      displayDropdownElems,
      errors,
      itemPendingForDelete,
      sha,
    } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;

    const hasSectionErrors = _.some(errors.sections, (section) => {
      // Section is an object, e.g. { hero: {} }
      // _.keys(section) produces an array with length 1
      // The 0th element of the array contains the sectionType
      const sectionType = _.keys(section)[0];
      return _.some(section[sectionType], (errorMessage) => errorMessage.length > 0) === true;
    });

    const hasHighlightErrors = _.some(errors.highlights,
      (highlight) => _.some(highlight,
        (errorMessage) => errorMessage.length > 0) === true);

    const hasDropdownElemErrors = _.some(errors.dropdownElems,
      (dropdownElem) => _.some(dropdownElem,
        (errorMessage) => errorMessage.length > 0) === true);

    const hasErrors = hasSectionErrors || hasHighlightErrors || hasDropdownElemErrors;

    const isLeftInfoPic = (sectionIndex) => {
      // If the previous section in the list was not an infopic section
      // or if the previous section was a right infopic section, return true
      if (!frontMatter.sections[sectionIndex - 1].infopic
        || !isLeftInfoPic(sectionIndex - 1)) return true;

      return false;
    };

    return (
      <>
        {
          itemPendingForDelete.id
          && (
          <DeleteWarningModal
            onCancel={() => this.setState({ itemPendingForDelete: { id: null, type: '' } })}
            onDelete={() => { this.deleteHandler(itemPendingForDelete.id); this.setState({ itemPendingForDelete: { id: null, type: '' } }); }}
            type={itemPendingForDelete.type}
          />
          )
        }
        <Header
          title="Homepage"
          shouldAllowEditPageBackNav={JSON.stringify(originalFrontMatter) === JSON.stringify(frontMatter)}
          isEditPage="true"
          backButtonText="Back to My Workspace"
          backButtonUrl={`/sites/${siteName}/workspace`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <p><b>Site notification</b></p>
                <input
                  placeholder="Notification"
                  value={frontMatter.notification}
                  id="site-notification"
                  onChange={this.onFieldChange} />
                <span className={elementStyles.info}>
                  Note: Leave text field empty if you don’t need this notification bar
                </span>
              </div>

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
                                dropdown={section.hero.dropdown ? section.hero.dropdown : null}
                                sectionIndex={sectionIndex}
                                highlights={section.hero.key_highlights ? section.hero.key_highlights : []}
                                onFieldChange={this.onFieldChange}
                                createHandler={this.createHandler}
                                deleteHandler={(event, type) => this.setState({ itemPendingForDelete: { id: event.target.id, type } })}
                                shouldDisplay={displaySections[sectionIndex]}
                                displayHighlights={displayHighlights}
                                displayDropdownElems={displayDropdownElems}
                                displayHandler={this.displayHandler}
                                onDragEnd={this.onDragEnd}
                                errors={errors}
                                siteName={siteName}
                                handleHighlightDropdownToggle={this.handleHighlightDropdownToggle}
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
                                    deleteHandler={(event) => this.setState({ itemPendingForDelete: { id: event.target.id, type: 'Resources Section' } })}
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
                                    deleteHandler={(event) => this.setState({ itemPendingForDelete: { id: event.target.id, type: 'Infobar Section' } })}
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
                          {section.infopic ? (
                            <Draggable
                              draggableId={`infopic-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorInfopicSection
                                    key={`section-${sectionIndex}`}
                                    title={section.infopic.title}
                                    subtitle={section.infopic.subtitle}
                                    description={section.infopic.description}
                                    button={section.infopic.button}
                                    url={section.infopic.url}
                                    imageUrl={section.infopic.image}
                                    imageAlt={section.infopic.alt}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(event) => this.setState({ itemPendingForDelete: { id: event.target.id, type: 'Infopic Section' } })}
                                    onFieldChange={this.onFieldChange}
                                    shouldDisplay={displaySections[sectionIndex]}
                                    displayHandler={this.displayHandler}
                                    errors={errors.sections[sectionIndex].infopic}
                                    siteName={siteName}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : (
                            null
                          )}

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
          <div className={editorStyles.homepageEditorMain}>
            {/* Isomer Template Pane */}
            {/* Notification */}
            { frontMatter.notification && 
            <div className="bp-notification bg-secondary is-marginless">
              <div className="bp-container">
                <div className="row">
                  <div className="col">
                    <div className="field has-addons bp-notification-flex">
                      <div className="control has-text-centered has-text-white">
                        <h6>{ frontMatter.notification }</h6>
                      </div>
                      <div className="button has-text-white">
                        <span className="sgds-icon sgds-icon-cross"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
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
                        button={section.infobar.button}
                        sectionIndex={sectionIndex}
                      />
                    </div>
                  )
                  : null}
                {/* Infopic section */}
                {section.infopic
                  ? (
                    <div ref={(ref) => { this.scrollRefs[sectionIndex] = ref; }}>
                      { isLeftInfoPic(sectionIndex)
                        ? (
                          <TemplateInfopicLeftSection
                            key={`section-${sectionIndex}`}
                            title={section.infopic.title}
                            subtitle={section.infopic.subtitle}
                            description={section.infopic.description}
                            imageUrl={section.infopic.image}
                            imageAlt={section.infopic.alt}
                            button={section.infopic.button}
                            sectionIndex={sectionIndex}
                            siteName={siteName}
                          />
                        )
                        : (
                          <TemplateInfopicRightSection
                            key={`section-${sectionIndex}`}
                            title={section.infopic.title}
                            subtitle={section.infopic.subtitle}
                            description={section.infopic.description}
                            imageUrl={section.infopic.image}
                            imageAlt={section.infopic.alt}
                            button={section.infopic.button}
                            sectionIndex={sectionIndex}
                            siteName={siteName}
                          />
                        )}
                    </div>
                  )
                  : null}
              </>
            ))}
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <LoadingButton
              label="Save"
              disabled={hasErrors}
              disabledStyle={elementStyles.disabled}
              className={(hasErrors || !sha) ? elementStyles.disabled : elementStyles.blue}
              callback={this.savePage}
            />
          </div>
        </div>
        {
          this.state.shouldRedirect &&
          <Redirect
            to={{
                pathname: '/not-found'
            }}
          />
        }
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
