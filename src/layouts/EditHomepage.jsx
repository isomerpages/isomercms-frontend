/* eslint-disable no-shadow */
import { Input } from "@opengovsg/design-system-react"
import axios from "axios"
import DeleteWarningModal from "components/DeleteWarningModal"
import Header from "components/Header"
import EditorHeroSection from "components/homepage/HeroSection"
import EditorInfobarSection from "components/homepage/InfobarSection"
import EditorInfopicSection from "components/homepage/InfopicSection"
import NewSectionCreator from "components/homepage/NewSectionCreator"
import EditorResourcesSection from "components/homepage/ResourcesSection"
import LoadingButton from "components/LoadingButton"
import update from "immutability-helper"
import _ from "lodash"
import PropTypes from "prop-types"
import { useEffect, createRef, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

// Import hooks
import useSiteColorsHook from "hooks/useSiteColorsHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import TemplateHeroSection from "templates/homepage/HeroSection"
import TemplateInfobarSection from "templates/homepage/InfobarSection"
import TemplateInfopicLeftSection from "templates/homepage/InfopicLeftSection"
import TemplateInfopicRightSection from "templates/homepage/InfopicRightSection"
import TemplateResourcesSection from "templates/homepage/ResourcesSection"

import { errorToast } from "utils/toasts"
import {
  validateSections,
  validateHighlights,
  validateDropdownElems,
} from "utils/validators"

import {
  frontMatterParser,
  concatFrontMatterMdBody,
  DEFAULT_RETRY_MSG,
} from "utils"

import "styles/isomer-template.scss"

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

// Constants
// ==========
const RADIX_PARSE_INT = 10

// Section constructors
const ResourcesSectionConstructor = (isErrorConstructor) => ({
  resources: {
    title: isErrorConstructor ? "" : "Resources Section Title",
    subtitle: isErrorConstructor ? "" : "Resources Section Subtitle",
    button: isErrorConstructor ? "" : "Resources Button Name",
  },
})

const InfobarSectionConstructor = (isErrorConstructor) => ({
  infobar: {
    title: isErrorConstructor ? "" : "Infobar Title",
    subtitle: isErrorConstructor ? "" : "Infobar Subtitle",
    description: isErrorConstructor ? "" : "Infobar description",
    button: isErrorConstructor ? "" : "Button Text",
    url: "", // No default value so that no broken link is created
  },
})

const InfopicSectionConstructor = (isErrorConstructor) => ({
  infopic: {
    title: isErrorConstructor ? "" : "Infopic Title",
    subtitle: isErrorConstructor ? "" : "Infopic Subtitle",
    description: isErrorConstructor ? "" : "Infopic description",
    button: isErrorConstructor ? "" : "Button Text",
    url: "", // No default value so that no broken link is created
    image: "", // Always blank since the image modal handles this
    alt: isErrorConstructor ? "" : "Image alt text",
  },
})

const KeyHighlightConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? "" : "Key Highlight Title",
  description: isErrorConstructor ? "" : "Key Highlight description",
  url: "", // No default value so that no broken link is created
})

const DropdownElemConstructor = (isErrorConstructor) => ({
  title: isErrorConstructor ? "" : "Hero Dropdown Element Title",
  url: "", // No default value so that no broken link is created
})

const DropdownConstructor = () => ({
  title: "Hero Dropdown Title",
  options: [],
})

const enumSection = (type, isErrorConstructor) => {
  switch (type) {
    case "resources":
      return ResourcesSectionConstructor(isErrorConstructor)
    case "infobar":
      return InfobarSectionConstructor(isErrorConstructor)
    case "infopic":
      return InfopicSectionConstructor(isErrorConstructor)
    default:
      return InfobarSectionConstructor(isErrorConstructor)
  }
}

const EditHomepage = ({ match }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()

  const { siteName } = match.params
  const [hasLoaded, setHasLoaded] = useState(false)
  const [scrollRefs, setScrollRefs] = useState([])
  const [hasErrors, setHasErrors] = useState(false)
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
  const [hasResources, setHasResources] = useState(false)
  const [dropdownIsActive, setDropdownIsActive] = useState(false)
  const [displaySections, setDisplaySections] = useState([])
  const [displayHighlights, setDisplayHighlights] = useState([])
  const [displayDropdownElems, setDisplayDropdownElems] = useState([])
  const [errors, setErrors] = useState({
    sections: [],
    highlights: [],
    dropdownElems: [],
  })
  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: "",
    type: "",
  })
  const [savedHeroElems, setSavedHeroElems] = useState("")
  const [savedHeroErrors, setSavedHeroErrors] = useState("")

  useEffect(() => {
    let _isMounted = true
    const loadPageDetails = async () => {
      // // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`,
          {
            withCredentials: true,
          }
        )
        const { content, sha } = resp.data
        const { frontMatter } = frontMatterParser(content)
        // Compute hasResources and set displaySections
        let hasResources = false
        const displaySections = []
        let displayHighlights = []
        let displayDropdownElems = []
        const sectionsErrors = []
        let dropdownElemsErrors = []
        let highlightsErrors = []
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
                DropdownElemConstructor(true)
              )
            }
            if (keyHighlights) {
              displayHighlights = _.fill(Array(keyHighlights.length), false)
              // Fill in highlights errors array
              highlightsErrors = _.map(keyHighlights, () =>
                KeyHighlightConstructor(true)
              )
            }
            // Fill in sectionErrors for hero
            sectionsErrors.push({ hero })
          }

          // Check if there is already a resources section
          if (section.resources) {
            sectionsErrors.push(ResourcesSectionConstructor(true))
            hasResources = true
          }

          if (section.infobar) {
            sectionsErrors.push(InfobarSectionConstructor(true))
          }

          if (section.infopic) {
            sectionsErrors.push(InfopicSectionConstructor(true))
          }

          // Minimize all sections by default
          displaySections.push(false)
        })

        // Initialize errors object
        const errors = {
          sections: sectionsErrors,
          highlights: highlightsErrors,
          dropdownElems: dropdownElemsErrors,
        }

        if (_isMounted) {
          setFrontMatter(frontMatter)
          setOriginalFrontMatter(_.cloneDeep(frontMatter))
          setSha(sha)
          setHasResources(hasResources)
          setDisplaySections(displaySections)
          setDisplayDropdownElems(displayDropdownElems)
          setDisplayHighlights(displayHighlights)
          setErrors(errors)
          setHasLoaded(true)
          setScrollRefs(scrollRefs)
        }
      } catch (err) {
        // Set frontMatter to be same to prevent warning message when navigating away
        if (_isMounted) setFrontMatter(originalFrontMatter)
        errorToast(
          `There was a problem trying to load your homepage. ${DEFAULT_RETRY_MSG}`
        )
        console.log(err)
      }
    }

    loadPageDetails()
    return () => {
      _isMounted = false
    }
  }, [])

  useEffect(() => {
    if (scrollRefs.length > 0) {
      scrollRefs[frontMatter.sections.length - 1].current.scrollIntoView()
    }
  }, [frontMatter.sections.length])

  useEffect(() => {
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

    const hasHighlightErrors = _.some(
      errors.highlights,
      (highlight) =>
        _.some(highlight, (errorMessage) => errorMessage.length > 0) === true
    )

    const hasDropdownElemErrors = _.some(
      errors.dropdownElems,
      (dropdownElem) =>
        _.some(dropdownElem, (errorMessage) => errorMessage.length > 0) === true
    )

    const hasErrors =
      hasSectionErrors || hasHighlightErrors || hasDropdownElemErrors

    setHasErrors(hasErrors)
  }, [errors])

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
          const sectionType = idArray[2] // e.g. "hero" or "infobar" or "resources"
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

          scrollRefs[sectionIndex].current.scrollIntoView()
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

          scrollRefs[0].current.scrollIntoView()
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

          scrollRefs[0].current.scrollIntoView()
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

          scrollRefs[0].current.scrollIntoView()
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

      let newSections = []
      let newErrors = []

      switch (elemType) {
        case "section": {
          // The Isomer site can only have 1 resources section in the homepage
          // Set hasResources to prevent the creation of more resources sections
          if (value === "resources") {
            setHasResources(true)
          }

          newSections = update(frontMatter.sections, {
            $push: [enumSection(value, false)],
          })
          newErrors = update(errors, {
            sections: {
              $push: [enumSection(value, true)],
            },
          })
          const newScrollRefs = update(scrollRefs, { $push: [createRef()] })

          const resetDisplaySections = _.fill(
            Array(displaySections.length),
            false
          )
          const newDisplaySections = update(resetDisplaySections, {
            $push: [true],
          })

          setScrollRefs(newScrollRefs)
          setDisplaySections(newDisplaySections)

          break
        }
        case "dropdownelem": {
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT) + 1

          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    $splice: [
                      [dropdownsIndex, 0, DropdownElemConstructor(false)],
                    ],
                  },
                },
              },
            },
          })

          newErrors = update(errors, {
            dropdownElems: {
              $splice: [[dropdownsIndex, 0, DropdownElemConstructor(true)]],
            },
          })

          const resetDisplayDropdownElems = _.fill(
            Array(displayDropdownElems.length),
            false
          )
          const newDisplayDropdownElems = update(resetDisplayDropdownElems, {
            $splice: [[dropdownsIndex, 0, true]],
          })

          setDisplayDropdownElems(newDisplayDropdownElems)

          break
        }
        case "highlight": {
          // If key highlights section exists
          if (!_.isEmpty(frontMatter.sections[0].hero.key_highlights)) {
            const highlightIndex = parseInt(idArray[1], 10) + 1

            newSections = update(frontMatter.sections, {
              0: {
                hero: {
                  key_highlights: {
                    $splice: [
                      [highlightIndex, 0, KeyHighlightConstructor(false)],
                    ],
                  },
                },
              },
            })

            newErrors = update(errors, {
              highlights: {
                $splice: [[highlightIndex, 0, KeyHighlightConstructor(true)]],
              },
            })

            const resetDisplayHighlights = _.fill(
              Array(displayHighlights.length),
              false
            )
            const newDisplayHighlights = update(resetDisplayHighlights, {
              $splice: [[highlightIndex, 0, true]],
            })

            setDisplayHighlights(newDisplayHighlights)
          } else {
            // If neither key highlights nor dropdown section exists, create new key highlights array
            newSections = _.cloneDeep(frontMatter.sections)
            newSections[0].hero.key_highlights = [
              KeyHighlightConstructor(false),
            ]

            newErrors = _.cloneDeep(errors)
            newErrors.highlights = [KeyHighlightConstructor(true)]

            const newDisplayHighlights = [true]

            setDisplayHighlights(newDisplayHighlights)
          }
          break
        }
        default:
          return
      }
      setFrontMatter({
        ...frontMatter,
        sections: newSections,
      })
      setErrors(newErrors)
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split("-")
      const elemType = idArray[0]

      let newSections = []
      let newErrors = {}

      switch (elemType) {
        case "section": {
          const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT)

          // Set hasResources to false to allow users to create a resources section
          if (frontMatter.sections[sectionIndex].resources) {
            setHasResources(false)
          }

          newSections = update(frontMatter.sections, {
            $splice: [[sectionIndex, 1]],
          })

          newErrors = update(errors, {
            sections: {
              $splice: [[sectionIndex, 1]],
            },
          })

          const newScrollRefs = update(scrollRefs, {
            $splice: [[sectionIndex, 1]],
          })

          const newDisplaySections = update(displaySections, {
            $splice: [[sectionIndex, 1]],
          })

          setDisplaySections(newDisplaySections)
          setScrollRefs(newScrollRefs)
          break
        }
        case "dropdownelem": {
          const dropdownsIndex = parseInt(idArray[1], RADIX_PARSE_INT)
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                dropdown: {
                  options: {
                    $splice: [[dropdownsIndex, 1]],
                  },
                },
              },
            },
          })

          newErrors = update(errors, {
            dropdownElems: {
              $splice: [[dropdownsIndex, 1]],
            },
          })

          const newDisplayDropdownElems = update(displayDropdownElems, {
            $splice: [[dropdownsIndex, 1]],
          })

          setDisplayDropdownElems(newDisplayDropdownElems)
          break
        }
        case "highlight": {
          const highlightIndex = parseInt(idArray[1], 10)
          newSections = update(frontMatter.sections, {
            0: {
              hero: {
                key_highlights: {
                  $splice: [[highlightIndex, 1]],
                },
              },
            },
          })

          newErrors = update(errors, {
            highlights: {
              $splice: [[highlightIndex, 1]],
            },
          })

          const newDisplayHighlights = update(displayHighlights, {
            $splice: [[highlightIndex, 1]],
          })

          setDisplayHighlights(newDisplayHighlights)
          break
        }
        default:
          return
      }
      setFrontMatter({
        ...frontMatter,
        sections: newSections,
      })
      setErrors(newErrors)
    } catch (err) {
      console.log(err)
    }
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
        dropdownObj = savedHeroElems.dropdown || DropdownConstructor()
        dropdownErrors = savedHeroErrors.dropdown || ""
        dropdownElemErrors = savedHeroErrors.dropdownElems || ""
      } else {
        dropdownObj = DropdownConstructor()
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

  const toggleDropdown = async () => {
    try {
      setDropdownIsActive((prevState) => !prevState)
    } catch (err) {
      console.log(err)
    }
  }

  const displayHandler = async (event) => {
    try {
      const { id } = event.target
      const idArray = id.split("-")
      const elemType = idArray[0]
      switch (elemType) {
        case "section": {
          const sectionId = idArray[1]
          const resetDisplaySections = _.fill(
            Array(displaySections.length),
            false
          )
          resetDisplaySections[sectionId] = !displaySections[sectionId]
          const newDisplaySections = update(displaySections, {
            $set: resetDisplaySections,
          })

          setDisplaySections(newDisplaySections)

          scrollRefs[sectionId].current.scrollIntoView()
          break
        }
        case "highlight": {
          const highlightIndex = idArray[1]
          const resetHighlightSections = _.fill(
            Array(displayHighlights.length),
            false
          )
          resetHighlightSections[highlightIndex] = !displayHighlights[
            highlightIndex
          ]
          const newDisplayHighlights = update(displayHighlights, {
            $set: resetHighlightSections,
          })

          setDisplayHighlights(newDisplayHighlights)
          break
        }
        case "dropdownelem": {
          const dropdownsIndex = idArray[1]
          const resetDropdownSections = _.fill(
            Array(displayDropdownElems.length),
            false
          )
          resetDropdownSections[dropdownsIndex] = !displayDropdownElems[
            dropdownsIndex
          ]
          const newDisplayDropdownElems = update(displayDropdownElems, {
            $set: resetDropdownSections,
          })

          setDisplayDropdownElems(newDisplayDropdownElems)
          break
        }
        default:
          return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const savePage = async () => {
    try {
      const { siteName } = match.params
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
      const content = concatFrontMatterMdBody(filteredFrontMatter, "")

      const params = {
        content,
        sha,
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`,
        params,
        {
          withCredentials: true,
        }
      )

      window.location.reload()
    } catch (err) {
      errorToast(
        `There was a problem trying to save your homepage. ${DEFAULT_RETRY_MSG}`
      )
      console.log(err)
    }
  }

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

    let newSections = []
    let newErrors = []

    switch (type) {
      case "editor": {
        const draggedElem = frontMatter.sections[source.index]
        newSections = update(frontMatter.sections, {
          $splice: [
            [source.index, 1], // Remove elem from its original position
            [destination.index, 0, draggedElem], // Splice elem into its new position
          ],
        })

        const draggedError = errors.sections[source.index]
        newErrors = update(errors, {
          sections: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        })

        const displayBool = displaySections[source.index]
        const newDisplaySections = update(displaySections, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        })

        setDisplaySections(newDisplaySections)
        break
      }
      case "dropdownelem": {
        const draggedElem =
          frontMatter.sections[0].hero.dropdown.options[source.index]
        newSections = update(frontMatter.sections, {
          0: {
            hero: {
              dropdown: {
                options: {
                  $splice: [
                    [source.index, 1], // Remove elem from its original position
                    [destination.index, 0, draggedElem], // Splice elem into its new position
                  ],
                },
              },
            },
          },
        })

        const draggedError = errors.dropdownElems[source.index]
        newErrors = update(errors, {
          dropdownElems: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        })

        const displayBool = displayDropdownElems[source.index]
        const newDisplayDropdownElems = update(displayDropdownElems, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        })

        setDisplayDropdownElems(newDisplayDropdownElems)
        break
      }
      case "highlight": {
        const draggedElem =
          frontMatter.sections[0].hero.key_highlights[source.index]
        newSections = update(frontMatter.sections, {
          0: {
            hero: {
              key_highlights: {
                $splice: [
                  [source.index, 1], // Remove elem from its original position
                  [destination.index, 0, draggedElem], // Splice elem into its new position
                ],
              },
            },
          },
        })

        const draggedError = errors.highlights[source.index]
        newErrors = update(errors, {
          highlights: {
            $splice: [
              [source.index, 1], // Remove error from its original position
              [destination.index, 0, draggedError], // Splice error into its new position
            ],
          },
        })

        const displayBool = displayHighlights[source.index]
        const newDisplayHighlights = update(displayHighlights, {
          $splice: [
            [source.index, 1],
            [destination.index, 0, displayBool],
          ],
        })

        setDisplayHighlights(newDisplayHighlights)
        break
      }
      default:
        return
    }
    setFrontMatter({
      ...frontMatter,
      sections: newSections,
    })
    setErrors(newErrors)
  }

  const isLeftInfoPic = (sectionIndex) => {
    // If the previous section in the list was not an infopic section
    // or if the previous section was a right infopic section, return true
    if (
      !frontMatter.sections[sectionIndex - 1].infopic ||
      !isLeftInfoPic(sectionIndex - 1)
    )
      return true

    return false
  }

  return (
    <>
      {itemPendingForDelete.id && (
        <DeleteWarningModal
          onCancel={() => setItemPendingForDelete({ id: null, type: "" })}
          onDelete={() => {
            deleteHandler(itemPendingForDelete.id)
            setItemPendingForDelete({ id: null, type: "" })
          }}
          type={itemPendingForDelete.type}
        />
      )}
      <Header
        siteName={siteName}
        title="Homepage"
        shouldAllowEditPageBackNav={
          JSON.stringify(originalFrontMatter) === JSON.stringify(frontMatter)
        }
        isEditPage
        backButtonText="Back to My Workspace"
        backButtonUrl={`/sites/${siteName}/workspace`}
      />
      {hasLoaded && (
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <p>
                  <b>Site notification</b>
                </p>
                <Input
                  placeholder="Notification"
                  value={frontMatter.notification}
                  id="site-notification"
                  onChange={onFieldChange}
                />
                <span className={elementStyles.info}>
                  Note: Leave text field empty if you don’t need this
                  notification bar
                </span>
              </div>

              {/* Homepage section configurations */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="leftPane" type="editor">
                  {(droppableProvided) => (
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {frontMatter.sections.map((section, sectionIndex) => (
                        <>
                          {/* Hero section */}
                          {section.hero ? (
                            <>
                              <EditorHeroSection
                                key={`section-${sectionIndex}`}
                                title={section.hero.title}
                                subtitle={section.hero.subtitle}
                                background={section.hero.background}
                                button={section.hero.button}
                                url={section.hero.url}
                                dropdown={
                                  section.hero.dropdown
                                    ? section.hero.dropdown
                                    : null
                                }
                                sectionIndex={sectionIndex}
                                highlights={
                                  section.hero.key_highlights
                                    ? section.hero.key_highlights
                                    : []
                                }
                                onFieldChange={onFieldChange}
                                createHandler={createHandler}
                                deleteHandler={(event, type) =>
                                  setItemPendingForDelete({
                                    id: event.target.id,
                                    type,
                                  })
                                }
                                shouldDisplay={displaySections[sectionIndex]}
                                displayHighlights={displayHighlights}
                                displayDropdownElems={displayDropdownElems}
                                displayHandler={displayHandler}
                                onDragEnd={onDragEnd}
                                errors={errors}
                                siteName={siteName}
                                handleHighlightDropdownToggle={
                                  handleHighlightDropdownToggle
                                }
                              />
                            </>
                          ) : null}

                          {/* Resources section */}
                          {section.resources ? (
                            <Draggable
                              draggableId={`resources-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorResourcesSection
                                    key={`section-${sectionIndex}`}
                                    title={section.resources.title}
                                    subtitle={section.resources.subtitle}
                                    button={section.resources.button}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Resources Section",
                                      })
                                    }
                                    onFieldChange={onFieldChange}
                                    shouldDisplay={
                                      displaySections[sectionIndex]
                                    }
                                    displayHandler={displayHandler}
                                    errors={
                                      errors.sections[sectionIndex].resources
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Infobar section */}
                          {section.infobar ? (
                            <Draggable
                              draggableId={`infobar-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorInfobarSection
                                    key={`section-${sectionIndex}`}
                                    title={section.infobar.title}
                                    subtitle={section.infobar.subtitle}
                                    description={section.infobar.description}
                                    button={section.infobar.button}
                                    url={section.infobar.url}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Infobar Section",
                                      })
                                    }
                                    onFieldChange={onFieldChange}
                                    shouldDisplay={
                                      displaySections[sectionIndex]
                                    }
                                    displayHandler={displayHandler}
                                    errors={
                                      errors.sections[sectionIndex].infobar
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Infopic section */}
                          {section.infopic ? (
                            <Draggable
                              draggableId={`infopic-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorInfopicSection
                                    key={`section-${sectionIndex}`}
                                    title={section.infopic.title}
                                    subtitle={section.infopic.subtitle}
                                    description={section.infopic.description}
                                    button={section.infopic.button}
                                    url={section.infopic.url}
                                    imageUrl={section.infopic.image}
                                    imageAlt={section.infopic.alt}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Infopic Section",
                                      })
                                    }
                                    onFieldChange={onFieldChange}
                                    shouldDisplay={
                                      displaySections[sectionIndex]
                                    }
                                    displayHandler={displayHandler}
                                    errors={
                                      errors.sections[sectionIndex].infopic
                                    }
                                    siteName={siteName}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Carousel section */}
                          {/* TO-DO */}
                        </>
                      ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Section creator */}
              <NewSectionCreator
                hasResources={hasResources}
                createHandler={createHandler}
              />
            </div>
          </div>
          <div className={editorStyles.homepageEditorMain}>
            {/* Isomer Template Pane */}
            {/* Notification */}
            {frontMatter.notification && (
              <div className="bp-notification bg-secondary is-marginless">
                <div className="bp-container">
                  <div className="row">
                    <div className="col">
                      <div className="field has-addons bp-notification-flex">
                        <div className="control has-text-centered has-text-white">
                          <h6>{frontMatter.notification}</h6>
                        </div>
                        <div className="button has-text-white">
                          <span className="sgds-icon sgds-icon-cross" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {frontMatter.sections.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero ? (
                  <>
                    <TemplateHeroSection
                      key={`section-${sectionIndex}`}
                      hero={section.hero}
                      siteName={siteName}
                      dropdownIsActive={dropdownIsActive}
                      toggleDropdown={toggleDropdown}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Resources section */}
                {section.resources ? (
                  <>
                    <TemplateResourcesSection
                      key={`section-${sectionIndex}`}
                      title={section.resources.title}
                      subtitle={section.resources.subtitle}
                      button={section.resources.button}
                      sectionIndex={sectionIndex}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Infobar section */}
                {section.infobar ? (
                  <>
                    <TemplateInfobarSection
                      key={`section-${sectionIndex}`}
                      title={section.infobar.title}
                      subtitle={section.infobar.subtitle}
                      description={section.infobar.description}
                      button={section.infobar.button}
                      sectionIndex={sectionIndex}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Infopic section */}
                {section.infopic ? (
                  <>
                    {isLeftInfoPic(sectionIndex) ? (
                      <TemplateInfopicLeftSection
                        key={`section-${sectionIndex}`}
                        title={section.infopic.title}
                        subtitle={section.infopic.subtitle}
                        description={section.infopic.description}
                        imageUrl={section.infopic.image}
                        imageAlt={section.infopic.alt}
                        button={section.infopic.button}
                        sectionIndex={sectionIndex}
                        siteName={siteName}
                        ref={scrollRefs[sectionIndex]}
                      />
                    ) : (
                      <TemplateInfopicRightSection
                        key={`section-${sectionIndex}`}
                        title={section.infopic.title}
                        subtitle={section.infopic.subtitle}
                        description={section.infopic.description}
                        imageUrl={section.infopic.image}
                        imageAlt={section.infopic.alt}
                        button={section.infopic.button}
                        sectionIndex={sectionIndex}
                        siteName={siteName}
                        ref={scrollRefs[sectionIndex]}
                      />
                    )}
                  </>
                ) : null}
              </>
            ))}
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <LoadingButton
              label="Save"
              disabled={hasErrors}
              disabledStyle={elementStyles.disabled}
              className={
                hasErrors || !sha ? elementStyles.disabled : elementStyles.blue
              }
              callback={savePage}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default EditHomepage

EditHomepage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
