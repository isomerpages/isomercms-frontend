import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../styles/App.module.scss';
import '../styles/isomer-template.scss';
import TemplateHeroSection from '../templates/homepage/HeroSection';
import TemplateInfobarSection from '../templates/homepage/InfobarSection';
import TemplateResourcesSection from '../templates/homepage/ResourcesSection';
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';
import {
  EditorInfobarSection, EditorResourcesSection, EditorHeroSection, NewSectionCreator,
} from '../components/editor/Homepage';

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
    this.createHighlight = this.createHighlight.bind(this);
    this.deleteHighlight = this.deleteHighlight.bind(this);
    this.createSection = this.createSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.createHeroDropdown = this.createHeroDropdown.bind(this);
    this.deleteHeroDropdown = this.deleteHeroDropdown.bind(this);
    this.createHeroDropdownElem = this.createHeroDropdownElem.bind(this);
    this.deleteHeroDropdownElem = this.deleteHeroDropdownElem.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
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

      // Compute hasResources
      let hasResources = false;
      frontMatter.sections.forEach((section) => {
        if (section.resources) hasResources = true;
      });

      this.setState({ frontMatter, sha, hasResources });
    } catch (err) {
      console.log(err);
    }
  }

  onFieldChange = async (event) => {
    try {
      const { state } = this;
      const { id, value } = event.target;
      const idArray = id.split('-');

      if (idArray[0] === 'site') {
        // The field that changed belongs to a site-wide config
        const field = idArray[1]; // e.g. "title" or "subtitle"

        this.setState((currState) => ({
          ...currState,
          frontMatter: {
            ...currState.frontMatter,
            [field]: value,
          },
        }));
      } else if (idArray[0] === 'section') {
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
      } else if (idArray[0] === 'highlight') {
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
      } else if (idArray[0] === 'dropdownelem') {
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
      } else {
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
      }
    } catch (err) {
      console.log(err);
    }
  }

  deleteHeroDropdown = async () => {
    try {
      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
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

      await this.setState((currState) => ({
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

  createHeroDropdown = async () => {
    try {
      const dropdownObj = DropdownConstructor();

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
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

  deleteHeroDropdownElem = async (event) => {
    try {
      const { id } = event.target;

      // Verify that the target id is of the format `dropdownelem-${dropdownsIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'dropdownelem') throw new Error('');
      const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT);

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
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

  createHeroDropdownElem = async (event) => {
    try {
      const { id } = event.target;

      // Verify that the target id is of the format `dropdownelem-${dropdownsIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'dropdownelem') throw new Error('');
      const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT) + 1;
      const dropdownElem = DropdownElemConstructor();

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
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

  createHighlight = async (event) => {
    try {
      const { id } = event.target;

      // Verify that the target id is of the format `highlight-${highlightIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'highlight') throw new Error('');
      const highlightIndex = parseInt(idArray[1], 10) + 1;
      const keyHighlight = KeyHighlightConstructor();

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
        0: {
          hero: {
            key_highlights: {
              $splice: [[highlightIndex, 0, keyHighlight]],
            },
          },
        },
      });

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

  deleteHighlight = async (event) => {
    try {
      const { id } = event.target;

      // Verify that the target id is of the format `highlight-${highlightIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'highlight') throw new Error('');
      const highlightIndex = parseInt(idArray[1], 10);

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
        0: {
          hero: {
            key_highlights: {
              $splice: [[highlightIndex, 1]],
            },
          },
        },
      });

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

  createSection = async (event) => {
    try {
      const { id, value } = event.target;

      // Verify that the target id is of the format `section-${sectionIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'section') throw new Error('');
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT) + 1;
      const sectionType = enumSection(value);

      // The Isomer site can only have 1 resources section in the homepage
      // Set hasResources to prevent the creation of more resources sections
      if (value === 'resources') {
        this.setState({ hasResources: true });
      }

      const { frontMatter } = this.state;
      const newSections = update(frontMatter.sections, {
        $splice: [[sectionIndex, 0, sectionType]],
      });

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

  deleteSection = async (event) => {
    try {
      const { id } = event.target;
      const { frontMatter } = this.state;

      // Verify that the target id is of the format `section-${sectionIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'section') throw new Error('');
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT);

      // Set hasResources to false to allow users to create a resources section
      if (frontMatter.sections[sectionIndex].resources) {
        this.setState({ hasResources: false });
      }

      const newSections = update(frontMatter.sections, {
        $splice: [[sectionIndex, 1]],
      });

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
    const { source, destination } = result;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    const { frontMatter } = this.state;
    const draggedElem = frontMatter.sections[source.index];

    this.setState((currState) => ({
      ...currState,
      frontMatter: {
        ...currState.frontMatter,
        sections: update(currState.frontMatter.sections, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedElem], // Splice elem into its new position
          ],
        }),
      },
    }));
  }

  render() {
    const { frontMatter, hasResources, dropdownIsActive } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;
    return (
      <>
        <h3>
          Editing homepage
        </h3>
        <div className="d-flex">
          <div className={`p-3 ${styles.leftPaneHomepage}`}>
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
            {/* Homepage section configurations */}
            <div className={styles.card}>
              <p><b>Site notification</b></p>
              <input placeholder="Notification" defaultValue={frontMatter.notification} value={frontMatter.notification} id="site-notification" onChange={this.onFieldChange} />
            </div>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="leftPane">
                {(droppableProvided) => (
                  /* eslint-disable react/jsx-props-no-spreading */
                  <div
                    className={styles.card}
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.droppableProps}
                  >
                    {frontMatter.sections.map((section, sectionIndex) => (
                      <>
                        {/* Hero section */}
                        {section.hero ? (
                          <>
                            <EditorHeroSection
                              title={section.hero.title}
                              subtitle={section.hero.subtitle}
                              background={section.hero.background}
                              button={section.hero.button}
                              url={section.hero.url}
                              dropdown={section.hero.dropdown}
                              sectionIndex={sectionIndex}
                              highlights={section.hero.key_highlights}
                              deleteHighlight={this.deleteHighlight}
                              createHighlight={this.createHighlight}
                              createHeroDropdownElem={this.createHeroDropdownElem}
                              deleteHeroDropdownElem={this.deleteHeroDropdownElem}
                              createHeroDropdown={this.createHeroDropdown}
                              deleteHeroDropdown={this.deleteHeroDropdown}
                              onFieldChange={this.onFieldChange}
                            />
                            <NewSectionCreator
                              sectionIndex={sectionIndex}
                              hasResources={hasResources}
                              createSection={this.createSection}
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
                                  title={section.resources.title}
                                  subtitle={section.resources.subtitle}
                                  button={section.resources.button}
                                  sectionIndex={sectionIndex}
                                  deleteSection={this.deleteSection}
                                  onFieldChange={this.onFieldChange}
                                />
                                <NewSectionCreator
                                  sectionIndex={sectionIndex}
                                  hasResources={hasResources}
                                  createSection={this.createSection}
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
                                  title={section.infobar.title}
                                  subtitle={section.infobar.subtitle}
                                  description={section.infobar.description}
                                  button={section.infobar.button}
                                  url={section.infobar.url}
                                  sectionIndex={sectionIndex}
                                  deleteSection={this.deleteSection}
                                  onFieldChange={this.onFieldChange}
                                />
                                <NewSectionCreator
                                  sectionIndex={sectionIndex}
                                  hasResources={hasResources}
                                  createSection={this.createSection}
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
                  /* eslint-enable react/jsx-props-no-spreading */
                )}
              </Droppable>
            </DragDropContext>
            <button type="button" onClick={this.savePage}>Save</button>
          </div>
          <div className={styles.rightPaneHomepage}>
            {/* Isomer Template Pane */}
            {frontMatter.sections.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero
                  ? (
                    <TemplateHeroSection
                      hero={section.hero}
                      siteName={siteName}
                      dropdownIsActive={dropdownIsActive}
                      toggleDropdown={this.toggleDropdown}
                    />
                  )
                  : null}
                {/* Resources section */}
                {section.resources
                  ? (
                    <TemplateResourcesSection
                      title={section.resources.title}
                      subtitle={section.resources.subtitle}
                      button={section.resources.button}
                      sectionIndex={sectionIndex}
                    />
                  )
                  : null}
                {/* Infobar section */}
                {section.infobar
                  ? (
                    <TemplateInfobarSection
                      title={section.infobar.title}
                      subtitle={section.infobar.subtitle}
                      description={section.infobar.description}
                      url={section.infobar.url}
                      button={section.infobar.button}
                      sectionIndex={sectionIndex}
                    />
                  )
                  : null}
              </>
            ))}
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
