// TODO: Clean up formatting, semi-colons, PropTypes etc
import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { DragDropContext } from 'react-beautiful-dnd';
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify';

import { DEFAULT_ERROR_TOAST_MSG, frontMatterParser, concatFrontMatterMdBody, isEmpty, retrieveResourceFileMetadata } from '../utils';
import { sanitiseFrontMatter } from '../utils/dataSanitisers';
import { validateContact, validateLocation } from '../utils/validators';
import {
  createPageStyleSheet,
  getSiteColors,
} from '../utils/siteColorUtils';


import EditorSection from '../components/contact-us/Section';
import Toast from '../components/Toast';

import '../styles/isomer-template.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import editorStyles from '../styles/isomer-cms/pages/Editor.module.scss';

import Header from '../components/Header';
import LoadingButton from '../components/LoadingButton';
import FormField from '../components/FormField';

import TemplateContactUsHeader from '../templates/contact-us/ContactUsHeader';
import TemplateLocationsSection from '../templates/contact-us/LocationsSection'
import TemplateContactsSection from '../templates/contact-us/ContactsSection'
import TemplateFeedbackSection from '../templates/contact-us/FeedbackSection';

import DeleteWarningModal from '../components/DeleteWarningModal';

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

// Constants
// ==========
const RADIX_PARSE_INT = 10; 

// Constructors
const ContactFieldConstructor = () => ([ 
  {phone: ''}, 
  {email: ''}, 
  {other: ''},
]);

const LocationHoursFieldConstructor = () => ({
  days: '', 
  time: '', 
  description: ''
});

const ContactSectionConstructor = () => ({
  content: ContactFieldConstructor(),
  title: '',
});

const LocationSectionConstructor = (operatingHoursLength) => ({
  address: ['','',''],
  title: '',
  operating_hours: operatingHoursLength ? Array(operatingHoursLength).fill(LocationHoursFieldConstructor()) : [],
  maps_link: '',
});

const enumSection = (type, args) => {
  switch (type) {
    case 'contacts':
      return ContactSectionConstructor();
    case 'locations':
      return LocationSectionConstructor(args?.operatingHoursLength);
    case 'contact_field':
      return ContactFieldConstructor();
    case 'location_hours_field':
      return LocationHoursFieldConstructor();   
  }
};

export default class EditContactUs extends Component {
  _isMounted = false

  constructor(props) {
    super(props);
    this.scrollRefs = {
      sectionsScrollRefs: {
        locations: null,
        contacts: null,
        header: null,
        feedback: null,
      },
      contacts: [],
      locations: [],
    };
    this.state = {
      frontMatter: {},
      originalFrontMatter: {},
      frontMatterSha: null,
      footerContent: {},
      originalFooterContent: {},
      footerSha: null,
      displaySections: {
        sectionsDisplay: {
          locations: false,
          contacts: false,
        },
        contacts: [],
        locations: [],
      },
      errors: {
        contacts: [],
        locations: [],
      },
      itemPendingForDelete: {
        id: null,
        type: '',
      },
      shouldRedirectToNotFound: false,
    };
  }

  async componentDidMount() {
    const { match, siteColors, setSiteColors } = this.props;
    const { siteName } = match.params;
    this._isMounted = true

    let content, sha, footerContent, footerSha

    // Set page colors
    try {
      let primaryColor
      let secondaryColor

      if (!siteColors[siteName]) {
        const {
          primaryColor: sitePrimaryColor,
          secondaryColor: siteSecondaryColor,
        } = await getSiteColors(siteName)

        primaryColor = sitePrimaryColor
        secondaryColor = siteSecondaryColor

        if (this._isMounted) setSiteColors((prevState) => ({
          ...prevState,
          [siteName]: {
            primaryColor,
            secondaryColor,
          }
        }))
      } else {
        primaryColor = siteColors[siteName].primaryColor
        secondaryColor = siteColors[siteName].secondaryColor
      }

      createPageStyleSheet(siteName, primaryColor, secondaryColor)
    
    } catch (err) {
      console.log(err);
    }

    try {
      const contactUsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/contact-us.md`);
      const { content:pageContent , sha:pageSha } = contactUsResp.data;
      content = pageContent
      sha = pageSha
    } catch (error) {
      if (error?.response?.status === 404) {
        this.setState({ shouldRedirectToNotFound: true })
      } else {
        toast(
          <Toast notificationType='error' text={`There was a problem trying to load your contact us page. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
          {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
        );
      }
      console.log(error)
    }

    if (!content) return

    try {
      const settingsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`)
      const { footerContent:retrievedContent, footerSha:retrievedSha } = settingsResp.data.settings;
      footerContent = retrievedContent
      footerSha = retrievedSha
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to load your contact us page. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
      console.log(err);
    }

    if (!footerContent) return

    // split the markdown into front matter and content
    const { frontMatter } = frontMatterParser(Base64.decode(content));

    // data cleaning for non-comforming data
    const sanitisedFrontMatter = sanitiseFrontMatter(frontMatter)

    const { contacts, locations } = sanitisedFrontMatter

    const contactsErrors = [], locationsErrors = []
    const contactsDisplay = [], locationsDisplay = []
    const contactsScrollRefs = [], locationsScrollRefs = []

    const sectionsDisplay = {
      contacts: false, 
      locations: false
    }
    
    const sectionsScrollRefs = {
      header: React.createRef(),
      feedback: React.createRef(),
      contacts: React.createRef(),
      locations: React.createRef(),
    }

    contacts.forEach(_ => {
      contactsErrors.push(enumSection('contacts'))
      contactsDisplay.push(false)
      contactsScrollRefs.push(React.createRef())
    })

    locations.forEach(location => {
      locationsErrors.push(enumSection('locations', { operatingHoursLength: location.operating_hours.length }))
      locationsDisplay.push(false)
      locationsScrollRefs.push(React.createRef())
    })
    
    this.scrollRefs = {
      sectionsScrollRefs,
      contacts: contactsScrollRefs,
      locations: locationsScrollRefs,
    }

    if (this._isMounted) this.setState({
      originalFooterContent: _.cloneDeep(footerContent),
      footerContent,
      footerSha,
      originalFrontMatter:  _.cloneDeep(frontMatter),
      frontMatter: sanitisedFrontMatter,
      frontMatterSha: sha,
      displaySections: {
        sectionsDisplay,
        contacts: contactsDisplay,
        locations: locationsDisplay,
      },
      errors: {
        contacts: contactsErrors,
        locations: locationsErrors,
      },
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onDragEnd = (result) => {
    const { scrollRefs, state } = this;
    const { source, destination, type } = result;
    const { frontMatter, displaySections, errors } = state;

    // If the user dropped the draggable to no known droppable
    if (!destination) return;

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) return;

    const elem = frontMatter[type][source.index];
    const elemError = errors[type][source.index];
    const elemDisplay = displaySections[type][source.index];
    const elemScrollRef = scrollRefs[type][source.index];
    
    const newFrontMatter = update(frontMatter, {
      [type]: {
        $splice: [
          [source.index, 1], // Remove elem from its original position
          [destination.index, 0, elem], // Splice elem into its new position
        ],
      },
    });
    const newErrors = update(errors, {
      [type]: {
        $splice: [
          [source.index, 1], // Remove elem from its original position
          [destination.index, 0, elemError], // Splice elem into its new position
        ],
      },
    });
    const newDisplaySections = update(displaySections, {
      [type]: {
        $splice: [
          [source.index, 1],
          [destination.index, 0, elemDisplay],
        ],
      },
    });
    const newScrollRefs = update(scrollRefs, {
      [type]: {
        $splice: [
          [source.index, 1],
          [destination.index, 0, elemScrollRef],
        ],
      },
    })

    // scroll to new location of dragged element
    this.scrollRefs[type][destination.index].current.scrollIntoView() 
    this.scrollRefs = newScrollRefs

    this.setState({
      frontMatter: newFrontMatter,
      errors: newErrors,
      displaySections: newDisplaySections,
    });
  }

  onFieldChange = async (event) => { 
    try {
      const { scrollRefs, state } = this;
      const { frontMatter, footerContent } = state
      const { errors } = state;
      const { id, value } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];

      let newFrontMatter, newFooterContent, newErrors;
      switch (elemType) {
        case 'feedback': {
          newFooterContent = update(footerContent, {
            [elemType]: {$set: value},
          });
          scrollRefs.sectionsScrollRefs[elemType].current.scrollIntoView();
          break;
        }
        case 'header': {
          const field = idArray[1]; 
          
          newFrontMatter = update(frontMatter, {
            [field]: {$set: value},
          });
          scrollRefs.sectionsScrollRefs[elemType].current.scrollIntoView();
          break;
        }
        case 'contacts': {
          const contactIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const contactType = idArray[2]; 
          const contentIndex = parseInt(idArray[3], RADIX_PARSE_INT);

          switch (contactType) {
            case 'title':
              newFrontMatter = update(frontMatter, {
                [elemType]: {[contactIndex]: {[contactType]: {$set: value }}},
              });
              newErrors = update(errors, {
                [elemType]: {[contactIndex]: {[contactType]: {$set: validateContact(contactType, value)}}}
              })
              break;
            default: // 'phone', 'email', 'other'
              newFrontMatter = update(frontMatter, {
                [elemType]: {[contactIndex]: {content : {[contentIndex]: {[contactType]:  {$set: value } }}}},
              });
              newErrors = update(errors, {
                [elemType]: {[contactIndex]: {content : {[contentIndex]: {[contactType]:  {$set: validateContact(contactType, value) } }}}},
              });
              break;
          }
          scrollRefs[elemType][contactIndex].current.scrollIntoView();
          break;
        }
        case 'locations': { 
          const locationIndex = parseInt(idArray[1], RADIX_PARSE_INT);
          const locationType = idArray[2]; // e.g. "title" or "address"
          const fieldIndex = parseInt(idArray[3], RADIX_PARSE_INT);
          const fieldType = idArray[4];

          switch (locationType) {
            case 'operating_hours':
              newFrontMatter = update(frontMatter, {
                [elemType]: {[locationIndex]: {[locationType]: {[fieldIndex] : {[fieldType]: { $set: value }}}}},
              });
              newErrors = update(errors, {
                locations: {[locationIndex]: {[locationType]: {[fieldIndex] : {[fieldType]: { $set: validateLocation(fieldType, value) }}}}},
              });
              break;
            case 'add_operating_hours': 
              newFrontMatter = update(frontMatter, {
                [elemType]: {[locationIndex]: {operating_hours : {$push: [enumSection('location_hours_field')]}}},
              });
              newErrors = update(errors, {
                [elemType]: {[locationIndex]: {operating_hours : {$push: [enumSection('location_hours_field')]}}},
              });
              break;
            case 'remove_operating_hours':
              newFrontMatter = update(frontMatter, {
                [elemType]: {[locationIndex]: {operating_hours : {$splice: [[fieldIndex,1]]}}}
              });
              newErrors = update(errors, {
                [elemType]: {[locationIndex]: {operating_hours : {$splice: [[fieldIndex,1]]}}}
              });
              break;
            case 'address':
              newFrontMatter = update(frontMatter, {
                [elemType]: {[locationIndex]: {[locationType]: {[fieldIndex] : { $set: value }}}},
              });
              // for address, we validate all address fields together, not the single field
              const addressFields = newFrontMatter.locations[locationIndex][locationType]
              newErrors = update(errors, {
                [elemType]: {[locationIndex]: {[locationType]: { $set: validateLocation(locationType, addressFields) }}},
              });
              break;
            default:
              newFrontMatter = update(frontMatter, {
                [elemType]: {[locationIndex]: {[locationType]: { $set: value }}},
              });
              newErrors = update(errors, {
                [elemType]: {[locationIndex]: {[locationType]: { $set: validateLocation(locationType, value) }}},
              });
              break;
          }
          scrollRefs[elemType][locationIndex].current.scrollIntoView();
          break;
        }
      }
      this.setState((currState) => ({ // we check explicitly for undefined
        frontMatter: _.isUndefined(newFrontMatter) ? currState.frontMatter : newFrontMatter,
        footerContent: _.isUndefined(newFooterContent) ? currState.footerContent : newFooterContent,
        errors: _.isUndefined(newErrors) ? currState.errors : newErrors,
      }));
      
    } catch (err) {
      console.log(err);
    }
  }

  createHandler = async (event) => {
    const { id } = event.target;
    try {
      const { scrollRefs, state } = this;
      const { frontMatter, displaySections, errors } = state;
      const { contacts: contactsDisplay, locations: locationsDisplay } = displaySections

      const resetDisplaySections = {
        sectionsDisplay: displaySections.sectionsDisplay,
        contacts: _.fill(Array(contactsDisplay.length), false),
        locations: _.fill(Array(locationsDisplay.length), false),
      }
      const modifiedDisplaySections = update(resetDisplaySections, {
        [id]: {$push: [true]},
      });

      const newFrontMatter = update(frontMatter, {
        [id]: {$push: [enumSection(id)]},
      });
      const newErrors = update(errors, {
        [id]: {$push: [enumSection(id)]},
      })
      const newDisplaySections = update(displaySections, {
        $set: modifiedDisplaySections,
      });
      const newScrollRefs = update(scrollRefs, {
        [id]: {$push: [React.createRef()]},
      });

      if (scrollRefs[id].length) { 
        // Scroll to an approximation of where the new field will be based on the current last field, calibrated from the bottom of page
        _.last(scrollRefs[id]).current.scrollIntoView() 
      } else {
        scrollRefs.sectionsScrollRefs[id].current.scrollIntoView()
      }

      this.scrollRefs = newScrollRefs;      

      this.setState({
        frontMatter: newFrontMatter,
        errors: newErrors,
        displaySections: newDisplaySections,
      });

    } catch (err) {
      console.log(err);
    }
  }

  deleteHandler = async (id) => {
    try {
      const { scrollRefs, state } = this;
      const { frontMatter, displaySections, errors } = state;

      const idArray = id.split('-');
      const elemType = idArray[0];
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT);

      const newFrontMatter = update(frontMatter, {
        [elemType]: {$splice: [[sectionIndex, 1]]},
      });
      const newErrors = update(errors, {
        [elemType]: {$splice: [[sectionIndex, 1]]},
      });
      const newDisplaySections = update(displaySections, {
        [elemType]: {$splice: [[sectionIndex, 1]]},
      });
      const newScrollRefs = update(scrollRefs, {
        [elemType]: {$splice: [[sectionIndex, 1]]},
      });

      this.scrollRefs = newScrollRefs;

      this.setState({
        frontMatter: newFrontMatter,
        errors: newErrors,
        displaySections: newDisplaySections,
      });

    } catch (err) {
      console.log(err);
    }
  }

  displayHandler = async (event) => {
    try {
      const { state, scrollRefs } = this;
      const { displaySections } = state;
      const { contacts: contactsDisplay, locations: locationsDisplay } = displaySections;

      const { id } = event.target;
      const idArray = id.split('-');
      const elemType = idArray[0];
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT) || idArray[1];

      let resetDisplaySections = {
        sectionsDisplay: {
          contacts: false,
          locations: false,
        },
        contacts: _.fill(Array(contactsDisplay.length), false),
        locations: _.fill(Array(locationsDisplay.length), false),
      }

      let newDisplaySections;
      switch (elemType) {
        case 'section': {
          const currDisplayValue = displaySections.sectionsDisplay[sectionIndex];
          resetDisplaySections.sectionsDisplay[sectionIndex] = !currDisplayValue;
          newDisplaySections = update(displaySections, {
            $set : resetDisplaySections,
          });
          scrollRefs.sectionsScrollRefs[sectionIndex].current.scrollIntoView();
          break;
        }
        default: {
          const currDisplayValue = displaySections[elemType][sectionIndex];
          resetDisplaySections[elemType][sectionIndex] = !currDisplayValue;
          newDisplaySections = update(displaySections, {
            [elemType]: {$set: resetDisplaySections[elemType]},
          });
          scrollRefs[elemType][sectionIndex].current.scrollIntoView();
          break;  
        }
      }

      this.setState({
        displaySections: newDisplaySections,
      });
      
    } catch (err) {
      console.log(err);
    }
  }

  savePage = async () => {
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;
      
      // Update contact-us
      // Filter out components which have no input
      let filteredFrontMatter = _.cloneDeep(state.frontMatter)
      
      let newContacts = [];
      state.frontMatter.contacts.forEach((contact) => {
        if ( !isEmpty(contact) ) {
          newContacts.push(_.cloneDeep(contact))
        }
      })
      let newLocations = [];
      state.frontMatter.locations.forEach((location) => {
        if ( !isEmpty(location) ) { 
          let newLocation = _.cloneDeep(location);
          let newOperatingHours = [];
          location.operating_hours.forEach((operatingHour) => { //remove empty operatingHours objects
            if ( !isEmpty(operatingHour)) {
              newOperatingHours.push(_.cloneDeep(operatingHour))
            }
          })
          newLocation.operating_hours = newOperatingHours;
          newLocations.push(newLocation);
        } 
      })
      
      filteredFrontMatter.contacts = newContacts;
      filteredFrontMatter.locations = newLocations;
      
      // If array is empty, delete the object
      if (!filteredFrontMatter.contacts.length) delete filteredFrontMatter.contacts
      if (!filteredFrontMatter.locations.length) delete filteredFrontMatter.locations

      const content = concatFrontMatterMdBody(filteredFrontMatter, '');
      const base64EncodedContent = Base64.encode(content);

      const frontMatterParams = {
        content: base64EncodedContent,
        sha: state.frontMatterSha,
      };

      if (JSON.stringify(state.originalFrontMatter) !== JSON.stringify(state.frontMatter)) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/contact-us.md`, frontMatterParams, {
          withCredentials: true,
        });
      }
      
      
      // // Update settings
      let updatedFooterContents = _.cloneDeep(state.footerContent)
    
      const footerParams = {
        footerSettings: updatedFooterContents,
        footerSha: state.footerSha,
      };
    
      if (JSON.stringify(state.footerContent) !== JSON.stringify(state.originalFooterContent)) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`, footerParams, {
          withCredentials: true,
        });
      }

      window.location.reload();
    } catch (err) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to save your contact us page. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
      console.log(err);
    }
  }

  render() {
    const { state, scrollRefs } = this
    const {
      footerContent,
      originalFooterContent,
      frontMatter,
      originalFrontMatter,
      displaySections,
      frontMatterSha,
      footerSha,
      errors,
      itemPendingForDelete,
    } = state;
    const { match } = this.props;
    const { siteName } = match.params;

    const { agency_name: agencyName, contacts, locations } = frontMatter
    const { feedback } = footerContent
    const { sectionsDisplay } = displaySections
    const { sectionsScrollRefs } = scrollRefs

    const hasErrors = !isEmpty(errors.contacts) || !isEmpty(errors.locations);
    const hasChanges = JSON.stringify(originalFrontMatter) === JSON.stringify(frontMatter) && JSON.stringify(footerContent) === JSON.stringify(originalFooterContent);

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
          title={"Contact Us"}
          shouldAllowEditPageBackNav={hasChanges}
          isEditPage="true"
          backButtonText="Back to My Workspace"
          backButtonUrl={`/sites/${siteName}/workspace`}
        />
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <div className={elementStyles.cardHeader}>
                  <h2>{'Site Settings'}</h2>
                </div>
                <FormField
                  title="Agency Name"
                  id={'header-agency_name'}
                  value={agencyName || ""}
                  isRequired
                  onFieldChange={this.onFieldChange}
                />
                <FormField
                  title="Feedback Url"
                  id={'feedback'}
                  value={feedback || ""}
                  isRequired
                  onFieldChange={this.onFieldChange}
                />
              </div>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <EditorSection 
                  cards={locations}
                  onFieldChange={this.onFieldChange}
                  createHandler={this.createHandler}
                  deleteHandler={(event, type) => this.setState({ itemPendingForDelete: { id: event.target.id, type } })}
                  shouldDisplay={sectionsDisplay.locations}
                  displayCards={displaySections.locations}
                  displayHandler={this.displayHandler}
                  errors={errors.locations}
                  sectionId={'locations'}
                />

                <EditorSection 
                  cards={contacts}
                  onFieldChange={this.onFieldChange}
                  createHandler={this.createHandler}
                  deleteHandler={(event, type) => this.setState({ itemPendingForDelete: { id: event.target.id, type } })}
                  shouldDisplay={sectionsDisplay.contacts}
                  displayCards={displaySections.contacts}
                  displayHandler={this.displayHandler}
                  errors={errors.contacts}
                  sectionId={'contacts'}
                />
              </DragDropContext>  

            </div>
          </div>
          <div className={`${editorStyles.contactUsEditorMain} ` }>
            {/* contact-us header */}
            <TemplateContactUsHeader 
              agencyName={agencyName} 
              ref={sectionsScrollRefs.header}
            />
            {/* contact-us content */}
            <section className="bp-section is-small padding--bottom--lg">
              <div className="bp-container">
                <div className="row">
                  <div className="col is-8 is-offset-2">
                    <TemplateLocationsSection 
                      locations={locations}
                      scrollRefs={scrollRefs.locations} 
                      ref={sectionsScrollRefs.locations}
                    /> 
                    <TemplateContactsSection 
                      contacts={contacts}
                      scrollRefs={scrollRefs.contacts}
                      ref={sectionsScrollRefs.contacts}
                    />
                    <TemplateFeedbackSection 
                      feedback={feedback} 
                      ref={sectionsScrollRefs.feedback}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <LoadingButton
              label="Save"
              disabled={hasErrors} 
              disabledStyle={elementStyles.disabled}
              className={(hasErrors|| !(frontMatterSha && footerSha)) ? elementStyles.disabled : elementStyles.blue} 
              callback={this.savePage}
            />
          </div>
        </div> 
        {
          this.state.shouldRedirectToNotFound &&
          <Redirect
            to={{
                pathname: '/not-found',
                state: {siteName: siteName}
            }}
          />
        }
      </>
    );
  }
}

EditContactUs.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
