// TODO: Clean up formatting, semi-colons, PropTypes etc
import {
  Divider,
  Box,
  Text,
  Code,
  useDisclosure,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import update from "immutability-helper"
import _ from "lodash"
import PropTypes from "prop-types"
import { createRef, useEffect, useState } from "react"

import { Editable } from "components/Editable"
import { Footer } from "components/Footer"
import Header from "components/Header"
import { LoadingButton } from "components/LoadingButton"
import { WarningModal } from "components/WarningModal"

// Import hooks
import { EditableContextProvider } from "contexts/EditableContext"

import {
  useGetContactUsHook,
  useUpdateContactUsHook,
} from "hooks/directoryHooks/contactUsHooks"
import { useGetSettings, useUpdateSettings } from "hooks/settingsHooks"
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

import { DEFAULT_RETRY_MSG, isEmpty } from "utils"

import { CardsSection } from "./components/ContactUs/CardsSection"
import { GeneralInfoSection } from "./components/ContactUs/GeneralInfoSection"

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

const validateHeaderTitle = (title) => {
  if (title.length < 1) {
    return "Name cannot be empty"
  }
  if (title.length > 100) {
    return "Name cannot exceed 100 characters"
  }
  return ""
}

const validateFeedbackUrl = (url) => {
  if (url.length > 0 && !url.startsWith("https://")) {
    return "Check that you have a valid URL"
  }
  return ""
}

const displayDeletedFrontMatter = (deletedFrontMatter) => {
  const displayText = []
  const { contacts, locations } = deletedFrontMatter
  if (locations && !isEmpty(locations)) {
    locations.forEach((location, i) => {
      if (!isEmpty(location)) {
        displayText.push(
          <>
            <br />
            <Text>
              In Location <Code colorScheme="danger">{i + 1}</Code>:
            </Text>
          </>
        )
        Object.entries(location).forEach(([key, value]) => {
          if (value?.length) {
            displayText.push(
              <Text textIndent="1rem">
                <Code colorScheme="danger">{key}</Code> field,{" "}
                <Code colorScheme="danger">{JSON.stringify(value)}</Code> is
                removed
              </Text>
            )
          }
          return null
        })
      }
    })
  }
  if (contacts && !isEmpty(contacts)) {
    contacts.forEach((contact, i) => {
      if (!isEmpty(contact)) {
        displayText.push(
          <>
            <br />
            <Text>In Location {i + 1}:</Text>
          </>
        )
        contact.content.forEach((obj) => {
          const [key, value] = Object.entries(obj)[0]
          if (value)
            displayText.push(
              <Text textIndent="1rem">
                <Code colorScheme="danger">{key}</Code> field,{" "}
                <Code colorScheme="danger">{JSON.stringify(value)}</Code> is
                removed
              </Text>
            )
          return null
        })
      }
    })
  }

  return displayText
}

// NOTE: `scrollIntoView` does not work when called synchronously
// to avoid this problem, we do a `setTimeout` to wrap it.
// This calls it after 1ms, which allows it to work.
const scrollTo = (ref) => {
  setTimeout(() =>
    ref.current.scrollIntoView({
      behavior: "smooth",
    })
  )
}

const EditContactUs = ({ match }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()

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
    isOpen: isRemovedContentWarningOpen,
    onOpen: onRemovedContentWarningOpen,
    onClose: onRemovedContentWarningClose,
  } = useDisclosure({ defaultIsOpen: true })
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()
  const { data: contactUsDetails } = useGetContactUsHook(siteName)
  const { data: settingsData } = useGetSettings(siteName)

  const { mutateAsync: updateContactUs } = useUpdateContactUsHook(siteName)
  const { mutateAsync: updateSettings } = useUpdateSettings(siteName)

  useEffect(() => {
    if (!contactUsDetails || !settingsData) return

    const { content, sha } = contactUsDetails

    const loadContactUsDetails = async () => {
      // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      const { feedback } = settingsData
      const newFooterContent = { feedback }

      // split the markdown into front matter and content
      const { frontMatter: newFrontMatter } = content

      // data cleaning for non-comforming data
      const {
        sanitisedFrontMatter,
        deletedFrontMatter: newDeletedFrontMatter,
      } = sanitiseFrontMatter(newFrontMatter)
      const { contacts, locations } = sanitisedFrontMatter
      const { contactsErrors, locationsErrors } = validateFrontMatter(
        sanitisedFrontMatter
      )

      const contactsScrollRefs = []
      const locationsScrollRefs = []

      const sectionsScrollRefs = {
        header: createRef(),
        feedback: createRef(),
        contacts: createRef(),
        locations: createRef(),
      }

      contacts.forEach(() => {
        contactsScrollRefs.push(createRef())
      })

      locations.forEach(() => {
        locationsScrollRefs.push(createRef())
      })

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
      setErrors({
        contacts: contactsErrors,
        locations: locationsErrors,
      })
      setHasLoaded(true)
    }

    loadContactUsDetails()
  }, [contactUsDetails, settingsData])

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

    let elem = ""
    let elemError = ""
    let elemScrollRef = ""
    let newFrontMatter = ""
    let newErrors = ""
    let newScrollRefs = ""

    if (type.startsWith("locations-")) {
      const idTokens = type.split("-")
      const parentId = idTokens[1]
      const subtype = idTokens[2]

      elem = frontMatter.locations[parentId][subtype][source.index]
      elemError = errors.locations[parentId][subtype][source.index]
      elemScrollRef = scrollRefs.locations[parentId]

      newFrontMatter = update(frontMatter, {
        locations: {
          [parentId]: {
            [subtype]: {
              $splice: [
                [source.index, 1], // Remove elem from its original position
                [destination.index, 0, elem], // Splice elem into its new position
              ],
            },
          },
        },
      })

      newErrors = update(errors, {
        locations: {
          [parentId]: {
            [subtype]: {
              $splice: [
                [source.index, 1], // Remove elem from its original position
                [destination.index, 0, elemError], // Splice elem into its new position
              ],
            },
          },
        },
      })

      newScrollRefs = update(scrollRefs, {})
    } else {
      elem = frontMatter[type][source.index]
      elemError = errors[type][source.index]
      elemScrollRef = scrollRefs[type][source.index]

      newFrontMatter = update(frontMatter, {
        [type]: {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, elem], // Splice elem into its new position
          ],
        },
      })
      newErrors = update(errors, {
        [type]: {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, elemError], // Splice elem into its new position
          ],
        },
      })
      newScrollRefs = update(scrollRefs, {
        [type]: {
          $splice: [
            [source.index, 1],
            [destination.index, 0, elemScrollRef],
          ],
        },
      })

      // scroll to new location of dragged element
      scrollTo(scrollRefs[type][destination.index])
    }

    setScrollRefs(newScrollRefs)
    setFrontMatter(newFrontMatter)
    setErrors(newErrors)
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
          newErrors = update(errors, {
            [elemType]: {
              $set: validateFeedbackUrl(value),
            },
          })
          scrollTo(scrollRefs.sectionsScrollRefs[elemType])
          break
        }
        case "header": {
          const field = idArray[1]

          newFrontMatter = update(frontMatter, {
            [field]: { $set: value },
          })
          newErrors = update(errors, {
            [field]: {
              $set: validateHeaderTitle(value),
            },
          })
          scrollTo(scrollRefs.sectionsScrollRefs[elemType])
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
          scrollTo(scrollRefs[elemType][contactIndex])
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
          scrollTo(scrollRefs[elemType][locationIndex])
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

  const onDeleteClick = (id, type) => {
    if (type === "operating hours") {
      // Skip using the modal
      onFieldChange({ target: { id, value: "" } })
    } else {
      setItemPendingForDelete({ id, type })
      onDeleteModalOpen()
    }
  }

  const createHandler = async (event) => {
    const { id } = event.target
    try {
      const newFrontMatter = update(frontMatter, {
        [id]: { $push: [enumSection(id)] },
      })
      const newErrors = update(errors, {
        [id]: { $push: [enumSection(id)] },
      })
      const newScrollRefs = update(scrollRefs, {
        [id]: { $push: [createRef()] },
      })

      if (scrollRefs[id].length) {
        // Scroll to an approximation of where the new field will be based on the current last field, calibrated from the bottom of page
        scrollTo(_.last(scrollRefs[id]))
      } else {
        scrollTo(scrollRefs.sectionsScrollRefs[id])
      }

      setScrollRefs(newScrollRefs)
      setFrontMatter(newFrontMatter)
      setErrors(newErrors)
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
      const newScrollRefs = update(scrollRefs, {
        [elemType]: { $splice: [[sectionIndex, 1]] },
      })

      setScrollRefs(newScrollRefs)

      setFrontMatter(newFrontMatter)
      setErrors(newErrors)
    } catch (err) {
      console.log(err)
    }
  }

  const displayHandler = async (id) => {
    // ID is -1 when the accordion item is collapsed
    if (id === -1) {
      return
    }

    const allScrollRefs = _.concat(
      scrollRefs.sectionsScrollRefs.header,
      scrollRefs.locations,
      scrollRefs.contacts
    )
    scrollTo(allScrollRefs[id])
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
      filteredFrontMatter.feedback = frontMatter.feedback || ""

      // Contact information is required
      if (!filteredFrontMatter.contacts.length) {
        errorToast({
          id: "contact-information-required-error",
          description:
            "You must add at least one contact information to your Contact Us page.",
        })
        return
      }

      // If array is empty, delete the object
      if (!filteredFrontMatter.locations.length)
        delete filteredFrontMatter.locations

      if (JSON.stringify(originalFrontMatter) !== JSON.stringify(frontMatter)) {
        await updateContactUs({
          frontMatter: filteredFrontMatter,
          sha: frontMatterSha,
        })
      }

      // Update settings
      const updatedFooterContents = _.cloneDeep(footerContent)

      const footerParams = {
        ...updatedFooterContents,
      }

      if (
        JSON.stringify(footerContent) !== JSON.stringify(originalFooterContent)
      ) {
        await updateSettings({
          ...settingsData,
          ...footerParams,
        })
      }
    } catch (err) {
      errorToast({
        id: "update-contact-us-error",
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
      <WarningModal
        isOpen={!isEmpty(deletedFrontMatter) && isRemovedContentWarningOpen}
        onClose={onRemovedContentWarningClose}
        displayTitle="Removed content"
        displayText={
          <Box>
            <Text>
              Some of your content has been removed as it is incompatible with
              the new Isomer format. No changes are permanent unless you press
              Save on the next page.
            </Text>
            <br />
            <>{displayDeletedFrontMatter(deletedFrontMatter)}</>
          </Box>
        }
      >
        <Button onClick={onRemovedContentWarningClose}>Acknowledge</Button>
      </WarningModal>

      <WarningModal
        isOpen={itemPendingForDelete.id && isDeleteModalOpen}
        onClose={() => {
          setItemPendingForDelete({ id: null, type: "" })
          onDeleteModalClose()
        }}
        displayTitle={`Delete ${itemPendingForDelete.type} section`}
        displayText={
          <Text>
            Are you sure you want to delete {itemPendingForDelete.type}?
          </Text>
        }
      >
        <Button
          variant="clear"
          colorScheme="secondary"
          onClick={() => {
            setItemPendingForDelete({ id: null, type: "" })
            onDeleteModalClose()
          }}
        >
          Cancel
        </Button>
        <Button
          colorScheme="critical"
          onClick={() => {
            deleteHandler(itemPendingForDelete.id)
            setItemPendingForDelete({ id: null, type: "" })
            onDeleteModalClose()
          }}
        >
          Yes, delete
        </Button>
      </WarningModal>

      <VStack>
        <Header
          title="Contact Us"
          shouldAllowEditPageBackNav={hasChanges()}
          isEditPage
          backButtonText="Back to My Workspace"
          backButtonUrl={`/sites/${siteName}/workspace`}
        />
        {hasLoaded && (
          <>
            {/* Left column: Editor sidebar */}
            <EditableContextProvider
              onDragEnd={onDragEnd}
              onChange={onFieldChange}
              onCreate={createHandler}
              onDelete={onDeleteClick}
              onDisplay={displayHandler}
            >
              <HStack className={elementStyles.wrapper}>
                <Editable.Sidebar title="Contact Us">
                  <Editable.Accordion onChange={displayHandler}>
                    <VStack
                      bg="base.canvas.alt"
                      p="1.5rem"
                      spacing="1.5rem"
                      alignItems="flex-start"
                    >
                      {/* General Information section */}
                      <GeneralInfoSection
                        frontMatter={frontMatter}
                        footerContent={footerContent}
                        errors={errors}
                      />

                      <Divider />

                      {/* Locations section */}
                      <CardsSection
                        contactUsType="locations"
                        cardFrontMatter={frontMatter.locations}
                        errors={errors.locations}
                      />

                      <Divider />

                      {/* Contact Information section */}
                      <CardsSection
                        contactUsType="contacts"
                        cardFrontMatter={frontMatter.contacts}
                        errors={errors.contacts}
                      />
                    </VStack>
                  </Editable.Accordion>
                </Editable.Sidebar>

                {/* Right column: Preview pane */}
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
              </HStack>
            </EditableContextProvider>

            {/* Save page footer */}
            <Footer>
              {!isEmpty(deletedFrontMatter) && (
                <LoadingButton
                  ml="auto"
                  variant="clear"
                  onClick={onRemovedContentWarningOpen}
                >
                  See removed content
                </LoadingButton>
              )}
              <LoadingButton isDisabled={hasErrors()} onClick={savePage}>
                Save
              </LoadingButton>
            </Footer>
          </>
        )}
      </VStack>
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
