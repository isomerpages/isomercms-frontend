import Footer from "components/Footer"
import FormFieldHorizontal from "components/FormFieldHorizontal"
import FormFieldMedia from "components/FormFieldMedia"
import FormFieldToggle from "components/FormFieldToggle"
import GenericWarningModal from "components/GenericWarningModal"
import Header from "components/Header"
import ColorPickerSection from "components/settings/ColorPickerSection"
import Sidebar from "components/Sidebar"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

import { useGetSettingsHook, useUpdateSettingsHook } from "hooks/settingsHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { errorToast } from "utils/toasts"
import { validateSocialMedia } from "utils/validators"

import { DEFAULT_RETRY_MSG, getObjectDiff, isEmpty } from "utils"

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
  const { params, decodedParams } = match
  const { siteName } = decodedParams

  const [currState, setCurrState] = useState(stateFields)
  const [originalState, setOriginalState] = useState()
  const [hasErrors, setHasErrors] = useState(false)
  const [errors, setErrors] = useState(
    _.omit(_.cloneDeep(stateFields), "colors")
  )
  const [hasChanges, setHasChanges] = useState(false)
  const [hasSettingsChanged, setHasSettingsChanged] = useState(false)
  const [settingsStateDiff, setSettingsStateDiff] = useState()
  const [showOverwriteWarning, setShowOverwriteWarning] = useState()

  const { data: settingsData } = useGetSettingsHook(params)

  const {
    mutateAsync: updateSettingsHandler,
    isLoading: isSavingSettings,
  } = useUpdateSettingsHook(params, {
    onError: (err) => {
      if (err.response.status === 409) setShowOverwriteWarning(true)
    },
    onSuccess: () => {
      setHasChanges(false)
      setHasSettingsChanged(false)
    },
  })

  useEffect(() => {
    if (settingsData && !hasChanges) {
      const {
        configSettings,
        footerSettings,
        navigationSettings,
      } = settingsData

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
          facebook: footerSettings.social_media?.facebook,
          twitter: footerSettings.social_media?.twitter,
          youtube: footerSettings.social_media?.youtube,
          instagram: footerSettings.social_media?.instagram,
          linkedin: footerSettings.social_media?.linkedin,
          telegram: footerSettings.social_media?.telegram,
          tiktok: footerSettings.social_media?.tiktok,
        },
        // navigation fields
        navigationSettings: {
          ...navigationSettings,
        },
      }
      setCurrState(retrievedState)
      setOriginalState(retrievedState)
    } else if (settingsData && hasChanges) {
      setHasSettingsChanged(true)
    }
  }, [settingsData])

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

      updateSettingsHandler({
        configSettings,
        footerSettings,
        navigationSettings,
      })
    } catch (err) {
      errorToast(
        `There was a problem trying to save your settings. ${DEFAULT_RETRY_MSG}`
      )
      console.log(err)
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
              <ColorPickerSection
                colors={currState.colors}
                saveChanges={(selectedColors) => {
                  setCurrState({
                    ...currState,
                    colors: selectedColors,
                  })
                }}
              />
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
          </div>
        </div>
      </form>
      <Footer
        isKeyButtonDisabled={hasErrors || isSavingSettings}
        keyCallback={() => {
          if (hasSettingsChanged) {
            setShowOverwriteWarning(true)
          } else {
            saveSettings()
          }
        }}
        keyButtonText="Save"
        keyButtonIsLoading={isSavingSettings}
      />
      {showOverwriteWarning && (
        <GenericWarningModal
          displayTitle="Override Changes"
          displayText={`Your site settings have recently been changed by another user. You can choose to either override their changes, or go back to editing.
            <br/><br/>We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes.`}
          onProceed={() => {
            setShowOverwriteWarning(false)
            saveSettings()
          }}
          onCancel={() => setShowOverwriteWarning(false)}
          cancelText="Back to Editing"
          proceedText="Override"
        />
      )}
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
