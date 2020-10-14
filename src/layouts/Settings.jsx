import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LoadingButton from '../components/LoadingButton';
import ColorPicker from '../components/ColorPicker';
import FormField from '../components/FormField';
import FormFieldImage from '../components/FormFieldImage';
import FormFieldColor from '../components/FormFieldColor';
import FormFieldHorizontal from '../components/FormFieldHorizontal';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import { validateSocialMedia } from '../utils/validators';

const stateFields = {
  title: '',
  favicon: '',
  resources_name: '',
  colors: {
    'primary-color': '',
    'secondary-color': '',
    'media-colors': [
      {
        title: 'media-color-one',
        color: '',
      },
      {
        title: 'media-color-two',
        color: '',
      },
      {
        title: 'media-color-three',
        color: '',
      },
      {
        title: 'media-color-four',
        color: '',
      },
      {
        title: 'media-color-five',
        color: '',
      },
    ],
  },
  otherFooterSettings: {
    contact_us: '',
    show_reach: true, // true by default
    feedback: '',
    faq: '',
  },
  socialMediaContent: {
    facebook: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    instagram: '',
  },
  footerSha: '',
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorPicker: {
        colorPickerToggle: false,
        currentColor: '',
        elementId: '',
        oldColors: {},
      },
      siteName: '',
      ...stateFields,
      errors: _.cloneDeep(stateFields),
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;

      // get settings data from backend
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`, {
        withCredentials: true,
      });
      const { settings } = resp.data;
      const {
        configFieldsRequired,
        footerContent,
        footerSha,
      } = settings;

      // set state properly
      this.setState((currState) => ({
        ...currState,
        siteName,
        ...configFieldsRequired,
        otherFooterSettings: {
          ...currState.socialMediaContent,
          contact_us: footerContent.contact_us,
          show_reach: footerContent.show_reach,
          feedback: footerContent.feedback,
          faq: footerContent.faq,
        },
        socialMediaContent: {
          ...currState.socialMediaContent,
          ...footerContent.social_media,
        },
        footerSha,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  // event listener callback function that resets ColorPicker modal
  // when escape key is pressed while modal is active
  escFunction = (event) => {
    if (event.key === 'Escape') {
      this.disableColorPicker(true);
    }
  }

  // event listener callback function that resets ColorPicker modal
  // when mouse clicks on area outside of modal while modal is active
  clickFunction = (event) => {
    let { target } = event;
    let { tagName } = target;
    // keep checking parent element until you hit a tagName of FORM
    while (tagName !== 'FORM') {
      target = target.parentElement;
      tagName = target.tagName;
    }
    // disableColorPicker only if descendant of colorModal
    if (target.id !== 'colorModal') {
      this.disableColorPicker(true);
    }
  }

  changeHandler = (event) => {
    const {
      id,
      value,
      parentElement: {
        parentElement: {
          id: grandparentElementId,
        },
      },
    } = event.target;
    // const errorMessage = validateSettings(id, value);

    if (grandparentElementId === 'social-media-fields') {
      const errorMessage = validateSocialMedia(value, id);
      this.setState((currState) => ({
        ...currState,
        socialMediaContent: {
          ...currState.socialMediaContent,
          [id]: value,
        },
        errors: {
          ...currState.errors,
          socialMediaContent: {
            ...currState.errors.socialMediaContent,
            [id]: errorMessage,
          },
        },
      }));
    } else if (grandparentElementId === 'color-fields') {
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          [id]: value,
        },
      }));
    } else if (grandparentElementId === 'media-color-fields') {
      const index = id.split('@')[id.split('@').length - 1];
      const { colors } = this.state;

      // set value to be used to set state for media colors
      const newMediaColors = [...colors['media-colors']];
      newMediaColors[index].color = value;

      // set state
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          'media-colors': newMediaColors,
        },
      }));
    } else {
      this.setState((currState) => ({
        ...currState,
        [id]: value,
      }));
    }
  };

  saveSettings = async () => {
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;

      // settings is obtained from _config.yml and footer.yml
      const socialMediaSettings = state.socialMediaContent;
      const { otherFooterSettings } = state;

      // obtain config settings object
      const {
        title,
        favicon,
        // eslint-disable-next-line camelcase
        resources_name,
        colors,
      } = this.state;
      const configSettings = {
        title,
        favicon,
        resources_name,
        colors,
      };

      // obtain sha value
      const { footerSha } = state;

      const params = {
        footerSettings: {
          ...otherFooterSettings,
          social_media: socialMediaSettings,
        },
        configSettings,
        footerSha,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  // toggles color picker modal
  activateColorPicker = (event) => {
    const { colorPicker: { colorPickerToggle }, colors } = this.state;

    // setup escape key event listener to exit from ColorPicker modal
    document.addEventListener('keydown', this.escFunction);
    document.addEventListener('click', this.clickFunction);

    // if ColorPickerModal isn't active, activate it
    if (!colorPickerToggle) {
      const { target: { previousSibling: { id, value } } } = event;
      const currentColor = value.slice(1);
      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: true,
          currentColor,
          elementId: id,
          oldColors: { ...colors },
        },
      }));
    }
  }

  disableColorPicker = (resetOldColors) => {
    const { colorPicker: { colorPickerToggle, oldColors } } = this.state;
    // if ColorPicker is active, disable it
    if (colorPickerToggle) {
      if (resetOldColors) {
        this.setState({ colors: oldColors });
      }

      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: false,
          currentColor: '',
          elementId: '',
          oldColors: {},
        },
      }));
    }

    // remove event listeners
    document.removeEventListener('keydown', this.escFunction);
    document.removeEventListener('click', this.clickFunction);
  }

  // onColorSelect sets value of appropriate color field
  onColorSelect = (event, color) => {
    // prevent event from reloading
    // prevent parent form from being submitted
    event.preventDefault();
    event.stopPropagation();

    // reflect color changes
    this.setRealTimeColor(color);

    // reset color picker
    this.disableColorPicker(false);
  }

  setRealTimeColor = (color) => {
    const { colorPicker: { elementId }, colors } = this.state;
    // there is no hex property if the color submitted is the
    // same as the original color
    const hex = color.hex ? color.hex : `#${color}`;

    // set state of color fields
    if (elementId === 'primary-color' || elementId === 'secondary-color') {
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          [elementId]: hex,
        },
      }));
    } else {
      // set state of resource colors
      const index = elementId.split('@')[elementId.split('@').length - 1];
      const newMediaColors = _.cloneDeep(colors['media-colors']);
      newMediaColors[index].color = hex;
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          'media-colors': newMediaColors,
        },
      }));
    }
  }

  render() {
    const {
      colorPicker,
      siteName,
      title,
      favicon,
      resources_name: resourcesName,
      colors,
      socialMediaContent,
      footerSha,
      errors,
    } = this.state;
    const { 'primary-color': primaryColor, 'secondary-color': secondaryColor, 'media-colors': mediaColors } = colors;
    const {
      colorPickerToggle,
      currentColor,
      elementId,
    } = colorPicker;
    const { location } = this.props;

    // retrieve errors
    const hasConfigErrors = _.some([errors.title, errors.favicon, errors.resources_name]);
    const hasColorErrors = _.some([errors.colors.primaryColor, errors.colors.secondaryColor]);
    const hasMediaColorErrors = _.some(errors.colors['media-colors'].map((mediaColor) => mediaColor.color));
    const hasSocialMediaErrors = _.some(Object.values(errors.socialMediaContent));
    const hasErrors = hasConfigErrors || hasColorErrors || hasMediaColorErrors || hasSocialMediaErrors;
    return (
      <>
        <Header />
        {/* main bottom section */}
        <form
          className={elementStyles.wrapper}
        >
          {/* Color picker modal */}
          { colorPickerToggle
            && (
              <ColorPicker
                value={currentColor}
                onColorSelect={this.onColorSelect}
                setRealTimeColor={this.setRealTimeColor}
                elementId={elementId}
              />
            )}
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Settings</h1>
            </div>
            {/* container for settings fields */}
            <div className={contentStyles.contentContainerCards}>
              <div className={contentStyles.cardContainer}>
                {/* Title field */}
                <FormField
                  title="Title"
                  id="title"
                  value={title}
                  errorMessage={errors.title}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Favicon field */}
                <FormFieldImage
                  title="Favicon"
                  id="favicon"
                  value={favicon}
                  errorMessage={errors.favicon}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Resource room name field */}
                <FormField
                  title="Resource Room Name"
                  id="resources_name"
                  value={resourcesName}
                  errorMessage={errors.resources_name}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Color fields */}
                <div id="color-fields">
                  <p className={elementStyles.formSectionHeader}>Colors</p>
                  <FormFieldColor
                    title="Primary"
                    id="primary-color"
                    value={primaryColor}
                    isRequired
                    onFieldChange={this.changeHandler}
                    onColorClick={this.activateColorPicker}
                  />
                  <FormFieldColor
                    title="Secondary"
                    id="secondary-color"
                    value={secondaryColor}
                    isRequired
                    onFieldChange={this.changeHandler}
                    onColorClick={this.activateColorPicker}
                  />
                  <div id="media-color-fields">
                    {mediaColors.map((category, index) => {
                      const { title: mediaColorName, color } = category;
                      return (
                        <FormFieldColor
                          title={`Resource ${index + 1}`}
                          id={`media-color@${index}`}
                          value={color}
                          key={mediaColorName}
                          isRequired
                          onFieldChange={this.changeHandler}
                          onColorClick={this.activateColorPicker}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Social media fields */}
                <div id="social-media-fields">
                  <p className={elementStyles.formSectionHeader}>Social Media</p>
                  {Object.keys(socialMediaContent).map((socialMediaPage) => (
                    <FormFieldHorizontal
                      title={socialMediaPage.charAt(0).toUpperCase() + socialMediaPage.slice(1)}
                      id={socialMediaPage}
                      value={socialMediaContent[socialMediaPage]}
                      key={`${socialMediaPage}-form`}
                      errorMessage={errors.socialMediaContent[socialMediaPage]}
                      isRequired={false}
                      onFieldChange={this.changeHandler}
                    />
                  ))}
                </div>
                <br />
                <br />
              </div>
              <div className={elementStyles.formSave}>
                <LoadingButton
                  label="Save"
                  disabled={hasErrors}
                  disabledStyle={elementStyles.formSaveButtonDisabled}
                  className={(hasErrors || !footerSha)
                    ? elementStyles.formSaveButtonDisabled
                    : elementStyles.formSaveButtonActive}
                  callback={this.saveSettings}
                />
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}

Settings.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};
