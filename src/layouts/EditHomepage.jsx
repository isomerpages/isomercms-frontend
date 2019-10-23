import React, { Component } from 'react';
// import { Link } from "react-router-dom";
import axios from 'axios';
import base64 from 'base-64';
import PropTypes from 'prop-types';
import yaml from 'js-yaml';
import fm from 'front-matter';
import styles from '../styles/App.module.scss';

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
      const base64DecodedContent = base64.decode(content);
      const markdownObject = fm(base64DecodedContent);
      const frontmatter = yaml.safeLoad(markdownObject.frontmatter);
      this.setState({ frontmatter, sha });
    } catch (err) {
      console.log(err);
    }
  }

  onFieldChange = async (event) => {
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
      }));
    }
  }

  createSection = async () => {
    // TO-DO
  }

  deleteSection = async () => {
    // TO-DO
  }

  savePage = async () => {
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;
      const frontmatter = yaml.safeDump(state.frontmatter);
      const content = `---\n${frontmatter}\n---`;
      const base64EncodedContent = base64.encode(content);

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
    return (
      <>
        <h3>
          Editing homepage
        </h3>
        {/* Site-wide configuration */}
        <div className={styles.card}>
          <h4>
            <b>
            Site-wide configurations
            </b>
          </h4>
          <p>Site Title</p>
          <input placeholder="Title" defaultValue={frontmatter.title} id="site-title" onChange={this.onFieldChange} />
          <p>Site Subtitle</p>
          <input placeholder="Subtitle" defaultValue={frontmatter.subtitle} id="site-subtitle" onChange={this.onFieldChange} />
          <p>Site description</p>
          <input placeholder="Description" defaultValue={frontmatter.description} id="site-description" onChange={this.onFieldChange} />
          <p>Site image</p>
          <input placeholder="Image" defaultValue={frontmatter.image} id="site-image" onChange={this.onFieldChange} />
          <p>Site notification</p>
          <input placeholder="Notification" defaultValue={frontmatter.notification} id="site-notification" onChange={this.onFieldChange} />
        </div>
        {/* Homepage section configurations */}
        <div className={styles.card}>
          {frontmatter.sections.map((section, sectionIndex) => (
            <>
              {/* Hero section */}
              {section.hero ? (
                <>
                  <b>Hero section</b>
                  <p>Hero title</p>
                  <input placeholder="Hero title" defaultValue={section.hero.title} id={`section-${sectionIndex}-hero-title`} onChange={this.onFieldChange} />
                  <p>Hero subtitle</p>
                  <input placeholder="Hero subtitle" defaultValue={section.hero.subtitle} id={`section-${sectionIndex}-hero-subtitle`} onChange={this.onFieldChange} />
                  <p>Hero background image</p>
                  <input placeholder="Hero background image" defaultValue={section.hero.background} id={`section-${sectionIndex}-hero-background`} onChange={this.onFieldChange} />
                  <p>Hero button</p>
                  <input placeholder="Hero button name" defaultValue={section.hero.button} id={`section-${sectionIndex}-hero-button`} onChange={this.onFieldChange} />
                  <p>Hero button URL</p>
                  <input placeholder="Hero button URL" defaultValue={section.hero.url} id={`section-${sectionIndex}-hero-url`} onChange={this.onFieldChange} />

                  <div className={styles.card}>
                    {section.hero.key_highlights ? (
                      <>
                        <b>Hero highlights</b>
                        {section.hero.key_highlights.map((highlight, highlightIndex) => (
                          <div className={styles.card}>
                            <b>
Highlight
                              {highlightIndex}
                            </b>
                            <p>Highlight title</p>
                            <input placeholder="Highlight title" defaultValue={highlight.title} id={`highlight-${highlightIndex}-title`} onChange={this.onFieldChange} />
                            <p>Highlight description</p>
                            <input placeholder="Highlight description" defaultValue={highlight.description} id={`highlight-${highlightIndex}-description`} onChange={this.onFieldChange} />
                            <p>Highlight URL</p>
                            <input placeholder="Highlight URL" defaultValue={highlight.url} id={`highlight-${highlightIndex}-url`} onChange={this.onFieldChange} />
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
                  <b>Resources section</b>
                  <p>Resources section title</p>
                  <input placeholder="Resource section title" defaultValue={section.resources.title} id={`section-${sectionIndex}-resources-title`} onChange={this.onFieldChange} />
                  <p>Resources section subtitle</p>
                  <input placeholder="Resource section subtitle" defaultValue={section.resources.subtitle} id={`section-${sectionIndex}-resources-subtitle`} onChange={this.onFieldChange} />
                  <p>Resources button name</p>
                  <input placeholder="Resource button name" defaultValue={section.resources.button} id={`section-${sectionIndex}-resources-button`} onChange={this.onFieldChange} />
                </div>
              ) : (
                null
              )}

              {/* Infobar section */}
              {section.infobar ? (
                <div className={styles.card}>
                  <b>Infobar section</b>
                  <p>Infobar title</p>
                  <input placeholder="Infobar title" defaultValue={section.infobar.title} id={`section-${sectionIndex}-infobar-title`} onChange={this.onFieldChange} />
                  <p>Infobar subtitle</p>
                  <input placeholder="Infobar subtitle" defaultValue={section.infobar.subtitle} id={`section-${sectionIndex}-infobar-subtitle`} onChange={this.onFieldChange} />
                  <p>Infobar description</p>
                  <input placeholder="Infobar description" defaultValue={section.infobar.description} id={`section-${sectionIndex}-infobar-description`} onChange={this.onFieldChange} />
                  <p>Infobar button name</p>
                  <input placeholder="Infobar button name" defaultValue={section.infobar.button} id={`section-${sectionIndex}-infobar-button`} onChange={this.onFieldChange} />
                  <p>Infobar button URL</p>
                  <input placeholder="Infobar button URL" defaultValue={section.infobar.url} id={`section-${sectionIndex}-infobar-url`} onChange={this.onFieldChange} />
                </div>
              ) : (
                null
              )}

              {/* Infopic section */}
              {/* TO-DO */}

              {/* Carousel section */}
              {/* TO-DO */}
            </>
          ))}
        </div>
        <button type="button" onClick={this.savePage}>Save</button>
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
