import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import styles from '../styles/App.module.scss';
import update from 'immutability-helper';
import '../styles/isomer-template.scss';
import TemplateHeroSection from '../templates/homepage/HeroSection'
import TemplateInfobarSection from '../templates/homepage/InfobarSection'
import TemplateResourcesSection from '../templates/homepage/ResourcesSection'
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';
import { EditorInfobarSection, EditorResourcesSection, EditorHeroSection } from '../components/editor/Homepage'

// Section constructors
const ResourcesSectionConstructor = () => {
  return {
    resources: {
      title: 'TITLE',
      subtitle: 'SUBTITLE',
      button: 'BUTTON'
    }
  }
}

const InfobarSectionConstructor = () => {
  return {
    infobar: {
      title: 'TITLE',
      subtitle: 'SUBTITLE',
      description: 'DESCRIPTION',
      button: 'BUTTON',
      url: 'URL'
    }
  }
}

const KeyHighlightConstructor = () => {
  return {
    title: 'TITLE',
    description: 'DESCRIPTION',
    url: 'URL'
  }
}

const enumSection = (type) => {
  switch(type) {
    case 'resources':
      return ResourcesSectionConstructor()
    case 'infobar':
      return InfobarSectionConstructor()
    default:
      return InfobarSectionConstructor()
  }
}

export default class EditHomepage extends Component {
  constructor(props) {
    super(props);
    this.createHighlight = this.createHighlight.bind(this)
    this.deleteHighlight = this.deleteHighlight.bind(this)
    this.createSection = this.createSection.bind(this)
    this.deleteSection = this.deleteSection.bind(this)
    this.onFieldChange = this.onFieldChange.bind(this)
    this.state = {
      frontmatter: {
        title: '',
        subtitle: '',
        description: '',
        image: '',
        notification: '',
        sections: [],
      },
      sha: null,
      hasResources: false,
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
      const { frontMatter: frontmatter } = frontMatterParser(base64DecodedContent);

      // Compute hasResources 
      let hasResources = false
      frontmatter.sections.forEach(section => {
        if (section.resources) hasResources = true
      })

      this.setState({ frontmatter, sha, hasResources });
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
          frontmatter: {
            ...currState.frontmatter,
            [field]: value,
          },
        }));
      } else if (idArray[0] === 'section') {
        // The field that changed belongs to a homepage section config
        const { sections } = state.frontmatter;
  
        // sectionIndex is the index of the section array in the frontmatter
        const sectionIndex = parseInt(idArray[1], 10);
        const sectionType = idArray[2]; // e.g. "hero" or "infobar" or "resources"
        const field = idArray[3]; // e.g. "title" or "subtitle"
  
        sections[sectionIndex][sectionType][field] = value;
  
        this.setState((currState) => ({
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections,
          },
        }));
      } else {
        // The field that changed belongs to a hero highlight
        const { sections } = state.frontmatter;
        const highlights = state.frontmatter.sections[0].hero.key_highlights;
  
        // highlightsIndex is the index of the key_highlights array
        const highlightsIndex = parseInt(idArray[1], 10);
        const field = idArray[2]; // e.g. "title" or "url"

        highlights[highlightsIndex][field] = value;
        sections[0].hero.key_highlights = highlights;

        this.setState((currState) => ({
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections,
          },
        }), () => console.log(this.state));
      }
    } catch (err) {
      console.log(err)
    }
  }
  
  createHighlight = async (event) => {
    try {
      const { id } = event.target

      // Verify that the target id is of the format `highlight-${highlightIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'highlight') throw new Error('')
      const highlightIndex = parseInt(idArray[1]) + 1
      const keyHighlight = KeyHighlightConstructor()

      const { frontmatter } = this.state
      const newSections = update(frontmatter.sections, {
        0: {
          hero: {
            key_highlights: {
              $splice: [[highlightIndex, 0, keyHighlight]]
            }
          }
        }
      })

      this.setState((currState) => {
        return {
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections: newSections
          }
        }
      })

    } catch (err) {
      console.log(err)
    }
  }

  deleteHighlight = async (event) => {
    try {
      const { id } = event.target

      // Verify that the target id is of the format `highlight-${highlightIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'highlight') throw new Error('')
      const highlightIndex = parseInt(idArray[1])

      const { frontmatter } = this.state
      const newSections = update(frontmatter.sections, {
        0: {
          hero: {
            key_highlights: {
              $splice: [[highlightIndex, 1]]
            }
          }
        }
      })
  
      await this.setState((currState) => {
        return {
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections: newSections
          }
        }
      })

    } catch (err) {
      console.log(err)
    }
  }

  createSection = async (event) => {
    try {
      const { id, value } = event.target

      // Verify that the target id is of the format `section-${sectionIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'section') throw new Error('')
      const sectionIndex = parseInt(idArray[1]) + 1
      const sectionType = enumSection(value)

      // The Isomer site can only have 1 resources section in the homepage
      // Set hasResources to prevent the creation of more resources sections
      if (value === 'resources') {
        this.setState({hasResources: true})
      }

      const { frontmatter } = this.state
      const newSections = update(frontmatter.sections, {
        $splice: [[sectionIndex, 0, sectionType]]
      })

      this.setState((currState) => {
        return {
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections: newSections
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  deleteSection = async (event) => {
    try {
      const { id, value } = event.target

      // Verify that the target id is of the format `section-${sectionIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'section') throw new Error('')
      const sectionIndex = parseInt(idArray[1])

      // Set hasResources to false to allow users to create a resources section
      if (this.state.frontmatter.sections[sectionIndex].resources) {
        this.setState({hasResources: false})
      }

      const { frontmatter } = this.state
      const newSections = update(frontmatter.sections, {
        $splice: [[sectionIndex, 1]]
      })

      this.setState((currState) => {
        return {
          ...currState,
          frontmatter: {
            ...currState.frontmatter,
            sections: newSections
          }
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  savePage = async () => {
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;
      const frontmatter = yaml.safeDump(state.frontmatter);
      const content = concatFrontMatterMdBody(frontmatter);
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

  render() {
    const { frontmatter, hasResources } = this.state;
    const { siteName } = this.props.match.params;
    return (
      <>
        <h3>
          Editing homepage
        </h3>
        <div className="d-flex">
          <div className={`p-3 ${styles.leftPane}`}>
            {/* Site-wide configuration */}
            {/* <div className={styles.card}>
              <h4>
                <b>
                Site-wide configurations
                </b>
              </h4>
              <p>Site Title</p>
              <input placeholder="Title" defaultValue={frontmatter.title} value={frontmatter.title} id="site-title" onChange={this.onFieldChange} />
              <p>Site Subtitle</p>
              <input placeholder="Subtitle" defaultValue={frontmatter.subtitle} value={frontmatter.subtitle} id="site-subtitle" onChange={this.onFieldChange} />
              <p>Site description</p>
              <input placeholder="Description" defaultValue={frontmatter.description} value={frontmatter.description} id="site-description" onChange={this.onFieldChange} />
              <p>Site image</p>
              <input placeholder="Image" defaultValue={frontmatter.image} value={frontmatter.image} id="site-image" onChange={this.onFieldChange} />
            </div> */}
            {/* Homepage section configurations */}
            <div className={styles.card}>
              <p><b>Site notification</b></p>
              <input placeholder="Notification" defaultValue={frontmatter.notification} value={frontmatter.notification} id="site-notification" onChange={this.onFieldChange} />
            </div>
            <div className={styles.card}>
              {frontmatter.sections.map((section, sectionIndex) => (
                <>
                  {/* Hero section */}
                  {section.hero ? (
                    <EditorHeroSection
                      title={section.hero.title}
                      subtitle={section.hero.subtitle}
                      background={section.hero.background}
                      button={section.hero.button}
                      url={section.hero.url}
                      sectionIndex={sectionIndex}
                      highlights={section.hero.key_highlights}
                      deleteHighlight={this.deleteHighlight}
                      createHighlight={this.createHighlight}
                      onFieldChange={this.onFieldChange}
                    />
                  ) : (
                    null
                  )}

                  {/* Resources section */}
                  {section.resources ? (
                    <EditorResourcesSection 
                      title={section.resources.title}
                      subtitle={section.resources.subtitle}
                      button={section.resources.button}
                      sectionIndex={sectionIndex}
                      deleteSection={this.deleteSection}
                      onFieldChange={this.onFieldChange}
                    />
                  ) : (
                    null
                  )}

                  {/* Infobar section */}
                  {section.infobar ? (
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
                  ) : (
                    null
                  )}

                  {/* Infopic section */}
                  {/* TO-DO */}

                  {/* Carousel section */}
                  {/* TO-DO */}

                  Create new section
                  <br />
                  <select name="newSection" id={`section-${sectionIndex}-new`} onChange={this.createSection}>
                    <option value="">--Please choose a new section--</option>
                    <option value="infobar">Infobar</option>
                    {/* If homepage already has a Resources section, don't display the option to create one */}
                    {this.state.hasResources ?
                      null
                      :
                      <option value="resources">Resources</option>
                    }
                </select>
                </>
              ))}
            </div>
            <button type="button" onClick={this.savePage}>Save</button>
          </div>
          <div className={styles.rightPane}>
            {/* Isomer Template Pane */}
            {frontmatter.sections.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero ? 
                  <TemplateHeroSection 
                    hero={section.hero} 
                    siteName={siteName}
                  />
                  :
                  null
                }
                {/* Resources section */}
                {section.resources ? 
                  <TemplateResourcesSection 
                    title={section.resources.title} 
                    subtitle={section.resources.subtitle} 
                    button={section.resources.button} 
                    sectionIndex={sectionIndex}
                  />
                  :
                  null
                }
                {/* Infobar section */}
                {section.infobar ? 
                  <TemplateInfobarSection 
                    title={section.infobar.title} 
                    subtitle={section.infobar.subtitle}
                    description={section.infobar.description} 
                    url={section.infobar.url} 
                    button={section.infobar.button}
                    sectionIndex={sectionIndex}
                  />
                  :
                  null
                }
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
