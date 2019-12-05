import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import FormField from '../components/FormField';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteName: '',
      settings: {
        configContent: {
          title: '',
          favicon: '',
          resources_name: '',
          colors: {
            "primary-color": '',
            "secondary-color": '',
            "media-colors": {
              "media-color-one": '',
              "media-color-two": '',
              "media-color-three": '',
              "media-color-four": '',
              "media-color-five": '',
            },
          },
        },
        socialMediaContent: {
          facebook: '',
          linkedin: '',
          twitter: '',
          youtube: '',
          instagram: '',
        },
      },
      errors: {
        settings: {
          configContent: {
            title: '',
            favicon: '',
            resources_name: '',
            colors: {
              "primary-color": '',
              "secondary-color": '',
              "media-colors": {
                "media-color-one": '',
                "media-color-two": '',
                "media-color-three": '',
                "media-color-four": '',
                "media-color-five": '',
              },
            },
          },
          socialMediaContent: {
            facebook: '',
            linkedin: '',
            twitter: '',
            youtube: '',
            instagram: '',
          }
        }
      }
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
      this.setState({ siteName, settings });
      console.log('abc')
    } catch (err) {
      console.log(err);
    }
  }

  changeHandler = (event) => {
    const { id, value } = event.target;
    // const errorMessage = validateSettings(id, value);

    this.setState({
      // errors: {
      //   [id]: errorMessage,
      // },
      [id]: value,
    });
  }

  render() {
    const { siteName, settings, errors } = this.state;
    const { configContent: { title, favicon, resources_name: resourcesName, colors }, socialMediaContent } = settings
    const { match, location } = this.props;
    return (
      <>
        <Header showButton={false} />
        {/* main bottom section */}
        <div className={elementStyles.wrapper}>
          <Sidebar siteName={siteName} currPath={location.pathname} />

          {/* main section starts here */}
          <div className={contentStyles.mainSection}>
            <div className={contentStyles.sectionHeader}>
              <h1 className={contentStyles.sectionTitle}>Settings</h1>
            </div>
            {/* container for settings fields */}
            <div className={contentStyles.contentContainerCards}>
              <div className={contentStyles.cardContainer}>
                <h1>Hi</h1>
                {/* Title field */}
                <FormField
                  title="Title"
                  id="title"
                  value={title}
                  errorMessage={errors.title}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Title field */}
                <FormField
                  title="Favicon"
                  id="favicon"
                  value={favicon}
                  errorMessage={errors.favicon}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
                {/* Title field */}
                <FormField
                  title="Resource Room Name"
                  id="resources_name"
                  value={resourcesName}
                  errorMessage={errors.title}
                  isRequired
                  onFieldChange={this.changeHandler}
                />
              </div>
            </div>
          </div>
        </div>
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
