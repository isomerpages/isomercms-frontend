import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import * as _ from "lodash"
import PropTypes from "prop-types"

import ColorPicker from "components/ColorPicker"
import FormFieldColor from "components/FormFieldColor"
import FormFieldHorizontal from "components/FormFieldHorizontal"
import FormFieldMedia from "components/FormFieldMedia"
import FormFieldToggle from "components/FormFieldToggle"
import Header from "components/Header"
import LoadingButton from "components/LoadingButton"
import Sidebar from "components/Sidebar"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { errorToast } from "utils/toasts"
import { validateSocialMedia } from "utils/validators"

import { DEFAULT_RETRY_MSG, getObjectDiff } from "utils"

const stateFields = {
  title: "",
  description: "",
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
    telegram: "",
    tiktok: "",
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
  "description",
]
const FOOTER_FIELDS = ["otherFooterSettings", "socialMediaContent"]
const NAVIGATION_FIELDS = ["navigationSettings"]

const Settings = ({ match, location }) => {
  const { siteName } = match.params

  const [colorPicker, setColorPicker] = useState({
    currentColor: "",
    elementId: "",
    oldColors: {},
  })
  const [colorPickerToggle, setColorPickerToggle] = useState(false)
  const [currState, setCurrState] = useState(stateFields)
  const [originalState, setOriginalState] = useState()
  const [hasErrors, setHasErrors] = useState(false)
  const [errors, setErrors] = useState(
    _.omit(_.cloneDeep(stateFields), "colors")
  )
  const [hasChanges, setHasChanges] = useState(false)
  const [settingsStateDiff, setSettingsStateDiff] = useState()

  useEffect(() => {
    let _isMounted = true

    const loadSettings = async () => {
      try {
        // get settings data from backend
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`,
          {
            withCredentials: true,
          }
        )
        const { configSettings, footerSettings, navigationSettings } = resp.data

        const retrievedState = {
          // config fields
          // note: config fields are listed out one-by-one since we do not use all config fields
          colors: configSettings.colors,
          favicon: configSettings.favicon,
          google_analytics: configSettings.google_analytics,
          facebook_pixel: configSettings.facebook_pixel,
          linkedin_insights: configSettings.linkedin_insights,
          is_government: configSettings.is_government,
          // resources_name: configSettings.resources_name,
          // url: configSettings.url,
          shareicon: configSettings.shareicon,
          title: configSettings.title,
          description: configSettings.description,
          // footer fields
          otherFooterSettings: {
            contact_us: footerSettings.contact_us,
            feedback: footerSettings.feedback,
            faq: footerSettings.faq,
            show_reach: footerSettings.show_reach,
          },
          socialMediaContent: {
            facebook: footerSettings.social_media.facebook,
            twitter: footerSettings.social_media.twitter,
            youtube: footerSettings.social_media.youtube,
            instagram: footerSettings.social_media.instagram,
            linkedin: footerSettings.social_media.linkedin,
            telegram: footerSettings.social_media.telegram,
            tiktok: footerSettings.social_media.tiktok,
          },
          // navigation fields
          navigationSettings: {
            ...navigationSettings,
          },
        }
        if (_isMounted) {
          setCurrState(retrievedState)
          setOriginalState(retrievedState)
        }
      } catch (err) {
        errorToast(
          `There was a problem trying to load your settings. ${DEFAULT_RETRY_MSG}`
        )
        console.log(err)
      }
    }

    loadSettings()
    return () => {
      _isMounted = false
    }
  }, [])

  // event listener callback function that resets ColorPicker modal
  // when escape key is pressed while modal is active
  const escFunction = useCallback(
    (event) => {
      if (event.key === "Escape") {
        setColorPickerToggle(false)
      }
    },
    [setColorPickerToggle]
  )

  // event listener callback function that resets ColorPicker modal
  // when mouse clicks on area outside of modal while modal is active
  const clickFunction = useCallback(
    (event) => {
      let { target } = event
      let { tagName } = target
      // keep checking parent element until you hit a tagName of FORM
      while (tagName !== "FORM") {
        target = target.parentElement
        tagName = target.tagName
      }
      // toggle only if descendant of colorModal
      if (target.id !== "colorModal") {
        setColorPickerToggle(false)
      }
    },
    [setColorPickerToggle]
  )

  useEffect(() => {
    if (colorPickerToggle) {
      // setup escape key event listener to exit from ColorPicker modal
      document.addEventListener("keydown", escFunction)
      document.addEventListener("click", clickFunction)
    } else {
      // remove event listeners
      document.removeEventListener("keydown", escFunction)
      document.removeEventListener("click", clickFunction)
      if (!_.isEmpty(colorPicker.oldColors)) {
        setCurrState({
          ...currState,
          colors: colorPicker.oldColors,
        })
      }
    }
    return () => {
      document.removeEventListener("keydown", escFunction)
      document.removeEventListener("click", clickFunction)
    }
  }, [colorPickerToggle, escFunction, clickFunction])

  useEffect(() => {
    if (originalState) {
      const diff = getObjectDiff(currState, originalState)
      setSettingsStateDiff(diff)
      setHasChanges(!isEmpty(diff))
    }
  }, [currState])

  useEffect(() => {
    setHasErrors(!isEmpty(errors))
  }, [errors])

  const changeHandler = (event) => {
    const { id, value, parentElement } = event.target
    const grandparentElementId = parentElement?.parentElement?.id
    // const errorMessage = validateSettings(id, value);

    // although show_reach is a part of footer-fields, the CreatableSelect dropdown handler does not
    // return a normal event, so we need to handle the case separately
    if (id === "show_reach" || grandparentElementId === "footer-fields") {
      setCurrState({
        ...currState,
        otherFooterSettings: {
          ...currState.otherFooterSettings,
          [id]: value,
        },
      })
    } else if (grandparentElementId === "social-media-fields") {
      const errorMessage = validateSocialMedia(value, id)
      setCurrState({
        ...currState,
        socialMediaContent: {
          ...currState.socialMediaContent,
          [id]: value,
        },
      })
      setErrors({
        ...errors,
        socialMediaContent: {
          ...errors.socialMediaContent,
          [id]: errorMessage,
        },
      })
    } else if (grandparentElementId === "color-fields") {
      setCurrState({
        ...currState,
        colors: {
          ...currState.colors,
          [id]: value,
        },
      })
    } else if (grandparentElementId === "media-color-fields") {
      const index = id.split("@")[id.split("@").length - 1]
      const { colors } = currState

      // set value to be used to set state for media colors
      const newMediaColors = [...colors["media-colors"]]
      newMediaColors[index].color = value

      // set state
      setCurrState({
        ...currState,
        colors: {
          ...currState.colors,
          "media-colors": newMediaColors,
        },
      })
    } else if (id === "logo") {
      setCurrState({
        ...currState,
        navigationSettings: {
          ...currState.navigationSettings,
          [id]: value,
        },
      })
    } else {
      setCurrState({
        ...currState,
        [id]: value,
      })
    }
  }

  const saveSettings = async () => {
    try {
      // Construct payload
      const configSettings = {}
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
            footerSettings.social_media = settingsStateDiff[field].obj1
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
        `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`,
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
  const activateColorPicker = (event) => {
    const { colors } = currState

    const {
      target: {
        previousSibling: { id, value },
      },
    } = event
    const currentColor = value.slice(1)
    setColorPicker({
      currentColor,
      elementId: id,
      oldColors: { ...colors },
    })
    setColorPickerToggle(true)
  }

  // onColorSelect sets value of appropriate color field
  const onColorSelect = (event, color) => {
    // prevent event from reloading
    // prevent parent form from being submitted
    event.preventDefault()
    event.stopPropagation()

    // reflect color changes
    setRealTimeColor(color)

    // reset color picker
    setColorPicker({
      currentColor: "",
      elementId: "",
      oldColors: {},
    })
    setColorPickerToggle(false)
  }

  const setRealTimeColor = (color) => {
    const { elementId } = colorPicker
    const { colors } = currState
    // there is no hex property if the color submitted is the
    // same as the original color
    const hex = color.hex ? color.hex : `#${color}`

    // set state of color fields
    if (elementId === "primary-color" || elementId === "secondary-color") {
      setCurrState({
        ...currState,
        colors: {
          ...currState.colors,
          [elementId]: hex,
        },
      })
    } else {
      // set state of resource colors
      const index = elementId.split("@")[elementId.split("@").length - 1]
      const newMediaColors = _.cloneDeep(colors["media-colors"])
      newMediaColors[index].color = hex
      setCurrState({
        ...currState,
        colors: {
          ...currState.colors,
          "media-colors": newMediaColors,
        },
      })
    }
  }

  return (
    <>
      <Header
        siteName={siteName}
        isEditPage
        shouldAllowEditPageBackNav={!hasChanges}
      />
      {/* main bottom section */}
      <form className={elementStyles.wrapper}>
        {/* Color picker modal */}
        {colorPickerToggle && (
          <ColorPicker
            value={colorPicker.currentColor}
            onColorSelect={onColorSelect}
            setRealTimeColor={setRealTimeColor}
            elementId={colorPicker.elementId}
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
                  value={currState.title}
                  errorMessage={errors.title}
                  isRequired={false}
                  onFieldChange={changeHandler}
                />
                <FormFieldHorizontal
                  title="Description"
                  id="description"
                  value={currState.description}
                  errorMessage={errors.description}
                  isRequired={false}
                  onFieldChange={changeHandler}
                />
                <FormFieldToggle
                  title="Display government masthead"
                  id="is_government"
                  value={currState.is_government}
                  onFieldChange={changeHandler}
                />
              </div>
              {/* Logo fields */}
              <div id="logo-fields">
                <p className={elementStyles.formSectionHeader}>Logos</p>
                <FormFieldMedia
                  title="Agency logo"
                  id="logo"
                  value={currState.navigationSettings.logo}
                  errorMessage={errors.navigationSettings.logo}
                  isRequired
                  onFieldChange={changeHandler}
                  inlineButtonText="Choose Image"
                  siteName={siteName}
                  placeholder=" "
                  type="images"
                />
                <FormFieldMedia
                  title="Favicon"
                  id="favicon"
                  value={currState.favicon}
                  errorMessage={errors.favicon}
                  isRequired
                  onFieldChange={changeHandler}
                  inlineButtonText="Choose Image"
                  siteName={siteName}
                  placeholder=" "
                  type="images"
                />
                <FormFieldMedia
                  title="Shareicon"
                  id="shareicon"
                  value={currState.shareicon}
                  errorMessage={errors.shareicon}
                  isRequired
                  onFieldChange={changeHandler}
                  inlineButtonText="Choose Image"
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
                  value={currState.facebook_pixel}
                  errorMessage={errors.facebook_pixel}
                  isRequired={false}
                  onFieldChange={changeHandler}
                />
                <FormFieldHorizontal
                  title="Google Analytics"
                  placeholder="Google Analytics ID"
                  id="google_analytics"
                  value={currState.google_analytics}
                  errorMessage={errors.google_analytics}
                  isRequired={false}
                  onFieldChange={changeHandler}
                />
                <FormFieldHorizontal
                  title="Linkedin Insights"
                  placeholder="Linkedin Insights ID"
                  id="linkedin_insights"
                  value={currState.linkedin_insights}
                  errorMessage={errors.linkedin_insights}
                  isRequired={false}
                  onFieldChange={changeHandler}
                />
              </div>
              {/* Color fields */}
              <div id="color-fields">
                <p className={elementStyles.formSectionHeader}>Colors</p>
                <FormFieldColor
                  title="Primary"
                  id="primary-color"
                  value={currState.colors["primary-color"]}
                  isRequired
                  onFieldChange={changeHandler}
                  onColorClick={activateColorPicker}
                />
                <FormFieldColor
                  title="Secondary"
                  id="secondary-color"
                  value={currState.colors["secondary-color"]}
                  isRequired
                  onFieldChange={changeHandler}
                  onColorClick={activateColorPicker}
                />
                <div id="media-color-fields">
                  {currState.colors["media-colors"].map((category, index) => {
                    const { title: mediaColorName, color } = category
                    return (
                      <FormFieldColor
                        title={`Resource ${index + 1}`}
                        id={`media-color@${index}`}
                        value={color}
                        key={mediaColorName}
                        isRequired
                        onFieldChange={changeHandler}
                        onColorClick={activateColorPicker}
                      />
                    )
                  })}
                </div>
              </div>
              {/* Social media fields */}
              <div id="social-media-fields">
                <p className={elementStyles.formSectionHeader}>Social Media</p>
                {Object.keys(currState.socialMediaContent).map(
                  (socialMediaPage) => (
                    <FormFieldHorizontal
                      title={
                        socialMediaPage.charAt(0).toUpperCase() +
                        socialMediaPage.slice(1)
                      }
                      id={socialMediaPage}
                      value={currState.socialMediaContent[socialMediaPage]}
                      key={`${socialMediaPage}-form`}
                      errorMessage={errors.socialMediaContent[socialMediaPage]}
                      isRequired={false}
                      onFieldChange={changeHandler}
                    />
                  )
                )}
              </div>
              {/* Footer fields */}
              <div id="footer-fields">
                <p className={elementStyles.formSectionHeader}>Footer</p>
                {Object.keys(currState.otherFooterSettings).map(
                  (footerSetting) => {
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
                          value={currState.otherFooterSettings[footerSetting]}
                          key={`${footerSetting}-form`}
                          errorMessage={
                            errors.otherFooterSettings[footerSetting]
                          }
                          isRequired={false}
                          onFieldChange={changeHandler}
                        />
                      )
                    }

                    return (
                      <FormFieldHorizontal
                        title={title}
                        id={footerSetting}
                        value={currState.otherFooterSettings[footerSetting]}
                        key={`${footerSetting}-form`}
                        errorMessage={errors.otherFooterSettings[footerSetting]}
                        isRequired={false}
                        onFieldChange={changeHandler}
                      />
                    )
                  }
                )}
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
                callback={saveSettings}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default Settings

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
