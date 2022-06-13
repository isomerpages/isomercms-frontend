import { Button } from "@opengovsg/design-system-react"
import Footer from "components/Footer"
import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldHorizontal from "components/FormFieldHorizontal"
import FormFieldMedia from "components/FormFieldMedia"
import FormFieldToggle from "components/FormFieldToggle"
import GenericWarningModal from "components/GenericWarningModal"
import Header from "components/Header"
import ColorPickerSection from "components/settings/ColorPickerSection"
import Sidebar from "components/Sidebar"
import Spacing from "components/Spacing/Spacing"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import { useGetSettingsHook, useUpdateSettingsHook } from "hooks/settingsHooks"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { useErrorToast } from "utils/toasts"
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
  contact_us: "",
  feedback: "",
  faq: "",
  show_reach: "",
  logo: "",
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

const OTHER_FOOTER_SETTINGS = ["contact_us", "feedback", "faq", "show_reach"]

const getTitle = (unprocessedTitle) =>
  unprocessedTitle
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

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
  const errorToast = useErrorToast()

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
      const retrievedState = {
        ...stateFields,
        ...settingsData,
        socialMediaContent: {
          facebook: settingsData.social_media?.facebook,
          twitter: settingsData.social_media?.twitter,
          youtube: settingsData.social_media?.youtube,
          instagram: settingsData.social_media?.instagram,
          linkedin: settingsData.social_media?.linkedin,
          telegram: settingsData.social_media?.telegram,
          tiktok: settingsData.social_media?.tiktok,
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
    const ancesterElementId =
      parentElement?.parentElement?.parentElement?.parentElement?.id

    // although show_reach is a part of footer-fields, the CreatableSelect dropdown handler does not
    // return a normal event, so we need to handle the case separately
    if (id === "show_reach" || ancesterElementId === "footer-fields") {
      setCurrState({
        ...currState,
        [id]: value,
      })
    } else if (ancesterElementId === "social-media-fields") {
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
    } else if (ancesterElementId === "color-fields") {
      setCurrState({
        ...currState,
        colors: {
          ...currState.colors,
          [id]: value,
        },
      })
    } else if (ancesterElementId === "media-color-fields") {
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
      Object.keys(settingsStateDiff).forEach((field) => {
        if (field === "facebook_pixel") {
          configSettings["facebook-pixel"] = settingsStateDiff[field].obj1 // rename due to quirks on isomer template
        } else if (field === "linkedin_insights") {
          configSettings["linkedin-insights"] = settingsStateDiff[field].obj1 // rename due to quirks on isomer template
        } else if (field === "socialMediaContent") {
          configSettings.social_media = settingsStateDiff[field].obj1
        } else {
          configSettings[field] = settingsStateDiff[field].obj1
        }
      })

      updateSettingsHandler({
        configSettings,
      })
    } catch (err) {
      errorToast({
        description: `There was a problem trying to save your settings. ${DEFAULT_RETRY_MSG}`,
      })
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
                <Spacing>
                  <FormContext hasError={!!errors.title}>
                    <FormTitle>Title</FormTitle>
                    <FormFieldHorizontal
                      placeholder="Title"
                      id="title"
                      value={currState.title}
                      onChange={changeHandler}
                    />
                    <FormError>{errors.title}</FormError>
                  </FormContext>
                  <FormContext hasError={!!errors.description}>
                    <FormTitle>Description</FormTitle>
                    <FormFieldHorizontal
                      placeholder="Description"
                      id="description"
                      value={currState.description}
                      onChange={changeHandler}
                    />
                    <FormError>{errors.description}</FormError>
                  </FormContext>
                  <FormContext
                    hasError={!!errors.shareicon}
                    onFieldChange={changeHandler}
                    isRequired
                  >
                    <FormTitle>Shareicon</FormTitle>
                    <FormFieldMedia
                      value={currState.shareicon}
                      id="shareicon"
                      inlineButtonText="Choose Image"
                    />
                    <FormError>{errors.shareicon}</FormError>
                  </FormContext>
                </Spacing>
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
                <Spacing>
                  <FormContext
                    hasError={!!errors.logo}
                    onFieldChange={changeHandler}
                    isRequired
                  >
                    <FormTitle>Agency logo</FormTitle>
                    <FormFieldMedia
                      value={currState.logo}
                      id="logo"
                      inlineButtonText="Choose Image"
                    />
                    <FormError>{errors.logo}</FormError>
                  </FormContext>

                  <FormContext
                    hasError={!!errors.favicon}
                    onFieldChange={changeHandler}
                    isRequired
                  >
                    <FormTitle>Favicon</FormTitle>
                    <FormFieldMedia
                      value={currState.favicon}
                      id="favicon"
                      inlineButtonText="Choose Image"
                    />
                    <FormError>{errors.favicon}</FormError>
                  </FormContext>
                </Spacing>
              </div>
              {/* Analytics fields */}
              <div id="analytics-fields">
                <p className={elementStyles.formSectionHeader}>Analytics</p>
                <Spacing>
                  <FormContext hasError={!!errors.facebook_pixel}>
                    <FormTitle>Facebook Pixel</FormTitle>
                    <FormFieldHorizontal
                      placeholder="Facebook Pixel ID"
                      id="facebook_pixel"
                      value={currState.facebook_pixel}
                      onChange={changeHandler}
                    />
                    <FormError>{errors.facebook_pixel}</FormError>
                  </FormContext>
                  <FormContext hasError={!!errors.google_analytics}>
                    <FormTitle>Google Analytics</FormTitle>
                    <FormFieldHorizontal
                      placeholder="Google Analytics ID"
                      id="google_analytics"
                      value={currState.google_analytics}
                      onChange={changeHandler}
                    />
                    <FormError>{errors.google_analytics}</FormError>
                  </FormContext>
                  <FormContext hasError={!!errors.linkedin_insights}>
                    <FormTitle>Linkedin Insights</FormTitle>
                    <FormFieldHorizontal
                      placeholder="Linkedin Insights ID"
                      id="linkedin_insights"
                      value={currState.linkedin_insights}
                      onChange={changeHandler}
                    />
                    <FormError>{errors.linkedin_insights}</FormError>
                  </FormContext>
                </Spacing>
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
                <Spacing>
                  {_.keys(currState.socialMediaContent).map(
                    (socialMediaPage) => {
                      const formTitle =
                        socialMediaPage.charAt(0).toUpperCase() +
                        socialMediaPage.slice(1)

                      return (
                        // NOTE: The FormContext has to be here because the error is tied to
                        // the object's keys, which is local to the FormField
                        <FormContext
                          hasError={
                            !!errors.socialMediaContent[socialMediaPage]
                          }
                        >
                          <FormTitle>{formTitle}</FormTitle>
                          <FormFieldHorizontal
                            placeholder={formTitle}
                            id={socialMediaPage}
                            value={_.get(
                              currState,
                              `socialMediaContent.${socialMediaPage}`
                            )}
                            key={`${socialMediaPage}-form`}
                            onChange={changeHandler}
                          />
                          <FormError>
                            {errors.socialMediaContent[socialMediaPage]}
                          </FormError>
                        </FormContext>
                      )
                    }
                  )}
                </Spacing>
              </div>
              {/* Footer fields */}
              <div id="footer-fields">
                <p className={elementStyles.formSectionHeader}>Footer</p>
                <Spacing>
                  {_.without(OTHER_FOOTER_SETTINGS, "show_reach").map(
                    (footerSetting) => {
                      const title = getTitle(footerSetting)

                      return (
                        <FormContext hasError={!!errors[footerSetting]}>
                          <FormTitle>{title}</FormTitle>
                          <FormFieldHorizontal
                            placeholder={title}
                            id={footerSetting}
                            value={currState[footerSetting]}
                            key={`${footerSetting}-form`}
                            onChange={changeHandler}
                          />
                          <FormError>{errors[footerSetting]}</FormError>
                        </FormContext>
                      )
                    }
                  )}
                </Spacing>
                {["show_reach"].map((footerSetting) => (
                  <FormFieldToggle
                    title={getTitle(footerSetting)}
                    id={footerSetting}
                    value={currState[footerSetting]}
                    key={`${footerSetting}-form`}
                    errorMessage={errors[footerSetting]}
                    isRequired={false}
                    onFieldChange={changeHandler}
                  />
                ))}
              </div>
              <br />
              <br />
            </div>
          </div>
        </div>
      </form>
      <Footer>
        <Button
          isDisabled={hasErrors || isSavingSettings}
          onClick={() => {
            if (hasSettingsChanged) {
              setShowOverwriteWarning(true)
            } else {
              saveSettings()
            }
          }}
          isLoading={isSavingSettings}
        >
          Save
        </Button>
      </Footer>
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
