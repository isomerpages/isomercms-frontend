import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import yaml from 'js-yaml';
import rgbHex from 'rgb-hex';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormField from '../components/FormField';
import FormFieldImage from '../components/FormFieldImage';
import FormFieldColor from '../components/FormFieldColor';
import FormFieldHorizontal from '../components/FormFieldHorizontal';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const stateFields = {
  colorPicker: {
    colorPickerToggle: false,
    colorPickerPosition: [0, 0],
    currentColor: '',
  },
  title: '',
  favicon: '',
  resources_name: '',
  colors: {
    "primary-color": '',
    "secondary-color": '',
    "media-colors": [
      {
        title: '',
        color: '',
      },
      {
        title: '',
        color: '',
      },
      {
        title: '',
        color: '',
      },
      {
        title: '',
        color: '',
      },
      {
        title: '',
        color: '',
      },
    ],
  },
  socialMediaContent: {
    facebook: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    instagram: '',
  },
};

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: '',
      ...stateFields,
      errors: {
        ...stateFields,
      },
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`, {
        withCredentials: true,
      });
      const { settings } = resp.data;
      const {
        configResp,
        socialMediaResp,
        configSha,
        socialMediaSha,
      } = settings;

      const configContent = yaml.safeLoad(Base64.decode(configResp));
      const socialMediaContent = yaml.safeLoad(Base64.decode(socialMediaResp));
      // set state properly
      this.setState((currState) => ({
        ...currState,
        siteName,
        ...configContent,
        socialMediaContent: {
          ...currState.socialMediaContent,
          ...socialMediaContent,
        },
        configSha,
        socialMediaSha,
      }));
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const {
      id,
      value,
      parentElement: {
        parentElement: {
          id: grandparentElementId,
          // parentElement: {
          //   id: greatGrandparentElementId,
          // },
        },
      },
    } = event.target;
    // const errorMessage = validateSettings(id, value);

    if (grandparentElementId === 'social-media-fields') {
      // errors: {
      //  socialMediaContent: {
      //    [id]: {
      //      $set: errorMessage,
      //     },
      //   },
      // },
      this.setState((currState) => ({
        ...currState,
        socialMediaContent: {
          ...currState.socialMediaContent,
          [id]: value,
        },
      }));
    } else if (grandparentElementId === 'color-fields') {
      // errors: {
      //  colors: {
      //   'media-colors': {
      //      [id]: {
      //        $set: errorMessage,
      //      },
      //    }
      //  }
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          [id]: value,
        },
      }));
    } else if (grandparentElementId === 'media-color-fields') {
      // errors: {
      //  colors: {
      //   'media-colors': {
      //      [id]: {
      //        $set: errorMessage,
      //      },
      //    }
      //  }
      const index = id.split('@')[id.split('@').length - 1];
      const { colors } = this.state;
      const newMediaColors = [...colors['media-colors']];
      newMediaColors[index].color = value;
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          'media-colors': newMediaColors,
        },
      }));
    } else {
      this.setState((currState) => ({
        // errors: {
        //   [id]: errorMessage,
        // },
        ...currState,
        [id]: value,
      }));
    }
  };

  saveSettings = async (event) => {
    event.preventDefault();
    try {
      const { state } = this;
      const { match } = this.props;
      const { siteName } = match.params;

      // settings is obtained from _config.yml and social-media.yml
      const socialMediaSettings = state.socialMediaContent;

      // obtain config settings object
      const configSettings = { ...state };
      delete configSettings.socialMediaContent;
      delete configSettings.configSha;
      delete configSettings.socialMediaSha;
      delete configSettings.siteName;
      delete configSettings.colorPicker;

      // obtain sha values
      const { socialMediaSha, configSha } = state;


      const params = {
        socialMediaSettings,
        configSettings,
        socialMediaSha,
        configSha,
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
  colorPickerToggle = (event) => {
    alert('Hi!!');
    const { colorPicker: { colorPickerToggle } } = this.state;
    // if ColorPicker modal is active, disable it
    if (colorPickerToggle) {
      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: false,
          currentColor: '',
          colorPickerPosition: [0, 0],
        },
      }));
    // if ColorPickerModal isn't active, activate it
    } else {
      const { target: { style: { background } }, pageX, pageY } = event;
      const currentColor = rgbHex(background);
      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: true,
          currentColor,
          colorPickerPosition: [pageX, pageY],
        },
      }));
    }
  }

  render() {
    const {
      siteName,
      title,
      favicon,
      resources_name: resourcesName,
      colors,
      socialMediaContent,
      errors,
    } = this.state;
    const { 'primary-color': primaryColor, 'secondary-color': secondaryColor, 'media-colors': mediaColors } = colors;
    const { match, location } = this.props;
    return (
      <>
        <Header showButton={false} />
        {/* main bottom section */}
        <form onSubmit={this.saveSettings} className={elementStyles.wrapper}>
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
                  onColorClick={this.colorPickerToggle}
                />
                {/* Color fields */}
                <div id="color-fields">
                  <p className={elementStyles.formLabel}>Colors</p>
                  <FormFieldColor
                    title="Primary"
                    id="primary-color"
                    value={primaryColor}
                    errorMessage={errors.colors['primary-color']}
                    isRequired
                    onFieldChange={this.changeHandler}
                    onColorClick={this.colorPickerToggle}
                  />
                  <FormFieldColor
                    title="Secondary"
                    id="secondary-color"
                    value={secondaryColor}
                    errorMessage={errors.colors['secondary-color']}
                    isRequired
                    onFieldChange={this.changeHandler}
                    onColorClick={this.colorPickerToggle}
                  />
                  <div id="media-color-fields">
                    {Object.keys(mediaColors).map((category, index) => {
                      const { title: categoryId, color } = mediaColors[index];
                      return (
                        <FormFieldColor
                          title={`Resource ${index + 1}`}
                          id={`media-color@${index}`}
                          value={color}
                          errorMessage={errors.colors['media-colors'][categoryId]}
                          isRequired
                          onFieldChange={this.changeHandler}
                        />
                      );
                    })}
                  </div>
                </div>
                {/* Resource room name field */}
                <FormField
                  title="Resource Room Name"
                  id="resources_name"
                  value={resourcesName}
                  errorMessage={errors.resources_name}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Social media fields */}
                <div id="social-media-fields">
                  <p className={elementStyles.formLabel}>Social Media</p>
                  {Object.keys(socialMediaContent).map((socialMediaPage) => (
                    <FormFieldHorizontal
                      title={socialMediaPage.charAt(0).toUpperCase() + socialMediaPage.slice(1)}
                      id={socialMediaPage}
                      value={socialMediaContent[socialMediaPage]}
                      errorMessage={errors.socialMediaContent[socialMediaPage]}
                      isRequired={false}
                      onFieldChange={this.changeHandler}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className={elementStyles.blue}>Save</button>
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
