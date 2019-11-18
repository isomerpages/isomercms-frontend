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
const RADIX_PARSE_INT = 10;

// Section constructors
const ResourcesSectionConstructor = () => ({
  resources: {
    title: 'TITLE',
    subtitle: 'SUBTITLE',
    button: 'BUTTON',
  },
});

const InfobarSectionConstructor = () => ({
  infobar: {
    title: 'TITLE',
    subtitle: 'SUBTITLE',
    description: 'DESCRIPTION',
    button: 'BUTTON',
    url: 'URL',
  },
});

const KeyHighlightConstructor = () => ({
  title: 'TITLE',
  description: 'DESCRIPTION',
  url: 'URL',
});

const DropdownElemConstructor = () => ({
  title: 'TITLE',
  url: 'URL',
});

const DropdownConstructor = () => ({
  title: 'TITLE',
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
      frontMatter.sections.forEach((section) => {
        // If this is the hero section, hide all highlights/dropdownelems by default
        if (section.hero) {
          const { dropdown, key_highlights: keyHighlights } = section.hero;
          if (dropdown) {
            // Go through section.hero.dropdown.options
            displayDropdownElems = _.fill(Array(dropdown.options.length), false);
          }
          if (keyHighlights) {
            displayHighlights = _.fill(Array(keyHighlights.length), false);
          }
        }

        // Minimize all sections by default
        displaySections.push(false);

        // Check if there is already a resources section
        if (section.resources) hasResources = true;
      });

      this.setState({
        frontMatter, sha, hasResources, displaySections, displayDropdownElems, displayHighlights,
      });
    } catch (err) {
      console.log(err);
    }
  }

  onFieldChange = async (event) => {
    try {
      const { state } = this;
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

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
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

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
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

          this.setState((currState) => ({
            ...currState,
            frontMatter: {
              ...currState.frontMatter,
              sections,
            },
          }));

          this.scrollRefs[0].scrollIntoView();
          break;
        }
        default: {
          // The field that changed is the dropdown placeholder title

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

      const { frontMatter } = this.state;
      let newSections = [];

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
          break;
        }
        case 'dropdownelem': {
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT) + 1;
          const dropdownElem = DropdownElemConstructor();

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    $splice: [[dropdownsIndex, 0, dropdownElem]],
                  },
                },
              },
            },
          });
          break;
        }
        case 'highlight': {
          const highlightIndex = parseInt(idArray[1], 10) + 1;
          const keyHighlight = KeyHighlightConstructor();

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                key_highlights: {
                  $splice: [[highlightIndex, 0, keyHighlight]],
                },
              },
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

      const { frontMatter } = this.state;
      let newSections = [];

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
    const { frontMatter } = this.state;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    let newSections = [];

    switch (type) {
      case 'editor': {
        const draggedElem = frontMatter.sections[source.index];
        newSections = update(frontMatter.sections, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedElem], // Splice elem into its new position
          ],
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
