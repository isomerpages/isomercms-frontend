// TODO: Clean up formatting, semi-colons, PropTypes etc
import { HStack, useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import EditorSection from "components/contact-us/Section"
import FormContext from "components/Form/FormContext"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import { GenericWarningModal } from "components/GenericWarningModal"
import Header from "components/Header"
import { LoadingButton } from "components/LoadingButton"
import update from "immutability-helper"
import _ from "lodash"
import PropTypes from "prop-types"
import { createRef, useEffect, useState } from "react"
import { DragDropContext } from "react-beautiful-dnd"

// Import hooks
import useRedirectHook from "hooks/useRedirectHook"
import useSiteColorsHook from "hooks/useSiteColorsHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import TemplateContactsSection from "templates/contact-us/ContactsSection"
import TemplateContactUsHeader from "templates/contact-us/ContactUsHeader"
import TemplateFeedbackSection from "templates/contact-us/FeedbackSection"
import TemplateLocationsSection from "templates/contact-us/LocationsSection"

import sanitiseFrontMatter from "utils/contact-us/dataSanitisers"
import validateFrontMatter from "utils/contact-us/validators"
import { useErrorToast } from "utils/toasts"
import { validateContactType, validateLocationType } from "utils/validators"

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  concatFrontMatterMdBody,
  isEmpty,
} from "utils"

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

// Constants
// ==========
const RADIX_PARSE_INT = 10

// Constructors
const ContactFieldConstructor = () => [
  { phone: "" },
  { email: "" },
  { other: "" },
]

const LocationHoursFieldConstructor = () => ({
  days: "",
  time: "",
  description: "",
})

const ContactSectionConstructor = () => ({
  content: ContactFieldConstructor(),
  title: "",
})

const LocationSectionConstructor = (operatingHoursLength) => ({
  address: ["", "", ""],
  title: "",
  operating_hours: operatingHoursLength
    ? Array(operatingHoursLength).fill(LocationHoursFieldConstructor())
    : [],
  maps_link: "",
})

const enumSection = (type, args) => {
  switch (type) {
    case "contacts":
      return ContactSectionConstructor()
    case "locations":
      return LocationSectionConstructor(args?.operatingHoursLength)
    case "contact_field":
      return ContactFieldConstructor()
    case "location_hours_field":
      return LocationHoursFieldConstructor()
    default:
      throw new Error(
        "Unreachable path! Please ensure all possible enums are covered."
      )
  }
}

const displayDeletedFrontMatter = (deletedFrontMatter) => {
  let displayText = ""
  const { contacts, locations } = deletedFrontMatter
  locations.forEach((location, i) => {
    if (!isEmpty(location)) {
      displayText += `<br/>In Location <code>${i + 1}</code>: <br/>`
      Object.entries(location).forEach(([key, value]) => {
        if (value?.length) {
          displayText += `    <code>${key}</code> field, <code>${JSON.stringify(
            value
          )}</code> is removed </br>`
        }
      })
    }
  })
  displayText += ""
  contacts.forEach((contact, i) => {
    if (!isEmpty(contact)) {
      displayText += `<br/>In Contact <code>${i + 1}</code>: <br/>`
      contact.content.forEach((obj) => {
        const [key, value] = Object.entries(obj)[0]
        if (value) {
          displayText += `    <code>${key}</code> field, <code>${JSON.stringify(
            value
          )}</code> is removed <br/>`
        }
      })
    }
  })
  return displayText
}

const EditContactUs = ({ match }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()
  const { setRedirectToNotFound } = useRedirectHook()

  const { siteName } = match.params
  const [hasLoaded, setHasLoaded] = useState(false)
  const [scrollRefs, setScrollRefs] = useState({
    sectionsScrollRefs: {
      locations: null,
      contacts: null,
      header: null,
      feedback: null,
    },
    contacts: [],
    locations: [],
  })
  const [frontMatter, setFrontMatter] = useState({})
  const [originalFrontMatter, setOriginalFrontMatter] = useState({})
  const [deletedFrontMatter, setDeletedFrontMatter] = useState({})
  const [
    sanitisedOriginalFrontMatter,
    setSanitisedOriginalFrontMatter,
  ] = useState({})
  const [frontMatterSha, setFrontMatterSha] = useState(null)
  const [footerContent, setFooterContent] = useState({})
  const [originalFooterContent, setOriginalFooterContent] = useState({})
  const [displaySections, setDisplaySections] = useState({
    sectionsDisplay: {
      locations: false,
      contacts: false,
    },
    contacts: [],
    locations: [],
  })
  const [errors, setErrors] = useState({
    contacts: [],
    locations: [],
  })
  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: null,
    type: "",
  })
  const errorToast = useErrorToast()
  const {
    isOpen: isRemovedOpen,
    onOpen: onRemovedOpen,
    onClose: onRemovedClose,
  } = useDisclosure({ defaultIsOpen: true })
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  useEffect(() => {
    let _isMounted = true

    let content
    let sha
    let newFooterContent

    const loadContactUsDetails = async () => {
      // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      try {
        const contactUsResp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/contact-us.md`
        )
        const { content: pageContent, sha: pageSha } = contactUsResp.data
        content = pageContent
        sha = pageSha
      } catch (error) {
        if (error?.response?.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast({
            description: `There was a problem trying to load your contact us page. ${DEFAULT_RETRY_MSG}`,
          })
        }
        console.log(error)
      }

      if (!content) return

      try {
        const settingsResp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`
        )
        const { feedback } = settingsResp.data
        newFooterContent = { feedback }
      } catch (err) {
        errorToast({
          description: `There was a problem trying to load your contact us page. ${DEFAULT_RETRY_MSG}`,
        })
        console.log(err)
      }

      if (!newFooterContent) return

      // split the markdown into front matter and content
      const { frontMatter: newFrontMatter } = frontMatterParser(content)

      // data cleaning for non-comforming data
      const {
        sanitisedFrontMatter,
        deletedFrontMatter: newDeletedFrontMatter,
      } = sanitiseFrontMatter(newFrontMatter)
      const { contacts, locations } = sanitisedFrontMatter
      const { contactsErrors, locationsErrors } = validateFrontMatter(
        sanitisedFrontMatter
      )

      const contactsDisplay = []
      const locationsDisplay = []
      const contactsScrollRefs = []
      const locationsScrollRefs = []

      const sectionsDisplay = {
        contacts: false,
        locations: false,
      }

      const sectionsScrollRefs = {
        header: createRef(),
        feedback: createRef(),
        contacts: createRef(),
        locations: createRef(),
      }

      contacts.forEach(() => {
        contactsDisplay.push(false)
        contactsScrollRefs.push(createRef())
      })

      locations.forEach(() => {
        locationsDisplay.push(false)
        locationsScrollRefs.push(createRef())
      })

      if (_isMounted) {
        setScrollRefs({
          sectionsScrollRefs,
          contacts: contactsScrollRefs,
          locations: locationsScrollRefs,
        })
        setFooterContent(newFooterContent)
        setOriginalFooterContent(_.cloneDeep(newFooterContent))
        setFrontMatter(sanitisedFrontMatter)
        setOriginalFrontMatter(_.cloneDeep(newFrontMatter))
        setDeletedFrontMatter(newDeletedFrontMatter)
        setSanitisedOriginalFrontMatter(_.cloneDeep(sanitisedFrontMatter))
        setFrontMatterSha(sha)
        setDisplaySections({
          sectionsDisplay,
          contacts: contactsDisplay,
          locations: locationsDisplay,
        })
        setErrors({
          contacts: contactsErrors,
          locations: locationsErrors,
        })
        setHasLoaded(true)
      }
    }

    loadContactUsDetails()

    return () => {
      _isMounted = false
    }
  }, [])

  const onDragEnd = (result) => {
    const { source, destination, type } = result

    // If the user dropped the draggable to no known droppable
    if (!destination) return

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

    const elem = frontMatter[type][source.index]
    const elemError = errors[type][source.index]
    const elemDisplay = displaySections[type][source.index]
    const elemScrollRef = scrollRefs[type][source.index]

    const newFrontMatter = update(frontMatter, {
      [type]: {
        $splice: [
          [source.index, 1], // Remove elem from its original position
          [destination.index, 0, elem], // Splice elem into its new position
        ],
      },
    })
    const newErrors = update(errors, {
      [type]: {
        $splice: [
          [source.index, 1], // Remove elem from its original position
          [destination.index, 0, elemError], // Splice elem into its new position
        ],
      },
    })
    const newDisplaySections = update(displaySections, {
      [type]: {
        $splice: [
          [source.index, 1],
          [destination.index, 0, elemDisplay],
        ],
      },
    })
    const newScrollRefs = update(scrollRefs, {
      [type]: {
        $splice: [
          [source.index, 1],
          [destination.index, 0, elemScrollRef],
        ],
      },
    })

    // scroll to new location of dragged element
    scrollRefs[type][destination.index].current.scrollIntoView()

    setScrollRefs(newScrollRefs)
    setFrontMatter(newFrontMatter)
    setErrors(newErrors)
    setDisplaySections(newDisplaySections)
  }

  const onFieldChange = async (event) => {
    try {
      const { id, value } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]

      let newFrontMatter
      let newFooterContent
      let newErrors
      switch (elemType) {
        case "feedback": {
          newFooterContent = update(footerContent, {
            [elemType]: { $set: value },
          })
          scrollRefs.sectionsScrollRefs[elemType].current.scrollIntoView()
          break
        }
        case "header": {
          const field = idArray[1]

          newFrontMatter = update(frontMatter, {
            [field]: { $set: value },
          })
          scrollRefs.sectionsScrollRefs[elemType].current.scrollIntoView()
          break
        }
        case "contacts": {
          const contactIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const contactType = idArray[2]
          const contentIndex = parseInt(idArray[3], RADIX_PARSE_INT)

          switch (contactType) {
            case "title":
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [contactIndex]: { [contactType]: { $set: value } },
                },
              })
              newErrors = update(errors, {
                [elemType]: {
                  [contactIndex]: {
                    [contactType]: {
                      $set: validateContactType(contactType, value),
                    },
                  },
                },
              })
              break
            default:
              // 'phone', 'email', 'other'
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [contactIndex]: {
                    content: {
                      [contentIndex]: { [contactType]: { $set: value } },
                    },
                  },
                },
              })
              newErrors = update(errors, {
                [elemType]: {
                  [contactIndex]: {
                    content: {
                      [contentIndex]: {
                        [contactType]: {
                          $set: validateContactType(contactType, value),
                        },
                      },
                    },
                  },
                },
              })
              break
          }
          scrollRefs[elemType][contactIndex].current.scrollIntoView()
          break
        }
        case "locations": {
          const locationIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const locationType = idArray[2] // e.g. "title" or "address"
          const fieldIndex = parseInt(idArray[3], RADIX_PARSE_INT)
          const fieldType = idArray[4]

          switch (locationType) {
            case "operating_hours":
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [locationIndex]: {
                    [locationType]: {
                      [fieldIndex]: { [fieldType]: { $set: value } },
                    },
                  },
                },
              })
              newErrors = update(errors, {
                locations: {
                  [locationIndex]: {
                    [locationType]: {
                      [fieldIndex]: {
                        [fieldType]: {
                          $set: validateLocationType(fieldType, value),
                        },
                      },
                    },
                  },
                },
              })
              break
            case "add_operating_hours":
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [locationIndex]: {
                    operating_hours: {
                      $push: [enumSection("location_hours_field")],
                    },
                  },
                },
              })
              newErrors = update(errors, {
                [elemType]: {
                  [locationIndex]: {
                    operating_hours: {
                      $push: [enumSection("location_hours_field")],
                    },
                  },
                },
              })
              break
            case "remove_operating_hours":
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [locationIndex]: {
                    operating_hours: { $splice: [[fieldIndex, 1]] },
                  },
                },
              })
              newErrors = update(errors, {
                [elemType]: {
                  [locationIndex]: {
                    operating_hours: { $splice: [[fieldIndex, 1]] },
                  },
                },
              })
              break
            case "address": {
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [locationIndex]: {
                    [locationType]: { [fieldIndex]: { $set: value } },
                  },
                },
              })
              // for address, we validate all address fields together, not the single field
              const addressFields =
                newFrontMatter.locations[locationIndex][locationType]
              newErrors = update(errors, {
                [elemType]: {
                  [locationIndex]: {
                    [locationType]: {
                      $set: validateLocationType(locationType, addressFields),
                    },
                  },
                },
              })
              break
            }
            default:
              newFrontMatter = update(frontMatter, {
                [elemType]: {
                  [locationIndex]: { [locationType]: { $set: value } },
                },
              })
              newErrors = update(errors, {
                [elemType]: {
                  [locationIndex]: {
                    [locationType]: {
                      $set: validateLocationType(locationType, value),
                    },
                  },
                },
              })
              break
          }
          scrollRefs[elemType][locationIndex].current.scrollIntoView()
          break
        }
        default:
          throw new Error(
            "Unreachable path! Please ensure all possible enums are covered."
          )
      }
      setFrontMatter(
        _.isUndefined(newFrontMatter) ? frontMatter : newFrontMatter
      )
      setFooterContent(
        _.isUndefined(newFooterContent) ? footerContent : newFooterContent
      )
      setErrors(_.isUndefined(newErrors) ? errors : newErrors)
    } catch (err) {
      console.log(err)
    }
  }

  const createHandler = async (event) => {
    const { id } = event.target
    try {
      const {
        contacts: contactsDisplay,
        locations: locationsDisplay,
      } = displaySections

      const resetDisplaySections = {
        sectionsDisplay: displaySections.sectionsDisplay,
        contacts: _.fill(Array(contactsDisplay.length), false),
        locations: _.fill(Array(locationsDisplay.length), false),
      }
      const modifiedDisplaySections = update(resetDisplaySections, {
        [id]: { $push: [true] },
      })

      const newFrontMatter = update(frontMatter, {
        [id]: { $push: [enumSection(id)] },
      })
      const newErrors = update(errors, {
        [id]: { $push: [enumSection(id)] },
      })
      const newDisplaySections = update(displaySections, {
        $set: modifiedDisplaySections,
      })
      const newScrollRefs = update(scrollRefs, {
        [id]: { $push: [createRef()] },
      })

      if (scrollRefs[id].length) {
        // Scroll to an approximation of where the new field will be based on the current last field, calibrated from the bottom of page
        _.last(scrollRefs[id]).current.scrollIntoView()
      } else {
        scrollRefs.sectionsScrollRefs[id].current.scrollIntoView()
      }

      setScrollRefs(newScrollRefs)
      setFrontMatter(newFrontMatter)
      setErrors(newErrors)
      setDisplaySections(newDisplaySections)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split("-")
      const elemType = idArray[0]
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT)

      const newFrontMatter = update(frontMatter, {
        [elemType]: { $splice: [[sectionIndex, 1]] },
      })
      const newErrors = update(errors, {
        [elemType]: { $splice: [[sectionIndex, 1]] },
      })
      const newDisplaySections = update(displaySections, {
        [elemType]: { $splice: [[sectionIndex, 1]] },
      })
      const newScrollRefs = update(scrollRefs, {
        [elemType]: { $splice: [[sectionIndex, 1]] },
      })

      setScrollRefs(newScrollRefs)

      setFrontMatter(newFrontMatter)
      setErrors(newErrors)
      setDisplaySections(newDisplaySections)
    } catch (err) {
      console.log(err)
    }
  }

  const displayHandler = async (event) => {
    try {
      const {
        contacts: contactsDisplay,
        locations: locationsDisplay,
      } = displaySections

      const { id } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT) || idArray[1]

      const resetDisplaySections = {
        sectionsDisplay: {
          contacts: false,
          locations: false,
        },
        contacts: _.fill(Array(contactsDisplay.length), false),
        locations: _.fill(Array(locationsDisplay.length), false),
      }

      let newDisplaySections
      switch (elemType) {
        case "section": {
          const currDisplayValue = displaySections.sectionsDisplay[sectionIndex]
          resetDisplaySections.sectionsDisplay[sectionIndex] = !currDisplayValue
          newDisplaySections = update(displaySections, {
            $set: resetDisplaySections,
          })
          scrollRefs.sectionsScrollRefs[sectionIndex].current.scrollIntoView()
          break
        }
        default: {
          const currDisplayValue = displaySections[elemType][sectionIndex]
          resetDisplaySections[elemType][sectionIndex] = !currDisplayValue
          newDisplaySections = update(displaySections, {
            [elemType]: { $set: resetDisplaySections[elemType] },
          })
          scrollRefs[elemType][sectionIndex].current.scrollIntoView()
          break
        }
      }

      setDisplaySections(newDisplaySections)
    } catch (err) {
      console.log(err)
    }
  }

  const savePage = async () => {
    try {
      // Update contact-us
      // Filter out components which have no input
      const filteredFrontMatter = _.cloneDeep(frontMatter)

      const newContacts = []
      frontMatter.contacts.forEach((contact) => {
        if (!isEmpty(contact)) {
          newContacts.push(_.cloneDeep(contact))
        }
      })
      const newLocations = []
      frontMatter.locations.forEach((location) => {
        if (!isEmpty(location)) {
          const newLocation = _.cloneDeep(location)
          const newOperatingHours = []
          location.operating_hours.forEach((operatingHour) => {
            // remove empty operatingHours objects
            if (!isEmpty(operatingHour)) {
              newOperatingHours.push(_.cloneDeep(operatingHour))
            }
          })
          newLocation.operating_hours = newOperatingHours
          newLocations.push(newLocation)
        }
      })

      filteredFrontMatter.contacts = newContacts
      filteredFrontMatter.locations = newLocations

      // If array is empty, delete the object
      if (!filteredFrontMatter.contacts.length)
        delete filteredFrontMatter.contacts
      if (!filteredFrontMatter.locations.length)
        delete filteredFrontMatter.locations

      const content = concatFrontMatterMdBody(filteredFrontMatter, "")

      const frontMatterParams = {
        content,
        sha: frontMatterSha,
      }

      if (JSON.stringify(originalFrontMatter) !== JSON.stringify(frontMatter)) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/contact-us.md`,
          frontMatterParams,
          {
            withCredentials: true,
          }
        )
      }

      // Update settings
      const updatedFooterContents = _.cloneDeep(footerContent)

      const footerParams = {
        ...updatedFooterContents,
      }

      if (
        JSON.stringify(footerContent) !== JSON.stringify(originalFooterContent)
      ) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`,
          footerParams,
          {
            withCredentials: true,
          }
        )
      }

      window.location.reload()
    } catch (err) {
      errorToast({
        description: `There was a problem trying to save your contact us page. ${DEFAULT_RETRY_MSG}`,
      })
      console.log(err)
    }
  }

  const hasErrors = () => {
    return !isEmpty(errors.contacts) || !isEmpty(errors.locations)
  }

  const hasChanges = () => {
    return (
      JSON.stringify(sanitisedOriginalFrontMatter) ===
        JSON.stringify(frontMatter) &&
      JSON.stringify(footerContent) === JSON.stringify(originalFooterContent)
    )
  }

  return (
    <>
      {!isEmpty(deletedFrontMatter) && (
        <GenericWarningModal
          isOpen={isRemovedOpen}
          onClose={onRemovedClose}
          displayTitle="Removed content"
          displayText={`Some of your content has been removed as it is incompatible with the new Isomer format. No changes are permanent unless you press Save on the next page.<br/>${displayDeletedFrontMatter(
            deletedFrontMatter
          )}`}
        >
          <Button onClick={onRemovedClose}>Acknowledge</Button>
        </GenericWarningModal>
      )}
      {itemPendingForDelete.id && (
        <GenericWarningModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setItemPendingForDelete({ id: null, type: "" })
            onDeleteClose()
          }}
          displayTitle={`Delete ${itemPendingForDelete.type} section`}
          displayText={`Are you sure you want to delete ${itemPendingForDelete.type}?`}
        >
          <Button
            variant="clear"
            colorScheme="secondary"
            onClick={() => {
              setItemPendingForDelete({ id: null, type: "" })
              onDeleteClose()
            }}
          >
            Cancel
          </Button>
          <Button
            colorScheme="danger"
            onClick={() => {
              deleteHandler(itemPendingForDelete.id)
              setItemPendingForDelete({ id: null, type: "" })
              onDeleteClose()
            }}
          >
            Yes, delete
          </Button>
        </GenericWarningModal>
      )}
      <Header
        siteName={siteName}
        title="Contact Us"
        shouldAllowEditPageBackNav={hasChanges()}
        isEditPage
        backButtonText="Back to My Workspace"
        backButtonUrl={`/sites/${siteName}/workspace`}
      />
      {hasLoaded && (
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <div className={elementStyles.cardHeader}>
                  <h2>Site Settings</h2>
                </div>
                <FormContext isRequired>
                  <FormTitle>Agency Name</FormTitle>
                  <FormField
                    placeholder="Agency Name"
                    id="header-agency_name"
                    value={frontMatter.agency_name || ""}
                    onChange={onFieldChange}
                  />
                  <FormTitle>Feedback Url</FormTitle>
                  <FormField
                    placeholder="Feedback Url"
                    id="feedback"
                    value={footerContent.feedback || ""}
                    onChange={onFieldChange}
                  />
                </FormContext>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <EditorSection
                  cards={frontMatter.locations}
                  onFieldChange={onFieldChange}
                  createHandler={createHandler}
                  deleteHandler={(event, type) => {
                    setItemPendingForDelete({ id: event.target.id, type })
                    onDeleteOpen()
                  }}
                  shouldDisplay={displaySections.sectionsDisplay.locations}
                  displayCards={displaySections.locations}
                  displayHandler={displayHandler}
                  errors={errors.locations}
                  sectionId="locations"
                />

                <EditorSection
                  cards={frontMatter.contacts}
                  onFieldChange={onFieldChange}
                  createHandler={createHandler}
                  deleteHandler={(event, type) => {
                    setItemPendingForDelete({ id: event.target.id, type })
                    onDeleteOpen()
                  }}
                  shouldDisplay={displaySections.sectionsDisplay.contacts}
                  displayCards={displaySections.contacts}
                  displayHandler={displayHandler}
                  errors={errors.contacts}
                  sectionId="contacts"
                />
              </DragDropContext>
            </div>
          </div>
          <div className={`${editorStyles.contactUsEditorMain} `}>
            {/* contact-us header */}
            <TemplateContactUsHeader
              agencyName={frontMatter.agency_name}
              ref={scrollRefs.sectionsScrollRefs.header}
            />
            {/* contact-us content */}
            <section className="bp-section is-small padding--bottom--lg">
              <div className="bp-container">
                <div className="row">
                  <div className="col is-8 is-offset-2">
                    <TemplateLocationsSection
                      locations={frontMatter.locations}
                      scrollRefs={scrollRefs.locations}
                      ref={scrollRefs.sectionsScrollRefs.locations}
                    />
                    <TemplateContactsSection
                      contacts={frontMatter.contacts}
                      scrollRefs={scrollRefs.contacts}
                      ref={scrollRefs.sectionsScrollRefs.contacts}
                    />
                    <TemplateFeedbackSection
                      feedback={footerContent.feedback}
                      ref={scrollRefs.sectionsScrollRefs.feedback}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <HStack w="100%" justify="flex-end">
              {!isEmpty(deletedFrontMatter) && (
                <LoadingButton
                  ml="auto"
                  variant="clear"
                  onClick={onRemovedOpen}
                >
                  See removed content
                </LoadingButton>
              )}
              <LoadingButton
                label="Save"
                isDisabled={hasErrors()}
                onClick={savePage}
              >
                Save
              </LoadingButton>
            </HStack>
          </div>
        </div>
      )}
    </>
  )
}

export default EditContactUs

EditContactUs.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
