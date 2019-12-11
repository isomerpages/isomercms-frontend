import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import Header from '../components/Header';
import '../styles/isomer-template.scss';
import { Base64 } from 'js-base64';
import { frontMatterParser, concatFrontMatterMdBody } from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';
import TemplateContactPage from '../templates/ContactPage'
import EditorContactPage from '../components/ContactPage'

/* eslint
  react/no-array-index-key: 0
 */

const CONTACT_US_FILENAME = 'Contact-Us.md'
// Section constructors
const LocationConstructor = () => ({
  title: '',
  address: [],
  operating_hours: [],
  maps_link: ''
});

const OperatingHoursConstructor = () => ({
  days: '',
  time: ''
})

const ContactConstructor = () => ({
  title: '',
  content: []
})

const ContactContentConstructor = () => ({
  phone: '',
  email: '',
  other: ''
})

const validateStatus = (status) => {
  return (status >= 200 && status < 300) || status === 400
}

export default class EditContactPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sha: '',
      frontMatter: {
        layout: 'contact-us',
        permalink: '/contact-us/',
        agencyName: '',
        // image: '',
        locations: [],
        contacts: []
      },
      errors: {
        // image: '',
        locations: [],
        contacts: []
      }
    }
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${CONTACT_US_FILENAME}`, {
        validateStatus: validateStatus,
        withCredentials: true,
      });

      // If the contact page exists
      if (resp.status >= 200 && resp.status < 300) {
        const { content, sha } = resp.data;
        // extract front matter
        const { frontMatter } = frontMatterParser(Base64.decode(content));
        let { locations, contacts, agencyName } = frontMatter
  
        // TO-DO: If agency name does not exist in file, retrieve site name from config
        // This is the default behavior in the template, but we can also make it such
        // that it is mandatory for users to fill in the `agency_name` field
  
        // const locationErrors = locations.map(location => {
        //   let locationObject = LocationConstructor()
  
        //   if (location.address && location.address.length > 0) {
        //     locationObject.address = location.address.map(address => )
        //   }
        // })
  
        const contactErrors = []
        this.setState({
          sha,
          frontMatter: {
            agencyName,
            locations,
            contacts
          },
          errors: {
            agencyName,
            locations,
            contacts
          }
        });
      }
    } catch (err) {
      console.log(err)
    }
  }

  savePage = async (event) => {
    event.preventDefault();
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const { state } = this;
      const { frontMatter } = state;
      const editorValue = ''

      // here, we need to re-add the front matter of the markdown file
      const upload = concatFrontMatterMdBody(frontMatter, editorValue);

      // encode to Base64 for github
      const base64Content = Base64.encode(upload);
      const params = {
        content: base64Content,
        sha: state.sha,
      };
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${CONTACT_US_FILENAME}`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  
  render() {
    const { match } = this.props;
    const { siteName } = match.params;
    const { frontMatter } = this.state;
    const { agencyName, locations, contacts } = frontMatter
    // TO-DO: define hasErrors
    const hasErrors = false;
    return (
      <>
        <Header
          title="Contact Us"
          backButtonText="Back to Pages"
          backButtonUrl={`/sites/${siteName}/pages`}
        />
        <form onSubmit={this.savePage} className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <EditorContactPage 
              agencyName={agencyName}
              locations={locations}
              contacts={contacts}
            />
          </div>
          <div className={editorStyles.homepageEditorMain}>
            <TemplateContactPage 
              agencyName={agencyName}
              locations={locations}
              contacts={contacts}
            />
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <button type="submit" className={hasErrors ? elementStyles.disabled : elementStyles.blue} disabled={hasErrors}>Save</button>
          </div>
        </form>
      </>
    )
  }
}