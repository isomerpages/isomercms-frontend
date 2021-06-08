import React, { Component } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import * as _ from "lodash"

import Header from "@components/Header"
import Sidebar from "@components/Sidebar"
import LoadingButton from "@components/LoadingButton"
import ColorPicker from "@components/ColorPicker"
import FormFieldToggle from "@components/FormFieldToggle"
import FormFieldMedia from "@components/FormFieldMedia"
import FormFieldColor from "@components/FormFieldColor"
import FormFieldHorizontal from "@components/FormFieldHorizontal"

import { DEFAULT_RETRY_MSG, getObjectDiff } from "@src/utils"
import { errorToast } from "@utils/toasts"
import { validateSocialMedia } from "@utils/validators"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"
import contentStyles from "@styles/isomer-cms/pages/Content.module.scss"

const stateFields = {
  title: "",
  favicon: "",
  shareicon: "",
  facebook_pixel: "",
  google_analytics: "",
  linkedin_insights: "",
  is_government: "",
  colors: {
    "primary-color": "",
    "secondary-color": "",
    "media-colors": [
      {
        title: "media-color-one",
        color: "",
      },
      {
        title: "media-color-two",
        color: "",
      },
      {
        title: "media-color-three",
        color: "",
      },
      {
        title: "media-color-four",
        color: "",
      },
      {
        title: "media-color-five",
        color: "",
      },
    ],
  },
  otherFooterSettings: {
    contact_us: "",
    feedback: "",
    faq: "",
    show_reach: "",
  },
  navigationSettings: {
    logo: "",
  },
  socialMediaContent: {
    facebook: "",
    linkedin: "",
    twitter: "",
    youtube: "",
    instagram: "",
  },
}

const CONFIG_FIELDS = [
  "colors",
  "favicon",
  "facebook_pixel",
  "google_analytics",
  "linkedin_insights",
  "is_government",
  "shareicon",
  "title",
]
const FOOTER_FIELDS = ["otherFooterSettings", "socialMediaContent"]
const NAVIGATION_FIELDS = ["navigationSettings"]

export default class Settings extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      colorPicker: {
        colorPickerToggle: false,
        currentColor: "",
        elementId: "",
        oldColors: {},
      },
      siteName: "",
      ...stateFields,
      errors: _.cloneDeep(stateFields),
    }
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const { match } = this.props
      const { siteName } = match.params
      if (this._isMounted)
        this.setState((currState) => ({
          ...currState,
          siteName,
        }))

      // get settings data from backend
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`,
        {
          withCredentials: true,
        }
      )
      const { settings } = resp.data
      const {
        configFieldsRequired,
        footerContent,
        navigationContent,
      } = settings

      const originalState = {
        // config fields
        // note: config fields are listed out one-by-one since we do not use all config fields
        colors: configFieldsRequired.colors,
        favicon: configFieldsRequired.favicon,
        google_analytics: configFieldsRequired.google_analytics,
        facebook_pixel: configFieldsRequired.facebook_pixel,
        linkedin_insights: configFieldsRequired.linkedin_insights,
        is_government: configFieldsRequired.is_government,
        // resources_name: configFieldsRequired.resources_name,
        // url: configFieldsRequired.url,
        shareicon: configFieldsRequired.shareicon,
        title: configFieldsRequired.title,
        // footer fields
        otherFooterSettings: {
          contact_us: footerContent.contact_us,
          feedback: footerContent.feedback,
          faq: footerContent.faq,
          show_reach: footerContent.show_reach,
        },
        socialMediaContent: {
          facebook: footerContent.social_media.facebook,
          twitter: footerContent.social_media.twitter,
          youtube: footerContent.social_media.youtube,
          instagram: footerContent.social_media.instagram,
          linkedin: footerContent.social_media.linkedin,
        },
        // navigation fields
        navigationSettings: {
          ...navigationContent,
        },
      }

      // set state properly
      if (this._isMounted)
        this.setState((currState) => ({
          ...currState,
          originalState: _.cloneDeep(originalState),
          ...originalState,
        }))
    } catch (err) {
      console.log(err)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  // event listener callback function that resets ColorPicker modal
  // when escape key is pressed while modal is active
  escFunction = (event) => {
    if (event.key === "Escape") {
      this.disableColorPicker(true)
    }
  }

  // event listener callback function that resets ColorPicker modal
  // when mouse clicks on area outside of modal while modal is active
  clickFunction = (event) => {
    let { target } = event
    let { tagName } = target
    // keep checking parent element until you hit a tagName of FORM
    while (tagName !== "FORM") {
      target = target.parentElement
      tagName = target.tagName
    }
    // disableColorPicker only if descendant of colorModal
    if (target.id !== "colorModal") {
      this.disableColorPicker(true)
    }
  }

  changeHandler = (event) => {
    const { id, value, parentElement } = event.target
    const grandparentElementId = parentElement?.parentElement?.id
    // const errorMessage = validateSettings(id, value);

    // although show_reach is a part of footer-fields, the CreatableSelect dropdown handler does not
    // return a normal event, so we need to handle the case separately
    if (id === "show_reach") {
      this.setState((currState) => ({
        ...currState,
        otherFooterSettings: {
          ...currState.otherFooterSettings,
          [id]: value,
        },
      }))
    } else if (grandparentElementId === "footer-fields") {
      this.setState((currState) => ({
        ...currState,
        otherFooterSettings: {
          ...currState.otherFooterSettings,
          [id]: value,
        },
      }))
    } else if (grandparentElementId === "social-media-fields") {
      const errorMessage = validateSocialMedia(value, id)
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
      }))
    } else if (grandparentElementId === "color-fields") {
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          [id]: value,
        },
      }))
    } else if (grandparentElementId === "media-color-fields") {
      const index = id.split("@")[id.split("@").length - 1]
      const { colors } = this.state

      // set value to be used to set state for media colors
      const newMediaColors = [...colors["media-colors"]]
      newMediaColors[index].color = value

      // set state
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          "media-colors": newMediaColors,
        },
      }))
    } else {
      if (id === "logo") {
        this.setState((currState) => ({
          ...currState,
          navigationSettings: {
            ...currState.navigationSettings,
            [id]: value,
          },
        }))
      } else {
        this.setState((currState) => ({
          ...currState,
          [id]: value,
        }))
      }
    }
  }

  saveSettings = async () => {
    try {
      const { state } = this
      const { match } = this.props
      const { siteName } = match.params

      const {
        colors,
        favicon,
        facebook_pixel,
        google_analytics,
        linkedin_insights,
        is_government,
        shareicon,
        title,
        otherFooterSettings,
        socialMediaContent,
        navigationSettings: navigationSettingsState,
        originalState,
      } = state

      // Compare settings and extract only fields which have changed
      const currentSettings = {
        colors,
        favicon,
        facebook_pixel,
        google_analytics,
        linkedin_insights,
        is_government,
        shareicon,
        title,
        otherFooterSettings,
        socialMediaContent,
        navigationSettings: navigationSettingsState,
      }

      let settingsStateDiff
      if (originalState) {
        settingsStateDiff = getObjectDiff(currentSettings, originalState)
      }

      // Construct payload
      let configSettings = {}
      let footerSettings = {}
      let navigationSettings = {}
      Object.keys(settingsStateDiff).forEach((field) => {
        if (CONFIG_FIELDS.includes(field)) {
          if (field === "facebook_pixel") {
            configSettings["facebook-pixel"] = settingsStateDiff[field].obj1 // rename due to quirks on isomer template
          } else if (field === "linkedin_insights") {
            configSettings["linkedin-insights"] = settingsStateDiff[field].obj1 // rename due to quirks on isomer template
          } else {
            configSettings[field] = settingsStateDiff[field].obj1
          }
        }

        if (FOOTER_FIELDS.includes(field)) {
          if (field === "otherFooterSettings")
            footerSettings = {
              ...footerSettings,
              ...settingsStateDiff[field].obj1,
            }

          if (field === "socialMediaContent")
            footerSettings["social_media"] = settingsStateDiff[field].obj1
        }

        if (NAVIGATION_FIELDS.includes(field)) {
          navigationSettings = settingsStateDiff[field].obj1
        }
      })

      const params = {
        configSettings,
        footerSettings,
        navigationSettings,
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`,
        params,
        {
          withCredentials: true,
        }
      )

      window.location.reload()
    } catch (err) {
      errorToast(
        `There was a problem trying to save your settings. ${DEFAULT_RETRY_MSG}`
      )
      console.log(err)
    }
  }

  // toggles color picker modal
  activateColorPicker = (event) => {
    const {
      colorPicker: { colorPickerToggle },
      colors,
    } = this.state

    // setup escape key event listener to exit from ColorPicker modal
    document.addEventListener("keydown", this.escFunction)
    document.addEventListener("click", this.clickFunction)

    // if ColorPickerModal isn't active, activate it
    if (!colorPickerToggle) {
      const {
        target: {
          previousSibling: { id, value },
        },
      } = event
      const currentColor = value.slice(1)
      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: true,
          currentColor,
          elementId: id,
          oldColors: { ...colors },
        },
      }))
    }
  }

  disableColorPicker = (resetOldColors) => {
    const {
      colorPicker: { colorPickerToggle, oldColors },
    } = this.state
    // if ColorPicker is active, disable it
    if (colorPickerToggle) {
      if (resetOldColors) {
        this.setState({ colors: oldColors })
      }

      this.setState((currState) => ({
        ...currState,
        colorPicker: {
          colorPickerToggle: false,
          currentColor: "",
          elementId: "",
          oldColors: {},
        },
      }))
    }

    // remove event listeners
    document.removeEventListener("keydown", this.escFunction)
    document.removeEventListener("click", this.clickFunction)
  }

  // onColorSelect sets value of appropriate color field
  onColorSelect = (event, color) => {
    // prevent event from reloading
    // prevent parent form from being submitted
    event.preventDefault()
    event.stopPropagation()

    // reflect color changes
    this.setRealTimeColor(color)

    // reset color picker
    this.disableColorPicker(false)
  }

  setRealTimeColor = (color) => {
    const {
      colorPicker: { elementId },
      colors,
    } = this.state
    // there is no hex property if the color submitted is the
    // same as the original color
    const hex = color.hex ? color.hex : `#${color}`

    // set state of color fields
    if (elementId === "primary-color" || elementId === "secondary-color") {
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          [elementId]: hex,
        },
      }))
    } else {
      // set state of resource colors
      const index = elementId.split("@")[elementId.split("@").length - 1]
      const newMediaColors = _.cloneDeep(colors["media-colors"])
      newMediaColors[index].color = hex
      this.setState((currState) => ({
        ...currState,
        colors: {
          ...currState.colors,
          "media-colors": newMediaColors,
        },
      }))
    }
  }

  render() {
    const {
      colorPicker,
      siteName,
      title,
      favicon,
      shareicon,
      facebook_pixel,
      google_analytics,
      linkedin_insights,
      is_government,
      colors,
      socialMediaContent,
      otherFooterSettings,
      navigationSettings,
      originalState,
      errors,
    } = this.state
    const {
      "primary-color": primaryColor,
      "secondary-color": secondaryColor,
      "media-colors": mediaColors,
    } = colors
    const { colorPickerToggle, currentColor, elementId } = colorPicker
    const { location } = this.props

    // construct settings object for comparison with original state
    const currentSettings = {
      colors,
      favicon,
      facebook_pixel,
      google_analytics,
      linkedin_insights,
      is_government,
      shareicon,
      title,
      otherFooterSettings,
      socialMediaContent,
      navigationSettings,
    }

    let settingsStateDiff
    if (originalState) {
      settingsStateDiff = getObjectDiff(currentSettings, originalState)
    }

    // retrieve errors
    const hasConfigErrors = _.some([
      errors.favicon,
      errors.shareicon,
      errors.is_government,
      errors.facebook_pixel,
      errors.google_analytics,
      errors.linkedin_insights,
    ])
    const hasNavigationErrors = _.some([errors.navigationSettings.logo])
    const hasColorErrors = _.some([
      errors.colors.primaryColor,
      errors.colors.secondaryColor,
    ])
    const hasMediaColorErrors = _.some(
      errors.colors["media-colors"].map((mediaColor) => mediaColor.color)
    )
    const hasSocialMediaErrors = _.some(
      Object.values(errors.socialMediaContent)
    )
    const hasErrors =
      hasConfigErrors ||
      hasNavigationErrors ||
      hasColorErrors ||
      hasMediaColorErrors ||
      hasSocialMediaErrors
    return (
      <>
        <Header
          siteName={siteName}
          isEditPage={true}
          shouldAllowEditPageBackNav={_.isEmpty(settingsStateDiff)}
        />
        {/* main bottom section */}
        <form className={elementStyles.wrapper}>
          {/* Color picker modal */}
          {colorPickerToggle && (
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
                {/* General fields */}
                <div id="general-fields">
                  <p className={elementStyles.formSectionHeader}>General</p>
                  <FormFieldHorizontal
                    title="Title"
                    id="title"
                    value={title}
                    errorMessage={errors.title}
                    isRequired={false}
                    onFieldChange={this.changeHandler}
                  />
                  <FormFieldToggle
                    title="Display government masthead"
                    id="is_government"
                    value={is_government}
                    onFieldChange={this.changeHandler}
                  />
                </div>
                {/* Logo fields */}
                <div id="logo-fields">
                  <p className={elementStyles.formSectionHeader}>Logos</p>
                  <FormFieldMedia
                    title="Agency logo"
                    id="logo"
                    value={navigationSettings.logo}
                    errorMessage={errors.navigationSettings.logo}
                    isRequired
                    onFieldChange={this.changeHandler}
                    inlineButtonText={"Choose Image"}
                    siteName={siteName}
                    placeholder=" "
                    type="images"
                  />
                  <FormFieldMedia
                    title="Favicon"
                    id="favicon"
                    value={favicon}
                    errorMessage={errors.favicon}
                    isRequired
                    onFieldChange={this.changeHandler}
                    inlineButtonText={"Choose Image"}
                    siteName={siteName}
                    placeholder=" "
                    type="images"
                  />
                  <FormFieldMedia
                    title="Shareicon"
                    id="shareicon"
                    value={shareicon}
                    errorMessage={errors.shareicon}
                    isRequired
                    onFieldChange={this.changeHandler}
                    inlineButtonText={"Choose Image"}
                    siteName={siteName}
                    placeholder=" "
                    type="images"
                  />
                </div>
                {/* Analytics fields */}
                <div id="analytics-fields">
                  <p className={elementStyles.formSectionHeader}>Analytics</p>
                  <FormFieldHorizontal
                    title="Facebook Pixel"
                    placeholder="Facebook Pixel ID"
                    id="facebook_pixel"
                    value={facebook_pixel}
                    errorMessage={errors.facebook_pixel}
                    isRequired={false}
                    onFieldChange={this.changeHandler}
                  />
                  <FormFieldHorizontal
                    title="Google Analytics"
                    placeholder="Google Analytics ID"
                    id="google_analytics"
                    value={google_analytics}
                    errorMessage={errors.google_analytics}
                    isRequired={false}
                    onFieldChange={this.changeHandler}
                  />
                  <FormFieldHorizontal
                    title="Linkedin Insights"
                    placeholder="Linkedin Insights ID"
                    id="linkedin_insights"
                    value={linkedin_insights}
                    errorMessage={errors.linkedin_insights}
                    isRequired={false}
                    onFieldChange={this.changeHandler}
                  />
                </div>
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
                      const { title: mediaColorName, color } = category
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
                      )
                    })}
                  </div>
                </div>
                {/* Social media fields */}
                <div id="social-media-fields">
                  <p className={elementStyles.formSectionHeader}>
                    Social Media
                  </p>
                  {Object.keys(socialMediaContent).map((socialMediaPage) => (
                    <FormFieldHorizontal
                      title={
                        socialMediaPage.charAt(0).toUpperCase() +
                        socialMediaPage.slice(1)
                      }
                      id={socialMediaPage}
                      value={socialMediaContent[socialMediaPage]}
                      key={`${socialMediaPage}-form`}
                      errorMessage={errors.socialMediaContent[socialMediaPage]}
                      isRequired={false}
                      onFieldChange={this.changeHandler}
                    />
                  ))}
                </div>
                {/* Footer fields */}
                <div id="footer-fields">
                  <p className={elementStyles.formSectionHeader}>Footer</p>
                  {Object.keys(otherFooterSettings).map((footerSetting) => {
                    const title = footerSetting
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")

                    if (footerSetting === "show_reach") {
                      return (
                        <FormFieldToggle
                          title={title}
                          id={footerSetting}
                          value={otherFooterSettings[footerSetting]}
                          key={`${footerSetting}-form`}
                          errorMessage={
                            errors.otherFooterSettings[footerSetting]
                          }
                          isRequired={false}
                          onFieldChange={this.changeHandler}
                        />
                      )
                    }

                    return (
                      <FormFieldHorizontal
                        title={title}
                        id={footerSetting}
                        value={otherFooterSettings[footerSetting]}
                        key={`${footerSetting}-form`}
                        errorMessage={errors.otherFooterSettings[footerSetting]}
                        isRequired={false}
                        onFieldChange={this.changeHandler}
                      />
                    )
                  })}
                </div>
                <br />
                <br />
              </div>
              <div className={elementStyles.formSave}>
                <LoadingButton
                  label="Save"
                  disabled={hasErrors}
                  disabledStyle={elementStyles.formSaveButtonDisabled}
                  className={
                    hasErrors
                      ? elementStyles.formSaveButtonDisabled
                      : elementStyles.formSaveButtonActive
                  }
                  callback={this.saveSettings}
                />
              </div>
            </div>
          </div>
        </form>
      </>
    )
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
}
