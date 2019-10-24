import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import styles from '../styles/App.module.scss';
import update from 'immutability-helper';
import '../styles/isomer-template.scss';
import TemplateHero from '../templates/homepage/Hero.jsx'
import TemplateInfoBar from '../templates/homepage/Infobar.jsx'
import TemplateResourcesSection from '../templates/homepage/ResourcesSection'
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';

// Section constructors
const ResourcesSection = () => {
  return {
    resources: {
      title: 'TITLE',
      subtitle: 'SUBTITLE',
      button: 'BUTTON'
    }
  }
}

const InfoBarSection = () => {
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

const KeyHighlightSection = () => {
  return {
    title: 'TITLE',
    description: 'DESCRIPTION',
    url: 'URL'
  }
}

const enumSection = (type) => {
  switch(type) {
    case (type === 'resources'):
      return ResourcesSection()
    case (type === 'infobar'):
      return InfoBarSection()
    default:
      return ResourcesSection()
  }
}

export default class EditHomepage extends Component {
  constructor(props) {
    super(props);
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
      console.log(frontmatter, "FRONTMATTER")
      this.setState({ frontmatter, sha });
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
      const keyHighlight = KeyHighlightSection()

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
      const { id } = event.target

      // Verify that the target id is of the format `section-${sectionIndex}`
      const idArray = id.split('-');
      if (idArray[0] !== 'section') throw new Error('')
      const sectionIndex = parseInt(idArray[1])

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
    const { frontmatter } = this.state;
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
                    <>
                      <p><b>Hero section</b></p>
                      <p>Hero title</p>
                      <input placeholder="Hero title" defaultValue={section.hero.title} value={section.hero.title} id={`section-${sectionIndex}-hero-title`} onChange={this.onFieldChange} />
                      <p>Hero subtitle</p>
                      <input placeholder="Hero subtitle" defaultValue={section.hero.subtitle} value={section.hero.subtitle} id={`section-${sectionIndex}-hero-subtitle`} onChange={this.onFieldChange} />
                      <p>Hero background image</p>
                      <input placeholder="Hero background image" defaultValue={section.hero.background} value={section.hero.background} id={`section-${sectionIndex}-hero-background`} onChange={this.onFieldChange} />
                      <p>Hero button</p>
                      <input placeholder="Hero button name" defaultValue={section.hero.button} value={section.hero.button} id={`section-${sectionIndex}-hero-button`} onChange={this.onFieldChange} />
                      <p>Hero button URL</p>
                      <input placeholder="Hero button URL" defaultValue={section.hero.url} value={section.hero.url} id={`section-${sectionIndex}-hero-url`} onChange={this.onFieldChange} />

                      <div className={styles.card}>
                        {section.hero.key_highlights ? (
                          <>
                            <b>Hero highlights</b>
                            {section.hero.key_highlights.map((highlight, highlightIndex) => (
                              <div className={styles.card} key={highlightIndex}>
                                <b>Highlight {highlightIndex}</b>
                                <p>Highlight title</p>
                                <input placeholder="Highlight title" defaultValue={highlight.title} value={highlight.title} id={`highlight-${highlightIndex}-title`} onChange={this.onFieldChange} key={`${highlightIndex}-title`}/>
                                <p>Highlight description</p>
                                <input placeholder="Highlight description" defaultValue={highlight.description} value={highlight.description} id={`highlight-${highlightIndex}-description`} onChange={this.onFieldChange} key={`${highlightIndex}-description`}/>
                                <p>Highlight URL</p>
                                <input placeholder="Highlight URL" defaultValue={highlight.url} value={highlight.url} id={`highlight-${highlightIndex}-url`} onChange={this.onFieldChange} key={`${highlightIndex}-url`}/>
                                {`${highlightIndex}-url`}
                                <button type="button" id={`highlight-${highlightIndex}-delete`} onClick={this.deleteHighlight} key={`${highlightIndex}-delete`}>Delete highlight</button>
                                <button type="button" id={`highlight-${highlightIndex}-create`} onClick={this.createHighlight} key={`${highlightIndex}-create`}>Create highlight</button>
                              </div>
                            ))}
                          </>
                        ) : (
                          null
                        )}
                      </div>
                    </>
                  ) : (
                    null
                  )}

                  {/* Resources section */}
                  {section.resources ? (
                    <div className={styles.card}>
                      <p><b>Resources section</b></p>
                      <p>Resources section title</p>
                      <input placeholder="Resource section title" defaultValue={section.resources.title} value={section.resources.title} id={`section-${sectionIndex}-resources-title`} onChange={this.onFieldChange} />
                      <p>Resources section subtitle</p>
                      <input placeholder="Resource section subtitle" defaultValue={section.resources.subtitle} value={section.resources.subtitle} id={`section-${sectionIndex}-resources-subtitle`} onChange={this.onFieldChange} />
                      <p>Resources button name</p>
                      <input placeholder="Resource button button" defaultValue={section.resources.button} value={section.resources.button} id={`section-${sectionIndex}-resources-button`} onChange={this.onFieldChange} />
                      <button type="button" id={`section-${sectionIndex}`} onClick={this.deleteSection}>Delete section</button>
                    </div>
                  ) : (
                    null
                  )}

                  {/* Infobar section */}
                  {section.infobar ? (
                    <div className={styles.card}>
                      <p><b>Infobar section</b></p>
                      <p>Infobar title</p>
                      <input placeholder="Infobar title" defaultValue={section.infobar.title} value={section.infobar.title} id={`section-${sectionIndex}-infobar-title`} onChange={this.onFieldChange} />
                      <p>Infobar subtitle</p>
                      <input placeholder="Infobar subtitle" defaultValue={section.infobar.subtitle} value={section.infobar.subtitle} id={`section-${sectionIndex}-infobar-subtitle`} onChange={this.onFieldChange} />
                      <p>Infobar description</p>
                      <input placeholder="Infobar description" defaultValue={section.infobar.description} value={section.infobar.description} id={`section-${sectionIndex}-infobar-description`} onChange={this.onFieldChange} />
                      <p>Infobar button name</p>
                      <input placeholder="Infobar button name" defaultValue={section.infobar.button} value={section.infobar.button} id={`section-${sectionIndex}-infobar-button`} onChange={this.onFieldChange} />
                      <p>Infobar button URL</p>
                      <input placeholder="Infobar button URL" defaultValue={section.infobar.url} value={section.infobar.url} id={`section-${sectionIndex}-infobar-url`} onChange={this.onFieldChange} />
                      <button type="button" id={`section-${sectionIndex}`} onClick={this.deleteSection}>Delete section</button>
                    </div>
                  ) : (
                    null
                  )}

                  {/* Infopic section */}
                  {/* TO-DO */}

                  {/* Carousel section */}
                  {/* TO-DO */}

                  Create new section
                  <select name="newSection" id={`section-${sectionIndex}-new`} onChange={this.createSection}>
                    <option value="">--Please choose a new section--</option>
                    <option value="infobar">Infobar</option>
                    <option value="resources">Resources</option>
                </select>
                </>
              ))}
            </div>
            <button type="button" onClick={this.savePage}>Save</button>
          </div>
          <div className={styles.rightPane}>
            {frontmatter.sections.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero ? 
                  <TemplateHero hero={section.hero} siteName={siteName}/>
                  :
                  null
                }
                {/* Resources section */}
                {section.resources ? 
                  <TemplateResourcesSection title={section.resources.title} subtitle={section.resources.subtitle} button={section.resources.button} sectionIndex={sectionIndex}/>
                  :
                  null
                }
                {/* Infobar section */}
                {section.infobar ? 
                  <TemplateInfoBar 
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
