/* eslint-disable @typescript-eslint/no-shadow */
import {
  Box,
  useDisclosure,
  Text,
  HStack,
  VStack,
  Divider,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { DragDropContext } from "@hello-pangea/dnd"
import { Button, Tag } from "@opengovsg/design-system-react"
import update from "immutability-helper"
import _ from "lodash"
import { useEffect, createRef, useState } from "react"

import { CustomiseSectionsHeader, Editable } from "components/Editable"
import { AddSectionButton } from "components/Editable/AddSectionButton"
import { Footer } from "components/Footer"
import Header from "components/Header"
import { LoadingButton } from "components/LoadingButton"
import { WarningModal } from "components/WarningModal"

import { FEATURE_FLAGS } from "constants/featureFlags"

// Import hooks
import { EditableContextProvider } from "contexts/EditableContext"

import { useGetHomepageHook } from "hooks/homepageHooks"
import { useUpdateHomepageHook } from "hooks/homepageHooks/useUpdateHomepageHook"
import { useAfterFirstLoad } from "hooks/useAfterFirstLoad"
import useSiteColorsHook from "hooks/useSiteColorsHook"

import { TextCardsSectionBody } from "layouts/components/Homepage/TextCardsBody"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { useErrorToast } from "utils/toasts"
import {
  validateSections,
  validateHighlights,
  validateDropdownElems,
  validateAnnouncementItems,
  validateTextcard,
} from "utils/validators"

import {
  HomepageStartEditingImage,
  HomepageAnnouncementsSampleImage,
  HomepageTextCardsSampleImage,
} from "assets"
import { EditorHomepageFrontmatterSection } from "types/homepage"
import { DEFAULT_RETRY_MSG } from "utils"

import { useDrag, onCreate, onDelete } from "../../hooks/useDrag"
import { AnnouncementBody } from "../components/Homepage/AnnouncementBody"
import { AnnouncementSection } from "../components/Homepage/AnnouncementSection"
import { HeroBody } from "../components/Homepage/HeroBody"
import { HeroDropdownSection } from "../components/Homepage/HeroDropdownSection"
import { HeroHighlightSection } from "../components/Homepage/HeroHighlightSection"
import { InfobarBody } from "../components/Homepage/InfobarBody"
import { InfopicBody } from "../components/Homepage/InfopicBody"
import { ResourcesBody } from "../components/Homepage/ResourcesBody"

import {
  DROPDOWN_ELEMENT_SECTION,
  DROPDOWN_SECTION,
  INFOBAR_SECTION,
  INFOPIC_SECTION,
  KEY_HIGHLIGHT_SECTION,
  RESOURCES_SECTION,
  ANNOUNCEMENT_BLOCK,
  getDefaultAnnouncementSection,
  TEXTCARDS_BLOCK_SECTION,
  TEXTCARDS_ITEM_SECTION,
} from "./constants"
import { HomepagePreview } from "./HomepagePreview"
import { getErrorValues } from "./utils"

/* eslint-disable react/no-array-index-key */

const RADIX_PARSE_INT = 10

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

const getHasError = (errorArray) =>
  _.some(errorArray, (err) =>
    _.some(err, (errorMessage) => errorMessage.length > 0)
  )

const getHasErrors = (errors) => {
  const hasSectionErrors = _.some(errors.sections, (section) => {
    // Section is an object, e.g. { hero: {} }
    // _.keys(section) produces an array with length 1
    // The 0th element of the array contains the sectionType
    const sectionType = _.keys(section)[0]
    return (
      _.some(
        section[sectionType],
        (errorMessage) => errorMessage.length > 0
      ) === true
    )
  })

  const hasHighlightErrors = getHasError(errors.highlights)
  const hasDropdownElemErrors = getHasError(errors.dropdownElems)
  const hasAnnouncementErrors = getHasError(errors.announcementItems)
  const hasTextcardCardErrors = _.some(errors.textcards, (section) =>
    getHasError(section)
  )

  return (
    hasSectionErrors ||
    hasHighlightErrors ||
    hasDropdownElemErrors ||
    hasAnnouncementErrors ||
    hasTextcardCardErrors
  )
}

// Constants
// Section constructors
// TODO: Export all these as const and write wrapper for error...

const enumSection = (type, isError) => {
  switch (type) {
    case "resources":
      return isError
        ? { resources: getErrorValues(RESOURCES_SECTION) }
        : { resources: RESOURCES_SECTION }

    case "infobar":
      return isError
        ? { infobar: getErrorValues(INFOBAR_SECTION) }
        : { infobar: INFOBAR_SECTION }

    case "infopic":
      return isError
        ? { infopic: getErrorValues(INFOPIC_SECTION) }
        : { infopic: INFOPIC_SECTION }

    case "announcements":
      return isError
        ? { announcements: getErrorValues(ANNOUNCEMENT_BLOCK) }
        : { announcements: ANNOUNCEMENT_BLOCK }

    case "textcards":
      return isError
        ? { textcards: getErrorValues(TEXTCARDS_BLOCK_SECTION) }
        : { textcards: TEXTCARDS_BLOCK_SECTION }
    default:
      return isError
        ? { infobar: getErrorValues(INFOBAR_SECTION) }
        : { infobar: INFOBAR_SECTION }
  }
}

const EditHomepage = ({ match }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()

  const { siteName } = match.params
  const [hasLoaded, setHasLoaded] = useState(false)
  const [scrollRefs, setScrollRefs] = useState([])
  const [frontMatter, setFrontMatter] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    notification: "",
    sections: [],
  })
  const [originalFrontMatter, setOriginalFrontMatter] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    notification: "",
    sections: [],
  })
  const [sha, setSha] = useState(null)
  const [displaySections, setDisplaySections] = useState([])
  const [displayAnnouncementItems, setDisplayAnnouncementItems] = useState([])
  const [displayHighlights, setDisplayHighlights] = useState([])
  const [displayDropdownElems, setDisplayDropdownElems] = useState([])
  const [errors, setErrors] = useState({
    sections: [],
    highlights: [],
    dropdownElems: [],
    announcementItems: [],
    textcards: [],
  })
  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: "",
    type: "",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [savedHeroElems, setSavedHeroElems] = useState("")
  const [savedHeroErrors, setSavedHeroErrors] = useState("")
  const { data: homepageData } = useGetHomepageHook(siteName)
  const { mutateAsync: updateHomepageHandler } = useUpdateHomepageHook(siteName)
  const homepageState = {
    frontMatter,
    errors,
    displayDropdownElems,
    displayHighlights,
    displaySections,
    displayAnnouncementItems,
  }
  const onDrag = useDrag(homepageState)
  const setHomepageState = ({
    frontMatter,
    errors,
    displayDropdownElems,
    displayHighlights,
    displaySections,
    displayAnnouncementItems,
  }) => {
    setDisplaySections(displaySections)
    setFrontMatter(frontMatter)
    setErrors(errors)
    setDisplayDropdownElems(displayDropdownElems)
    setDisplayHighlights(displayHighlights)
    setDisplayAnnouncementItems(displayAnnouncementItems)
  }
  const heroSection = frontMatter.sections.filter((section) => !!section.hero)

  const errorToast = useErrorToast()

  // TODO: Tidy up these `useEffects` and figure out what they do
  // TODO: Shift this into react query + custom hook
  useEffect(() => {
    if (!homepageData) return
    const loadPageDetails = async () => {
      // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      try {
        let {
          content: { frontMatter },
        } = homepageData
        const { sha } = homepageData
        // Set displaySections
        const displaySections = []
        let displayHighlights = []
        let displayDropdownElems = []
        const sectionsErrors = []
        let dropdownElemsErrors = []
        let highlightsErrors = []
        let announcementItemErrors = []
        const textcardCardErrors = []
        const scrollRefs = []
        frontMatter.sections.forEach((section) => {
          scrollRefs.push(createRef())
          // If this is the hero section, hide all highlights/dropdownelems by default
          if (section.hero) {
            const { dropdown, key_highlights: keyHighlights } = section.hero
            const hero = {
              title: "",
              subtitle: "",
              background: "",
              button: "",
              url: "",
            }
            if (dropdown) {
              hero.dropdown = ""
              // Go through section.hero.dropdown.options
              displayDropdownElems = _.fill(
                Array(dropdown.options.length),
                false
              )
              // Fill in dropdown elem errors array
              dropdownElemsErrors = _.map(dropdown.options, () =>
                getErrorValues(DROPDOWN_ELEMENT_SECTION)
              )
            }
            if (keyHighlights) {
              displayHighlights = _.fill(Array(keyHighlights.length), false)
              // Fill in highlights errors array
              highlightsErrors = _.map(keyHighlights, () =>
                getErrorValues(KEY_HIGHLIGHT_SECTION)
              )
            }
            // Fill in sectionErrors for hero
            sectionsErrors.push({ hero })
          }

          // Check if there is already a resources section
          if (section.resources) {
            sectionsErrors.push({
              resources: getErrorValues(RESOURCES_SECTION),
            })
          }

          if (section.infobar) {
            sectionsErrors.push({ infobar: getErrorValues(INFOBAR_SECTION) })
          }

          if (section.infopic) {
            sectionsErrors.push({ infopic: getErrorValues(INFOPIC_SECTION) })
          }

          if (section.announcements) {
            sectionsErrors.push({
              announcements: getErrorValues(ANNOUNCEMENT_BLOCK),
            })
            announcementItemErrors = _.map(
              section.announcements.announcement_items,
              () => getErrorValues(getDefaultAnnouncementSection())
            )
            if (!section.announcements.announcement_items) {
              // define an empty array to announcement_items to prevent error
              frontMatter = update(frontMatter, {
                sections: {
                  [frontMatter.sections.findIndex((section) =>
                    EditorHomepageFrontmatterSection.isAnnouncements(section)
                  )]: {
                    announcements: {
                      announcement_items: {
                        $set: [],
                      },
                    },
                  },
                },
              })
            }
          }
          if (section.textcards) {
            sectionsErrors.push({
              textcards: getErrorValues(TEXTCARDS_BLOCK_SECTION),
            })
            const { cards } = section.textcards
            // Fill in dropdown elem errors array
            textcardCardErrors.push(
              _.map(cards, () => getErrorValues(TEXTCARDS_ITEM_SECTION))
            )
          } else {
            textcardCardErrors.push([])
          }

          // Minimize all sections by default
          displaySections.push(false)
        })

        // Initialize errors object
        const errors = {
          sections: sectionsErrors,
          highlights: highlightsErrors,
          dropdownElems: dropdownElemsErrors,
          announcementItems: announcementItemErrors,
          textcards: textcardCardErrors,
        }

        setFrontMatter(frontMatter)
        setOriginalFrontMatter(_.cloneDeep(frontMatter))
        setSha(sha)
        setDisplaySections(displaySections)
        setDisplayDropdownElems(displayDropdownElems)
        setDisplayHighlights(displayHighlights)
        setErrors(errors)
        setHasLoaded(true)
        setScrollRefs(scrollRefs)
      } catch (err) {
        // Set frontMatter to be same to prevent warning message when navigating away
        setFrontMatter(originalFrontMatter)
        errorToast({
          id: "get-homepage-error",
          description: `There was a problem trying to load your homepage. ${DEFAULT_RETRY_MSG}`,
        })
        console.log(err)
      }
    }

    loadPageDetails()
  }, [homepageData])

  const delayedScrollTo = useAfterFirstLoad(scrollTo)

  useEffect(() => {
    if (scrollRefs.length === 0) return // Page data has not been populated
    delayedScrollTo(scrollRefs[frontMatter.sections.length - 1])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRefs, frontMatter.sections.length])

  const onFieldChange = async (event) => {
    try {
      const { id, value } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]

      switch (elemType) {
        case "site": {
          // The field that changed belongs to a site-wide config
          const field = idArray[1] // e.g. "title" or "subtitle"

          setFrontMatter({
            ...frontMatter,
            [field]: value,
          })
          break
        }
        case "section": {
          // The field that changed belongs to a homepage section config
          const { sections } = frontMatter

          // sectionIndex is the index of the section array in the frontMatter
          const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const sectionType = idArray[2] // e.g. "hero" or "infobar" or "resources" or "announcements"
          const field = idArray[3] // e.g. "title" or "subtitle"

          const newSections = update(sections, {
            [sectionIndex]: {
              [sectionType]: {
                [field]: {
                  $set: value,
                },
              },
            },
          })

          let newSectionError

          // Set special error message if hero button has text but hero url is empty
          // This needs to be done separately because it relies on the state of another field
          if (
            field === "url" &&
            !value &&
            frontMatter.sections[sectionIndex][sectionType].button &&
            (frontMatter.sections[sectionIndex][sectionType].button || value)
          ) {
            const errorMessage = "Please specify a URL for your button"
            newSectionError = _.cloneDeep(errors.sections[sectionIndex])
            newSectionError[sectionType][field] = errorMessage
          } else if (
            field === "button" &&
            !frontMatter.sections[sectionIndex][sectionType].url &&
            (value || frontMatter.sections[sectionIndex][sectionType].url) &&
            sectionType !== "resources"
          ) {
            const errorMessage = "Please specify a URL for your button"
            newSectionError = _.cloneDeep(errors.sections[sectionIndex])
            newSectionError[sectionType].url = errorMessage
          } else {
            newSectionError = validateSections(
              _.cloneDeep(errors.sections[sectionIndex]),
              sectionType,
              field,
              value
            )

            if (field === "button" && !value) {
              newSectionError[sectionType].button = ""
              newSectionError[sectionType].url = ""
            }
          }

          const newErrors = update(errors, {
            sections: {
              [sectionIndex]: {
                $set: newSectionError,
              },
            },
          })

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)

          scrollTo(scrollRefs[sectionIndex])
          break
        }
        case "highlight": {
          // The field that changed belongs to a hero highlight
          const { sections } = frontMatter

          // highlightsIndex is the index of the key_highlights array
          const highlightsIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2] // e.g. "title" or "url"

          const newSections = update(sections, {
            0: {
              hero: {
                key_highlights: {
                  [highlightsIndex]: {
                    [field]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          })

          const newErrors = update(errors, {
            highlights: {
              [highlightsIndex]: {
                $set: validateHighlights(
                  errors.highlights[highlightsIndex],
                  field,
                  value
                ),
              },
            },
          })

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)

          scrollTo(scrollRefs[0])
          break
        }
        case "announcement": {
          // The field that changed belongs to an announcement item
          const { sections } = frontMatter

          const announcementsIndex = frontMatter.sections.findIndex((section) =>
            EditorHomepageFrontmatterSection.isAnnouncements(section)
          )
          // announcementIndex is the index of the announcement items array
          const announcementItemsIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2] // e.g. "title" or "url"

          const newSections = update(sections, {
            [announcementsIndex]: {
              announcements: {
                announcement_items: {
                  [announcementItemsIndex]: {
                    [field]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          })

          const newErrors = update(errors, {
            announcementItems: {
              [announcementItemsIndex]: {
                $set: validateAnnouncementItems(
                  errors.announcementItems[announcementItemsIndex],
                  field,
                  value
                ),
              },
            },
          })

          // Additional validation that depends on other fields
          const isLinkTextFilled = !!newSections[announcementsIndex]
            .announcements.announcement_items[announcementItemsIndex].link_text
          const isLinkUrlFilled = !!newSections[announcementsIndex]
            .announcements.announcement_items[announcementItemsIndex].link_url

          const isLinkUrlError = isLinkTextFilled && !isLinkUrlFilled
          const isLinkUrlOrTextChanged =
            field === "link_text" || field === "link_url"
          if (isLinkUrlOrTextChanged) {
            newErrors.announcementItems[
              announcementItemsIndex
            ].link_url = isLinkUrlError
              ? "Please specify a URL for your link"
              : ""
          }

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)
          scrollTo(scrollRefs[announcementsIndex])
          break
        }
        case "dropdownelem": {
          // The field that changed is a dropdown element (i.e. dropdownelem)
          const { sections } = frontMatter

          // dropdownsIndex is the index of the dropdown.options array
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const field = idArray[2] // e.g. "title" or "url"

          const newSections = update(sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    [dropdownsIndex]: {
                      [field]: {
                        $set: value,
                      },
                    },
                  },
                },
              },
            },
          })

          const newErrors = update(errors, {
            dropdownElems: {
              [dropdownsIndex]: {
                $set: validateDropdownElems(
                  errors.dropdownElems[dropdownsIndex],
                  field,
                  value
                ),
              },
            },
          })

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)

          scrollTo(scrollRefs[0])
          break
        }
        case "textcardcard": {
          // The field that changed is a text card element
          const { sections } = frontMatter

          // cardIndex is the index of the cards array
          const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          const cardIndex = parseInt(idArray[2], RADIX_PARSE_INT)
          const field = idArray[3] // e.g. "title" or "url"

          const newSections = update(sections, {
            [sectionIndex]: {
              textcards: {
                cards: {
                  [cardIndex]: {
                    [field]: {
                      $set: value,
                    },
                  },
                },
              },
            },
          })

          const newErrors = update(errors, {
            textcards: {
              [sectionIndex]: {
                [cardIndex]: {
                  $set: validateTextcard(
                    errors.textcards[sectionIndex][cardIndex],
                    field,
                    value
                  ),
                },
              },
            },
          })

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)

          scrollTo(scrollRefs[sectionIndex])
          break
        }
        default: {
          // The field that changed is the dropdown placeholder title

          const newErrors = update(errors, {
            sections: {
              0: {
                $set: validateSections(
                  errors.sections[0],
                  "hero",
                  "dropdown",
                  value
                ),
              },
            },
          })

          const newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  title: {
                    $set: value,
                  },
                },
              },
            },
          })

          setFrontMatter({
            ...frontMatter,
            sections: newSections,
          })
          setErrors(newErrors)

          scrollTo(scrollRefs[0])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const createHandler = async (event) => {
    try {
      const { id, value } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]

      switch (elemType) {
        case "section": {
          const val = enumSection(value, false)
          const err = enumSection(value, true)

          const newScrollRefs = update(scrollRefs, { $push: [createRef()] })
          const updatedHomepageState = onCreate(
            homepageState,
            elemType,
            val,
            err
          )

          setHomepageState(updatedHomepageState)
          setScrollRefs(newScrollRefs)

          // Edge case for announcements where we need to
          // create a default announcement item
          if (val.announcements) {
            const updatedAnnouncementState = onCreate(
              updatedHomepageState,
              "announcement",
              getDefaultAnnouncementSection(),
              getErrorValues(getDefaultAnnouncementSection())
            )
            setHomepageState(updatedAnnouncementState)
          }
          break
        }
        case "dropdownelem": {
          const val = DROPDOWN_ELEMENT_SECTION
          const err = getErrorValues(DROPDOWN_ELEMENT_SECTION)

          const updatedHomepageState = onCreate(
            homepageState,
            elemType,
            val,
            err
          )

          setHomepageState(updatedHomepageState)
          break
        }
        case "highlight": {
          // depends on index to generate
          // If key highlights section exists
          const val = KEY_HIGHLIGHT_SECTION
          const err = getErrorValues(KEY_HIGHLIGHT_SECTION)
          const updatedHomepageState = onCreate(
            homepageState,
            elemType,
            val,
            err
          )

          setHomepageState(updatedHomepageState)
          setDisplayHighlights(displayHighlights)
          break
        }
        case "announcement": {
          const val = getDefaultAnnouncementSection()
          const err = getErrorValues(getDefaultAnnouncementSection())
          const updatedHomepageState = onCreate(
            homepageState,
            elemType,
            val,
            err
          )
          setHomepageState(updatedHomepageState)
          break
        }
        case "textcardcard": {
          const parentId = parseInt(idArray[1], RADIX_PARSE_INT)
          const val = TEXTCARDS_ITEM_SECTION
          const err = getErrorValues(TEXTCARDS_ITEM_SECTION)
          const updatedHomepageState = onCreate(
            homepageState,
            elemType,
            val,
            err,
            parentId
          )

          setHomepageState(updatedHomepageState)
          break
        }
        default:
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split("-")
      const elemType = idArray[0]
      const index = parseInt(idArray[1], RADIX_PARSE_INT)

      if (elemType === "section") {
        const newScrollRefs = update(scrollRefs, {
          $splice: [[index, 1]],
        })

        setScrollRefs(newScrollRefs)
      }
      if (elemType === "textcardcard") {
        const childIndex = parseInt(idArray[2], RADIX_PARSE_INT)

        const newHomepageState = onDelete(
          homepageState,
          elemType,
          index,
          childIndex
        )
        setHomepageState(newHomepageState)
        return
      }
      const newHomepageState = onDelete(homepageState, elemType, index)
      setHomepageState(newHomepageState)
    } catch (err) {
      console.log(err)
    }
  }

  const onDeleteClick = (id, name) => {
    onOpen()
    setItemPendingForDelete({ id, type: name })
  }

  const onDragEnd = (result) => {
    const homepageState = onDrag(result)
    setHomepageState(homepageState)
  }

  const handleHighlightDropdownToggle = (event) => {
    let newSections = []
    let newErrors = {}
    const {
      target: { value },
    } = event
    if (value === "highlights") {
      if (!frontMatter.sections[0].hero.dropdown) return
      let highlightObj
      let highlightErrors
      let buttonObj
      let buttonErrors
      let urlObj
      let urlErrors
      if (savedHeroElems) {
        highlightObj = savedHeroElems.key_highlights || []
        highlightErrors = savedHeroErrors.highlights || []
        buttonObj = savedHeroElems.button || ""
        buttonErrors = savedHeroErrors.button || ""
        urlObj = savedHeroElems.url || ""
        urlErrors = savedHeroErrors.url || ""
      } else {
        highlightObj = []
        highlightErrors = []
        buttonObj = ""
        buttonErrors = ""
        urlObj = ""
        urlErrors = ""
      }
      setSavedHeroElems(frontMatter.sections[0].hero)
      setSavedHeroErrors({
        dropdown: errors.sections[0].hero.dropdown,
        dropdownElems: errors.dropdownElems,
      })

      newSections = update(frontMatter.sections, {
        0: {
          hero: {
            dropdown: {
              $set: "",
            },
            key_highlights: {
              $set: highlightObj,
            },
            button: {
              $set: buttonObj,
            },
            url: {
              $set: urlObj,
            },
          },
        },
      })

      newErrors = update(errors, {
        dropdownElems: {
          $set: [],
        },
        highlights: {
          $set: highlightErrors,
        },
        sections: {
          0: {
            hero: {
              dropdown: {
                $set: "",
              },
              button: {
                $set: buttonErrors,
              },
              url: {
                $set: urlErrors,
              },
            },
          },
        },
      })
    } else {
      if (frontMatter.sections[0].hero.dropdown) return
      let dropdownObj
      let dropdownErrors
      let dropdownElemErrors
      if (savedHeroElems) {
        dropdownObj = savedHeroElems.dropdown || DROPDOWN_SECTION
        dropdownErrors = savedHeroErrors.dropdown || ""
        dropdownElemErrors = savedHeroErrors.dropdownElems || ""
      } else {
        dropdownObj = DROPDOWN_SECTION
        dropdownErrors = ""
        dropdownElemErrors = []
      }

      setSavedHeroElems(frontMatter.sections[0].hero)
      setSavedHeroErrors({
        highlights: errors.highlights,
        button: errors.sections[0].hero.button,
        url: errors.sections[0].hero.url,
      })

      newSections = update(frontMatter.sections, {
        0: {
          hero: {
            button: {
              $set: "",
            },
            url: {
              $set: "",
            },
            key_highlights: {
              $set: "",
            },
            dropdown: {
              $set: dropdownObj,
            },
          },
        },
      })

      newErrors = update(errors, {
        sections: {
          0: {
            hero: {
              button: {
                $set: "",
              },
              url: {
                $set: "",
              },
              dropdown: {
                $set: dropdownErrors,
              },
            },
          },
        },
        highlights: {
          $set: "",
        },
        dropdownElems: {
          $set: dropdownElemErrors,
        },
      })
    }
    setFrontMatter({
      ...frontMatter,
      sections: newSections,
    })
    setErrors(newErrors)
  }

  const displayHandler = async (elemType, index) => {
    // NOTE: If index is less than 0,
    // this means that the accordion is being closed.
    // Hence, we don't trigger a scroll.
    if (index < 0) return
    try {
      switch (elemType) {
        case "section": {
          const resetDisplaySections = _.fill(
            Array(displaySections.length),
            false
          )
          resetDisplaySections[index] = !displaySections[index]
          const newDisplaySections = update(displaySections, {
            $set: resetDisplaySections,
          })

          setDisplaySections(newDisplaySections)
          scrollTo(scrollRefs[index])
          break
        }
        case "announcement": {
          const announcementsIndex = frontMatter.sections.findIndex((section) =>
            EditorHomepageFrontmatterSection.isAnnouncements(section)
          )
          const resetAnnouncementSections = _.fill(
            Array(displayAnnouncementItems.length),
            false
          )
          resetAnnouncementSections[index] = !displayAnnouncementItems[index]
          const newDisplayAnnouncements = update(displayAnnouncementItems, {
            $set: resetAnnouncementSections,
          })

          scrollTo(scrollRefs[announcementsIndex])
          setDisplayAnnouncementItems(newDisplayAnnouncements)
          break
        }
        case "highlight": {
          const resetHighlightSections = _.fill(
            Array(displayHighlights.length),
            false
          )
          resetHighlightSections[index] = !displayHighlights[index]
          const newDisplayHighlights = update(displayHighlights, {
            $set: resetHighlightSections,
          })

          scrollTo(scrollRefs[0])
          setDisplayHighlights(newDisplayHighlights)
          break
        }
        case "dropdownelem": {
          const resetDropdownSections = _.fill(
            Array(displayDropdownElems.length),
            false
          )
          resetDropdownSections[index] = !displayDropdownElems[index]
          const newDisplayDropdownElems = update(displayDropdownElems, {
            $set: resetDropdownSections,
          })

          scrollTo(scrollRefs[0])
          setDisplayDropdownElems(newDisplayDropdownElems)
          break
        }
        default:
      }
    } catch (err) {
      console.log(err)
    }
  }

  // TODO: Shift to react-query
  const savePage = async () => {
    try {
      const filteredFrontMatter = _.cloneDeep(frontMatter)
      // Filter out components which have no input
      filteredFrontMatter.sections = frontMatter.sections.map((section) => {
        const newSection = {}
        // Enumerate over own object properties and clones those that are not empty.
        // This is done in order to prevent expensive writes on disk for empty sections.
        _.forOwn(section, (sectionValue, sectionName) => {
          newSection[sectionName] = _.cloneDeep(
            _.omitBy(sectionValue, _.isEmpty)
          )
        })
        return newSection
      })

      const params = {
        content: {
          frontMatter: filteredFrontMatter,
          pageBody: "",
        },
        sha,
      }

      await updateHomepageHandler(params)
    } catch (err) {
      errorToast({
        id: "update-homepage-error",
        description: `There was a problem trying to save your homepage. ${DEFAULT_RETRY_MSG}`,
      })
      console.log(err)
    }
  }

  // NOTE: sectionType is one of `announcements, `resources`, `infopic` or `infobar`
  const onClick = (sectionType) => {
    createHandler({
      target: {
        value: sectionType,
        id: "section-new",
      },
    })
  }

  const showNewLayouts = useFeatureIsOn(FEATURE_FLAGS.HOMEPAGE_TEMPLATES)
  return (
    <>
      <WarningModal
        isOpen={itemPendingForDelete.id && isOpen}
        onClose={() => {
          setItemPendingForDelete({ id: null, type: "" })
          onClose()
        }}
        displayTitle={`Delete ${itemPendingForDelete.type}`}
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
            onClose()
          }}
        >
          Cancel
        </Button>
        <Button
          colorScheme="critical"
          onClick={() => {
            deleteHandler(itemPendingForDelete.id)
            setItemPendingForDelete({ id: null, type: "" })
            onClose()
          }}
        >
          Yes, delete
        </Button>
      </WarningModal>
      <VStack>
        <Header
          title="Homepage"
          shouldAllowEditPageBackNav={
            JSON.stringify(originalFrontMatter) === JSON.stringify(frontMatter)
          }
          isEditPage
          backButtonText="Back to My Workspace"
          backButtonUrl={`/sites/${siteName}/workspace`}
        />
        {hasLoaded && (
          <EditableContextProvider
            onDragEnd={onDragEnd}
            onChange={onFieldChange}
            onCreate={createHandler}
            onDelete={onDeleteClick}
            onDisplay={displayHandler}
          >
            <HStack className={elementStyles.wrapper}>
              <Editable.Sidebar title="Homepage">
                <Editable.Accordion
                  onChange={(idx) => displayHandler("section", idx)}
                >
                  <VStack
                    bg="base.canvas.alt"
                    p="1.5rem"
                    spacing="1.5rem"
                    alignItems="flex-start"
                  >
                    {heroSection.map((section, sectionIndex) => {
                      return (
                        <>
                          <Editable.EditableAccordionItem
                            title="Hero section"
                            // TODO: Add `isInvalid` prop to `EditableAccordionItem`
                            isInvalid={
                              getHasError(errors.dropdownElems) ||
                              getHasError(errors.highlights) ||
                              _.some(_.values(errors.sections[0]?.hero))
                            }
                          >
                            <HeroBody
                              {...section.hero}
                              notification={frontMatter.notification}
                              index={sectionIndex}
                              errors={{
                                ...errors.sections[0].hero,
                                highlights: errors.highlights,
                                dropdownElems: errors.dropdownElems,
                              }}
                              handleHighlightDropdownToggle={
                                handleHighlightDropdownToggle
                              }
                              initialSectionType={
                                section.hero.dropdown
                                  ? "dropdown"
                                  : "highlights"
                              }
                            >
                              {({ currentSelectedOption }) =>
                                currentSelectedOption === "dropdown" ? (
                                  <HeroDropdownSection
                                    {...section.hero}
                                    {...section.hero.dropdown}
                                    errors={{
                                      ...errors,
                                      ...errors.sections[0].hero,
                                    }}
                                  />
                                ) : (
                                  <HeroHighlightSection
                                    errors={{
                                      ...errors,
                                      ...errors.sections[0].hero,
                                    }}
                                    highlights={section.hero.key_highlights}
                                    {...section.hero}
                                  />
                                )
                              }
                            </HeroBody>
                          </Editable.EditableAccordionItem>
                          <Divider />
                          <VStack spacing="0.5rem" alignItems="flex-start">
                            <CustomiseSectionsHeader />
                          </VStack>
                        </>
                      )
                    })}
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Editable.Droppable
                        width="100%"
                        editableId="leftPane"
                        onDragEnd={onDragEnd}
                      >
                        <Editable.EmptySection
                          title="Sections you add will appear here"
                          subtitle="Add informative content to your website from images to text by
                    clicking “Add section” below"
                          image={<HomepageStartEditingImage />}
                          // NOTE: It's empty if there is only 1 section and it's a hero section
                          // as the hero section displays above the custom sections
                          // and has a fixed display
                          isEmpty={
                            frontMatter.sections.length === 1 &&
                            heroSection.length === 1
                          }
                        >
                          <VStack p={0} spacing="1.5rem">
                            {frontMatter.sections.map(
                              (section, sectionIndex) => (
                                <>
                                  {section.resources && (
                                    <Editable.DraggableAccordionItem
                                      index={sectionIndex}
                                      tag={
                                        <Tag variant="subtle">Resources</Tag>
                                      }
                                      title="New resource widget"
                                      isInvalid={_.some(
                                        errors.sections[sectionIndex].resources
                                      )}
                                    >
                                      <ResourcesBody
                                        {...section.resources}
                                        index={sectionIndex}
                                        errors={
                                          errors.sections[sectionIndex]
                                            .resources
                                        }
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}

                                  {section.infobar && (
                                    <Editable.DraggableAccordionItem
                                      index={sectionIndex}
                                      tag={<Tag variant="subtle">Infobar</Tag>}
                                      title={
                                        section.infobar.title || "New infobar"
                                      }
                                      isInvalid={_.some(
                                        errors.sections[sectionIndex].infobar
                                      )}
                                    >
                                      <InfobarBody
                                        {...section.infobar}
                                        index={sectionIndex}
                                        errors={
                                          errors.sections[sectionIndex].infobar
                                        }
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}

                                  {section.infopic && (
                                    <Editable.DraggableAccordionItem
                                      index={sectionIndex}
                                      tag={<Tag variant="subtle">Infopic</Tag>}
                                      title={
                                        section.infopic.title || "New infopic"
                                      }
                                      isInvalid={_.some(
                                        errors.sections[sectionIndex].infopic
                                      )}
                                    >
                                      <InfopicBody
                                        index={sectionIndex}
                                        errors={
                                          errors.sections[sectionIndex].infopic
                                        }
                                        {...section.infopic}
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}

                                  {showNewLayouts &&
                                    section.announcements &&
                                    /**
                                     * Somehow, the errors are undefined for 2 renders, not sure
                                     * of the core reason. To avoid the CMS panel from crashing,
                                     * wrapping this around a check for defined errors
                                     */
                                    errors.sections[sectionIndex]
                                      .announcements && (
                                      <Editable.DraggableAccordionItem
                                        index={sectionIndex}
                                        tag={
                                          <Tag variant="subtle">
                                            Announcement
                                          </Tag>
                                        }
                                        title={
                                          section.announcements.title ||
                                          "New Announcement"
                                        }
                                        isInvalid={
                                          _.some(
                                            errors.sections[sectionIndex]
                                              .announcements
                                          ) ||
                                          getHasError(errors.announcementItems)
                                        }
                                      >
                                        <AnnouncementSection
                                          {...section.announcements}
                                          index={sectionIndex}
                                          errors={
                                            errors.sections[sectionIndex]
                                              .announcements
                                          }
                                        >
                                          <AnnouncementBody
                                            {...section.announcements}
                                            announcementItems={
                                              section.announcements
                                                .announcement_items
                                            }
                                            errors={{
                                              ...errors,
                                            }}
                                          />
                                        </AnnouncementSection>
                                      </Editable.DraggableAccordionItem>
                                    )}
                                  {section.textcards && (
                                    <Editable.DraggableAccordionItem
                                      index={sectionIndex}
                                      tag={
                                        <Tag variant="subtle">Text cards</Tag>
                                      }
                                      title={
                                        section.textcards.title ||
                                        "New cards block"
                                      }
                                      isInvalid={
                                        _.some(
                                          errors.sections[sectionIndex]
                                            .textcards
                                        ) ||
                                        (errors.textcards[sectionIndex] &&
                                          _.some(
                                            errors.textcards[
                                              sectionIndex
                                            ].map((card) => _.some(card))
                                          ))
                                      }
                                    >
                                      <TextCardsSectionBody
                                        index={sectionIndex}
                                        errors={
                                          errors.sections[sectionIndex]
                                            .textcards
                                        }
                                        cardErrors={
                                          errors.textcards[sectionIndex]
                                        }
                                        {...section.textcards}
                                      />
                                    </Editable.DraggableAccordionItem>
                                  )}
                                </>
                              )
                            )}
                          </VStack>
                        </Editable.EmptySection>
                      </Editable.Droppable>
                    </DragDropContext>
                  </VStack>
                </Editable.Accordion>
                {/* NOTE: Set the padding here -
                        We cannot let the button be part of the `Draggable`
                        as otherwise, when dragging,
                        the component will appear over the button
                    */}
                <Box px="1.5rem">
                  <AddSectionButton>
                    <AddSectionButton.List>
                      <AddSectionButton.Option
                        onClick={() => onClick(INFOPIC_SECTION.id)}
                        title={INFOPIC_SECTION.title}
                        subtitle={INFOPIC_SECTION.subtitle}
                      />
                      <AddSectionButton.Option
                        title={INFOBAR_SECTION.title}
                        subtitle={INFOBAR_SECTION.subtitle}
                        onClick={() => onClick(INFOBAR_SECTION.id)}
                      />
                      {/* NOTE: Check if the sections contain any `resources`
                                and if it does, prevent creation of another `resources` section
                            */}
                      {!frontMatter.sections.some(
                        ({ resources }) => !!resources
                      ) && (
                        <AddSectionButton.Option
                          title={RESOURCES_SECTION.title}
                          subtitle={RESOURCES_SECTION.subtitle}
                          onClick={() => onClick(RESOURCES_SECTION.id)}
                        />
                      )}
                      {/* NOTE: Check if the sections contain any `announcements`
                                and if it does, prevent creation of another `resources` section
                            */}
                      {showNewLayouts &&
                        !frontMatter.sections.some(
                          ({ announcements }) => !!announcements
                        ) && (
                          <AddSectionButton.HelpOverlay
                            title="Announcements"
                            description="Make exciting news from your organisation stand out by adding a list of announcements with dates on your homepage."
                            image={<HomepageAnnouncementsSampleImage />}
                          >
                            <AddSectionButton.Option
                              title={ANNOUNCEMENT_BLOCK.title}
                              subtitle={ANNOUNCEMENT_BLOCK.subtitle}
                              onClick={() => onClick(ANNOUNCEMENT_BLOCK.id)}
                            />
                          </AddSectionButton.HelpOverlay>
                        )}
                      {showNewLayouts && (
                        <AddSectionButton.HelpOverlay
                          title="Text cards"
                          description="Add clickable cards with bite-sized information to your homepage. You can link any page or external URL, such as blog posts, articles, and more."
                          image={<HomepageTextCardsSampleImage />}
                        >
                          <AddSectionButton.Option
                            title={TEXTCARDS_BLOCK_SECTION.title}
                            subtitle={TEXTCARDS_BLOCK_SECTION.subtitle}
                            onClick={() => onClick(TEXTCARDS_BLOCK_SECTION.id)}
                          />
                        </AddSectionButton.HelpOverlay>
                      )}
                    </AddSectionButton.List>
                  </AddSectionButton>
                </Box>
              </Editable.Sidebar>
              <HomepagePreview
                frontMatter={frontMatter}
                scrollRefs={scrollRefs}
              />
            </HStack>
            <Footer>
              <LoadingButton
                isDisabled={getHasErrors(errors)}
                onClick={savePage}
              >
                Save
              </LoadingButton>
            </Footer>
          </EditableContextProvider>
        )}
      </VStack>
    </>
  )
}

export default EditHomepage
