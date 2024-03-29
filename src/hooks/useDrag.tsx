import { DropResult } from "@hello-pangea/dnd"
import update from "immutability-helper"
import _ from "lodash"

import { ANNOUNCEMENT_BLOCK } from "layouts/EditHomepage/constants"

import {
  EditorHeroDropdownSection,
  EditorHeroHighlightsSection,
  EditorHomepageElement,
  EditorHomepageState,
  EditortextCardItemsSection,
  EditorTextcardSection,
  HeroFrontmatterSection,
  PossibleEditorSections,
  EditorHomepageFrontmatterSection,
  AnnouncementsFrontmatterSection,
  AnnouncementOption,
  TextcardFrontmatterSection,
  InfocolsFrontmatterSection,
  EditorInfocolsSection,
} from "types/homepage"

const RADIX_PARSE_INT = 10

const updatePositions = <T,>(
  section: T[],
  source: number,
  destination: number,
  elem: T
): T[] => {
  return update(section, {
    $splice: [
      // start index, delete count, insert item(s)
      // NOTE: Remove 1 element at the source index
      [source, 1], // Remove elem from its original position
      [destination, 0, elem], // Splice elem into its new position
    ],
  })
}

const createElement = <T,>(section: T[], elem: T): T[] => {
  return update(section, {
    $push: [elem],
  })
}

const deleteElement = <T,>(section: T[], indexToDelete: number): T[] => {
  return update(section, {
    $splice: [[indexToDelete, 1]],
  })
}

const updateEditorSection = (
  homepageState: EditorHomepageState,
  newDisplaySections: unknown[],
  newFrontMatterSection: EditorHomepageState["frontMatter"]["sections"],
  newSectionErrors: unknown[],
  newTextcardErrors: unknown[][],
  newInfocolsErrors: unknown[][]
): EditorHomepageState => ({
  ...homepageState,
  displaySections: newDisplaySections,
  frontMatter: {
    ...homepageState.frontMatter,
    sections: newFrontMatterSection,
  },
  errors: {
    ...homepageState.errors,
    sections: newSectionErrors,
    textcards: newTextcardErrors,
    infocols: newInfocolsErrors,
  },
})

const updateAnnouncementSection = (
  homepageState: EditorHomepageState,
  newDisplayAnnouncementItems: unknown[],
  newAnnouncementOptions: unknown[],
  newAnnouncementErrors: unknown[],
  announcementsIndex: number
): EditorHomepageState => {
  return {
    ...homepageState,
    displayAnnouncementItems: newDisplayAnnouncementItems,
    frontMatter: {
      ...homepageState.frontMatter,
      sections: _.set(
        // NOTE: Deep clone here to avoid mutation
        _.cloneDeep(homepageState.frontMatter.sections),
        [announcementsIndex, ANNOUNCEMENT_BLOCK.id, "announcement_items"],
        newAnnouncementOptions
      ),
    },
    errors: {
      ...homepageState.errors,
      announcementItems: newAnnouncementErrors,
    },
  }
}

const updateDropdownSection = (
  homepageState: EditorHomepageState,
  newDisplayDropdownElems: unknown[],
  newDropdownOptions: unknown[],
  newDropdownErrors: unknown[]
): EditorHomepageState => ({
  ...homepageState,
  displayDropdownElems: newDisplayDropdownElems,
  frontMatter: {
    ...homepageState.frontMatter,
    sections: _.set(
      // NOTE: Deep clone here to avoid mutation
      _.cloneDeep(homepageState.frontMatter.sections),
      ["0", "hero", "dropdown", "options"],
      newDropdownOptions
    ),
  },
  errors: { ...homepageState.errors, dropdownElems: newDropdownErrors },
})

const updateHighlightsSection = (
  homepageState: EditorHomepageState,
  newDisplayHighlights: unknown[],
  newHighlightOptions: unknown[],
  newHighlightErrors: unknown[]
): EditorHomepageState => ({
  ...homepageState,
  displayHighlights: newDisplayHighlights,
  frontMatter: {
    ...homepageState.frontMatter,
    sections: _.set(
      // NOTE: Deep clone here to avoid mutation
      _.cloneDeep(homepageState.frontMatter.sections),
      ["0", "hero", "key_highlights"],
      newHighlightOptions
    ),
  },
  errors: { ...homepageState.errors, highlights: newHighlightErrors },
})

const updateTextCardsCardSection = (
  homepageState: EditorHomepageState,
  sectionIndex: number,
  newTextCards: unknown[],
  newTextCardErrors: unknown[]
): EditorHomepageState => {
  // Needs to be done separately - lodash's set seems to be buggy when handling arrays of objects
  const modifiedSection = _.set(
    _.cloneDeep(homepageState.frontMatter.sections[sectionIndex]),
    ["textcards", "cards"],
    newTextCards
  )
  const newSections = _.cloneDeep(homepageState.frontMatter.sections)
  newSections[sectionIndex] = modifiedSection
  return {
    ...homepageState,
    frontMatter: {
      ...homepageState.frontMatter,
      sections: newSections,
    },
    errors: {
      ...homepageState.errors,
      textcards: _.set(
        // NOTE: Deep clone here to avoid mutation
        _.cloneDeep(homepageState.errors.textcards),
        [sectionIndex],
        newTextCardErrors
      ),
    },
  }
}

const updateInfocolsInfoboxesSection = (
  homepageState: EditorHomepageState,
  sectionIndex: number,
  newInfoboxes: unknown[],
  newInfoboxErrors: unknown[]
): EditorHomepageState => {
  // Needs to be done separately - lodash's set seems to be buggy when handling arrays of objects
  const modifiedSection = _.set(
    _.cloneDeep(homepageState.frontMatter.sections[sectionIndex]),
    ["infocols", "infoboxes"],
    newInfoboxes
  )
  const newSections = _.cloneDeep(homepageState.frontMatter.sections)
  newSections[sectionIndex] = modifiedSection
  const newState = {
    ...homepageState,
    frontMatter: {
      ...homepageState.frontMatter,
      sections: newSections,
    },
    errors: {
      ...homepageState.errors,
      infocols: _.set(
        // NOTE: Deep clone here to avoid mutation
        _.cloneDeep(homepageState.errors.infocols),
        [sectionIndex],
        newInfoboxErrors
      ),
    },
  }
  return newState
}

type OnDragEndResponseWrapper = (
  state: EditorHomepageState
) => (result: DropResult) => EditorHomepageState

// TODO: keep state in context rather than doing this
export const useDrag: OnDragEndResponseWrapper = (
  homepageState: EditorHomepageState
) => (result) => {
  return updateHomepageState(result, homepageState)
}

type UpdateHomepageType =
  | "editor"
  | "dropdownelem"
  | "highlight"
  | "announcement"
  | `textCardItem-${number}`
  | `infocolInfobox-${number}`

const isUpdateHomepageType = (
  value: unknown
): value is UpdateHomepageType | EditorHomepageElement => {
  if (typeof value === "string" && value.startsWith("textCardItem-")) {
    const valArr = value.split("-")
    const possibleCardIndex = valArr[1]
    return (
      valArr.length === 2 &&
      !!possibleCardIndex &&
      !Number.isNaN(Number(possibleCardIndex))
    )
  }

  if (typeof value === "string" && value.startsWith("infocolInfobox-")) {
    const valArr = value.split("-")
    const possibleInfoboxIndex = valArr[1]
    return (
      valArr.length === 2 &&
      !!possibleInfoboxIndex &&
      !Number.isNaN(Number(possibleInfoboxIndex))
    )
  }

  if (typeof value === "string") {
    return (
      value === "editor" ||
      value === "dropdownelem" ||
      value === "highlight" ||
      value === "announcement" ||
      value === "section"
    )
  }

  return false
}

// NOTE: We mutate by addr in some places
// maybe we just do a deep copy?
// and point it to a store next time,
// which will ensure read reference equality
const updateHomepageState = (
  result: DropResult,
  homepageState: EditorHomepageState
): EditorHomepageState => {
  const { source, destination, type } = result
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
    displayAnnouncementItems,
  } = homepageState

  // If the user dropped the draggable to no known droppable
  if (!destination) return homepageState

  // The draggable elem was returned to its original position
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return homepageState
  if (!isUpdateHomepageType(type)) return homepageState

  if (type === "editor") {
    const draggedElem = frontMatter.sections[source.index]
    const newSections = updatePositions(
      frontMatter.sections,
      source.index,
      destination.index,
      draggedElem
    )
    const draggedError = errors.sections[source.index]
    const newSectionErrors = updatePositions(
      errors.sections,
      source.index,
      destination.index,
      draggedError
    )

    const draggedTextcardError = errors.textcards[source.index]
    const newCardErrors = updatePositions(
      errors.textcards,
      source.index,
      destination.index,
      draggedTextcardError
    )

    const draggedInfocolsError = errors.infocols[source.index]
    const newInfocolsErrors = updatePositions(
      errors.infocols,
      source.index,
      destination.index,
      draggedInfocolsError
    )

    const displayBool = displaySections[source.index]
    const newDisplaySections = updatePositions(
      displaySections,
      source.index,
      destination.index,
      displayBool
    )

    return updateEditorSection(
      homepageState,
      newDisplaySections,
      newSections,
      newSectionErrors,
      newCardErrors,
      newInfocolsErrors
    )
  }
  // inner dnd for hero
  // passed in via droppableId
  if (type === "dropdownelem") {
    // TODO: type check to avoid casting
    const draggedElem = ((frontMatter.sections[0] as HeroFrontmatterSection)
      .hero as EditorHeroDropdownSection).dropdown.options[source.index]
    const newDropdownOptions = updatePositions(
      ((frontMatter.sections[0] as HeroFrontmatterSection)
        .hero as EditorHeroDropdownSection).dropdown.options,
      source.index,
      destination.index,
      draggedElem
    )

    const draggedError = errors.dropdownElems[source.index]
    const newDropdownErrors = updatePositions(
      errors.dropdownElems,
      source.index,
      destination.index,
      draggedError
    )
    const displayBool = displayDropdownElems[source.index]
    const newDisplayDropdownElems = updatePositions(
      displayDropdownElems,
      source.index,
      destination.index,
      displayBool
    )

    return {
      ...homepageState,
      displayDropdownElems: newDisplayDropdownElems,
      frontMatter: {
        ...frontMatter,
        sections: _.set(
          frontMatter.sections,
          ["0", "hero", "dropdown", "options"],
          newDropdownOptions
        ),
      },
      errors: { ...errors, dropdownElems: newDropdownErrors },
    }
  }
  if (type === "highlight") {
    // TODO: type check to avoid casting
    const draggedElem = ((frontMatter.sections[0] as HeroFrontmatterSection)
      .hero as EditorHeroHighlightsSection).key_highlights[source.index]
    const newHighlightOptions = updatePositions(
      ((frontMatter.sections[0] as HeroFrontmatterSection)
        .hero as EditorHeroHighlightsSection).key_highlights,
      source.index,
      destination.index,
      draggedElem
    )

    const draggedError = errors.highlights[source.index]
    const newHighlightErrors = updatePositions(
      errors.highlights,
      source.index,
      destination.index,
      draggedError
    )

    const displayBool = displayHighlights[source.index]
    const newDisplayHighlights = updatePositions(
      displayHighlights,
      source.index,
      destination.index,
      displayBool
    )
    return updateHighlightsSection(
      homepageState,
      newDisplayHighlights,
      newHighlightOptions,
      newHighlightErrors
    )
  }
  if (type === "announcement") {
    const doesAnnouncementKeyExist = !_.isEmpty(
      frontMatter.sections.find((section) =>
        EditorHomepageFrontmatterSection.isAnnouncements(section)
      )
    )
    if (!doesAnnouncementKeyExist) {
      // should not reach here, but defensively return the original state
      return homepageState
    }

    const announcementsIndex = frontMatter.sections.findIndex((section) =>
      EditorHomepageFrontmatterSection.isAnnouncements(section)
    )
    const draggedElem = (frontMatter.sections[
      announcementsIndex
      // safe to assert as check is done above
    ] as AnnouncementsFrontmatterSection).announcements.announcement_items[
      source.index
    ]

    const newAnnouncementsOptions = updatePositions(
      (frontMatter.sections[
        announcementsIndex
        // safe to assert as check is done above
      ] as AnnouncementsFrontmatterSection).announcements.announcement_items,
      source.index,
      destination.index,
      draggedElem
    )

    const draggedError = errors.announcementItems[source.index]
    const newAnnouncementErrors = updatePositions(
      errors.announcementItems,
      source.index,
      destination.index,
      draggedError
    )
    const displayBool = displayAnnouncementItems[source.index]
    const newDisplayAnnouncementItems = updatePositions(
      displayAnnouncementItems,
      source.index,
      destination.index,
      displayBool
    )

    return updateAnnouncementSection(
      homepageState,
      newDisplayAnnouncementItems,
      newAnnouncementsOptions,
      newAnnouncementErrors,
      announcementsIndex
    )
  }
  if (type.startsWith("textCardItem")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(type.split("-")[1], RADIX_PARSE_INT)
    const textCardsItem = (frontMatter.sections[
      parentId
    ] as TextcardFrontmatterSection).textcards as EditorTextcardSection
    const draggedElem = textCardsItem.cards[source.index]
    const newTextcards = updatePositions(
      textCardsItem.cards,
      source.index,
      destination.index,
      draggedElem
    )

    const draggedError = errors.textcards[parentId][source.index]
    const newTextcardErrors = updatePositions(
      errors.textcards[parentId],
      source.index,
      destination.index,
      draggedError
    )

    return updateTextCardsCardSection(
      homepageState,
      parentId,
      newTextcards,
      newTextcardErrors
    )
  }
  if (type.startsWith("infocolInfobox")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(type.split("-")[1], RADIX_PARSE_INT)
    const infocols = (frontMatter.sections[
      parentId
    ] as InfocolsFrontmatterSection).infocols as EditorInfocolsSection
    const draggedElem = infocols.infoboxes[source.index]
    const newInfoboxes = updatePositions(
      infocols.infoboxes,
      source.index,
      destination.index,
      draggedElem
    )

    const draggedError = errors.infocols[parentId][source.index]
    const newInfocolsErrors = updatePositions(
      errors.infocols[parentId],
      source.index,
      destination.index,
      draggedError
    )

    return updateInfocolsInfoboxesSection(
      homepageState,
      parentId,
      newInfoboxes,
      newInfocolsErrors
    )
  }
  return homepageState
}

// NOTE: Handles only placement,
// let the caller decide what to create
export const onCreate = <E,>(
  homepageState: EditorHomepageState,
  elemType: EditorHomepageElement,
  val: PossibleEditorSections,
  err: E
): EditorHomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
    displayAnnouncementItems,
  } = homepageState

  if (!isUpdateHomepageType(elemType)) return homepageState

  if (elemType === "section") {
    const sections = createElement(frontMatter.sections, val)
    const newErrorSections = createElement(errors.sections, err)

    const resetDisplaySections = _.fill(Array(displaySections.length), false)
    const newDisplaySections = createElement(resetDisplaySections, true)

    const newTextcardErrors = createElement(errors.textcards, [])

    const newInfocolsErrors = createElement(errors.infocols, [])

    return updateEditorSection(
      homepageState,
      newDisplaySections,
      sections as EditorHomepageState["frontMatter"]["sections"],
      newErrorSections,
      newTextcardErrors,
      newInfocolsErrors
    )
  }
  if (elemType === "dropdownelem") {
    const newDropdownOptions = createElement(
      ((frontMatter.sections[0] as HeroFrontmatterSection)
        .hero as EditorHeroDropdownSection).dropdown.options,
      val
    )
    const newDropdownErrors = createElement(errors.dropdownElems, err)
    const resetDisplayDropdownElems = _.fill(
      Array(displayDropdownElems.length),
      false
    )
    const newDisplayDropdownElems = createElement(
      resetDisplayDropdownElems,
      true
    )

    return updateDropdownSection(
      homepageState,
      newDisplayDropdownElems,
      newDropdownOptions,
      newDropdownErrors
    )
  }
  if (elemType === "highlight") {
    // If key highlights section exists
    if (
      !_.isEmpty(
        ((frontMatter.sections[0] as HeroFrontmatterSection)
          .hero as EditorHeroHighlightsSection).key_highlights
      )
    ) {
      const newHighlightOptions = createElement(
        ((frontMatter.sections[0] as HeroFrontmatterSection)
          .hero as EditorHeroHighlightsSection).key_highlights,
        val
      )

      const newHighlightErrors = createElement(errors.highlights, err)

      const resetDisplayHighlights = _.fill(
        Array(displayHighlights.length),
        false
      )
      const newDisplayHighlights = createElement(resetDisplayHighlights, true)

      return updateHighlightsSection(
        homepageState,
        newDisplayHighlights,
        newHighlightOptions,
        newHighlightErrors
      )
    }

    return updateHighlightsSection(homepageState, [true], [val], [err])
  }
  if (elemType === "announcement") {
    const announcementKeyExist = !_.isEmpty(
      frontMatter.sections.find((section) =>
        EditorHomepageFrontmatterSection.isAnnouncements(section)
      )
    )
    if (!announcementKeyExist) {
      // should not reach here, but defensively return the original state
      return homepageState
    }

    const announcementsIndex = frontMatter.sections.findIndex((section) =>
      EditorHomepageFrontmatterSection.isAnnouncements(section)
    )
    const announcementBlockSection: AnnouncementsFrontmatterSection = frontMatter
      .sections[announcementsIndex] as AnnouncementsFrontmatterSection

    const announcements = createElement(
      announcementBlockSection.announcements.announcement_items,
      val as AnnouncementOption
    )

    const resetDisplaySections = _.fill(
      Array(displayAnnouncementItems.length),
      false
    )
    const newDisplayAnnouncementItems = createElement(
      resetDisplaySections,
      true
    )

    const newAnnouncementErrors = createElement(errors.announcementItems, err)

    return updateAnnouncementSection(
      homepageState,
      newDisplayAnnouncementItems,
      announcements,
      newAnnouncementErrors,
      announcementsIndex
    )
  }
  if (elemType.startsWith("textCardItem")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(elemType.split("-")[1], RADIX_PARSE_INT)
    const sectionInfo = (frontMatter.sections[
      parentId
    ] as TextcardFrontmatterSection).textcards as EditortextCardItemsSection
    if (!_.isEmpty(sectionInfo.cards)) {
      const newTextCards = createElement(sectionInfo.cards, val)
      const newTextcardErrors = createElement(errors.textcards[parentId], err)
      return updateTextCardsCardSection(
        homepageState,
        parentId,
        newTextCards,
        newTextcardErrors
      )
    }
    const newState = updateTextCardsCardSection(
      homepageState,
      parentId,
      [val],
      [err]
    )
    return newState
  }

  if (elemType.startsWith("infocolInfobox")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(elemType.split("-")[1], RADIX_PARSE_INT)
    const sectionInfo = (frontMatter.sections[
      parentId
    ] as InfocolsFrontmatterSection).infocols as EditorInfocolsSection
    if (!_.isEmpty(sectionInfo.infoboxes)) {
      const newInfoboxes = createElement(sectionInfo.infoboxes, val)
      const newInfocolsErrors = createElement(errors.infocols[parentId], err)
      const newState = updateInfocolsInfoboxesSection(
        homepageState,
        parentId,
        newInfoboxes,
        newInfocolsErrors
      )
      return newState
    }
    const newState = updateInfocolsInfoboxesSection(
      homepageState,
      parentId,
      [val],
      [err]
    )
    return newState
  }
  return homepageState
}

export const onDelete = (
  homepageState: EditorHomepageState,
  elemType: EditorHomepageElement,
  indexToDelete: number
): EditorHomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
    displayAnnouncementItems,
  } = homepageState

  if (!isUpdateHomepageType(elemType)) return homepageState
  if (elemType === "section") {
    const sections = deleteElement(frontMatter.sections, indexToDelete)
    const newErrorSections = deleteElement(errors.sections, indexToDelete)
    const newDisplaySections = deleteElement(displaySections, indexToDelete)
    const newTextcardErrors = deleteElement(errors.textcards, indexToDelete)
    const newInfocolsErrors = deleteElement(errors.infocols, indexToDelete)

    return updateEditorSection(
      homepageState,
      newDisplaySections,
      sections,
      newErrorSections,
      newTextcardErrors,
      newInfocolsErrors
    )
  }

  if (elemType === "dropdownelem") {
    const newDropdownOptions = deleteElement(
      ((frontMatter.sections[0] as HeroFrontmatterSection)
        .hero as EditorHeroDropdownSection).dropdown.options,
      indexToDelete
    )
    const newDropdownErrors = deleteElement(errors.dropdownElems, indexToDelete)
    const newDisplayDropdownElems = deleteElement(
      displayDropdownElems,
      indexToDelete
    )

    return updateDropdownSection(
      homepageState,
      newDisplayDropdownElems,
      newDropdownOptions,
      newDropdownErrors
    )
  }
  if (elemType === "highlight") {
    const newHighlightOptions = deleteElement(
      ((frontMatter.sections[0] as HeroFrontmatterSection)
        .hero as EditorHeroHighlightsSection).key_highlights,
      indexToDelete
    )
    const newHighlightErrors = deleteElement(errors.highlights, indexToDelete)

    const newDisplayHighlights = deleteElement(displayHighlights, indexToDelete)

    return updateHighlightsSection(
      homepageState,
      newDisplayHighlights,
      newHighlightOptions,
      newHighlightErrors
    )
  }
  if (elemType === "announcement") {
    const announcementKeyExist = !_.isEmpty(
      frontMatter.sections.find((section) =>
        EditorHomepageFrontmatterSection.isAnnouncements(section)
      )
    )
    if (!announcementKeyExist) {
      // should not reach here, but defensively return the original state
      return homepageState
    }

    const announcementsIndex = frontMatter.sections.findIndex((section) =>
      EditorHomepageFrontmatterSection.isAnnouncements(section)
    )
    const announcementsSection: AnnouncementsFrontmatterSection = frontMatter
      .sections[announcementsIndex] as AnnouncementsFrontmatterSection

    const newAnnouncementOptions = deleteElement(
      announcementsSection.announcements.announcement_items,
      indexToDelete
    )
    const newAnnouncementErrors = deleteElement(
      errors.announcementItems,
      indexToDelete
    )

    const newDisplayAnnouncements = deleteElement(
      displayAnnouncementItems,
      indexToDelete
    )

    return updateAnnouncementSection(
      homepageState,
      newDisplayAnnouncements,
      newAnnouncementOptions,
      newAnnouncementErrors,
      announcementsIndex
    )
  }
  if (elemType.startsWith("textCardItem")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(elemType.split("-")[1], RADIX_PARSE_INT)
    const newTextCards = deleteElement(
      ((frontMatter.sections[parentId] as TextcardFrontmatterSection)
        .textcards as EditortextCardItemsSection).cards,
      indexToDelete
    )
    const newTextcardErrors = deleteElement(
      errors.textcards[parentId],
      indexToDelete
    )
    return updateTextCardsCardSection(
      homepageState,
      parentId,
      newTextCards,
      newTextcardErrors
    )
  }

  if (elemType.startsWith("infocolInfobox")) {
    // We've validated that type can only be such that the second item is a number
    const parentId = parseInt(elemType.split("-")[1], RADIX_PARSE_INT)
    const newInfoboxes = deleteElement(
      ((frontMatter.sections[parentId] as InfocolsFrontmatterSection)
        .infocols as EditorInfocolsSection).infoboxes,
      indexToDelete
    )
    const newInfocolErrors = deleteElement(
      errors.infocols[parentId],
      indexToDelete
    )
    return updateInfocolsInfoboxesSection(
      homepageState,
      parentId,
      newInfoboxes,
      newInfocolErrors
    )
  }
  return homepageState
}
