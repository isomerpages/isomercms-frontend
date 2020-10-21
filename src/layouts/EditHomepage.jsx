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
import TemplateInfopicLeftSection from '../templates/homepage/InfopicLeftSection';
import TemplateInfopicRightSection from '../templates/homepage/InfopicRightSection';
import TemplateResourcesSection from '../templates/homepage/ResourcesSection';
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';
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
    url: isErrorConstructor ? '' : '/faq/',
  },
});

const InfopicSectionConstructor = (isErrorConstructor) => ({
  infopic: {
    title: isErrorConstructor ? '' : 'Infopic Title',
    subtitle: isErrorConstructor ? '' : 'Infopic Subtitle',
    description: isErrorConstructor ? '' : 'Infopic description',
    button: isErrorConstructor ? '' : 'Button Text',
    url: isErrorConstructor ? '' : '/faq/',
    imageUrl: isErrorConstructor ? '' : '/image/',
    imageAlt: isErrorConstructor ? '' : 'Image alt text',
  },
});

const KeyHighlightConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? '' : 'Key Highlight Title',
  description: isErrorConstructor ? '' : 'Key Highlight description',
  url: isErrorConstructor ? '' : '/faq/',
});

const DropdownElemConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? '' : 'Hero Dropdown Element Title',
  url: isErrorConstructor ? '' : '/faq/',
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
        case 'dropdown': {
          const dropdownObj = DropdownConstructor();

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
                    $set: '',
                  },
                },
              },
            },
            highlights: {
              $set: '',
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
        case 'dropdown': {
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  $set: '',
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
      console.log(err);
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
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <p>Page Title</p>
                <input
                  placeholder="Title"
                  defaultValue={frontMatter.title}
                  value={frontMatter.title}
                  id="site-title"
                  onChange={this.onFieldChange}
                />
                {/* Removing site description for now, since it only shows up as metadata
                <p>Site description</p>
                <input
                  placeholder="Description"
                  defaultValue={frontMatter.description}
                  value={frontMatter.description}
                  id="site-description"
                  onChange={this.onFieldChange}
                /> */}
              </div>
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
                                deleteHandler={(event, type) => this.setState({ itemPendingForDelete: { id: event.target.id, type } })}
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
                                    imageUrl={section.infopic.imageUrl}
                                    imageAlt={section.infopic.imageAlt}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(event) => this.setState({ itemPendingForDelete: { id: event.target.id, type: 'Infopic Section' } })}
                                    onFieldChange={this.onFieldChange}
                                    shouldDisplay={displaySections[sectionIndex]}
                                    displayHandler={this.displayHandler}
                                    errors={errors.sections[sectionIndex].infopic}
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
                            imageUrl={section.infopic.imageUrl}
                            imageAlt={section.infopic.imageAlt}
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
                            imageUrl={section.infopic.imageUrl}
                            imageAlt={section.infopic.imageAlt}
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
