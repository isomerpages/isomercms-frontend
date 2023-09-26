import { DropResult } from "@hello-pangea/dnd"
import update from "immutability-helper"
import _ from "lodash"

import { ANNOUNCEMENT_BLOCK } from "layouts/EditHomepage/constants"

import {
  EditorHeroDropdownSection,
  EditorHeroHighlightsSection,
  EditorHomepageElement,
  EditorHomepageState,
  EditorTextcardCardsSection,
  EditorTextcardSection,
  HeroFrontmatterSection,
  PossibleEditorSections,
  EditorHomepageFrontmatterSection,
  AnnouncementsFrontmatterSection,
  AnnouncementOption,
  TextcardFrontmatterSection,
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

const createElementFromTop = <T,>(section: T[], elem: T): T[] => {
  return update(section, {
    $unshift: [elem],
  })
}

const deleteElement = <T,>(section: T[], indexToDelete: number): T[] => {
  return update(section, {
    $splice: [[indexToDelete, 1]],
  })
}

const updateElement = <T,>(
  section: T[],
  elem: T,
  indexToUpdate: number
): T[] => {
  return update(section, {
    [indexToUpdate]: {
      $set: elem,
    },
  })
}

const updateEditorSection = (
  homepageState: EditorHomepageState,
  newDisplaySections: unknown[],
  newFrontMatterSection: EditorHomepageState["frontMatter"]["sections"],
  newSectionErrors: unknown[],
  newTextcardErrors: unknown[][]
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
): EditorHomepageState => ({
  ...homepageState,
  frontMatter: {
    ...homepageState.frontMatter,
    sections: _.set(
      // NOTE: Deep clone here to avoid mutation
      _.cloneDeep(homepageState.frontMatter.sections),
      [sectionIndex, "textcards", "cards"],
      newTextCards
    ),
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
})

type OnDragEndResponseWrapper = (
  state: EditorHomepageState
) => (result: DropResult) => EditorHomepageState

// TODO: keep state in context rather than doing this
export const useDrag: OnDragEndResponseWrapper = (
  homepageState: EditorHomepageState
) => (result) => {
  return updateHomepageState(result, homepageState)
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

  const typeArray = type.split("-")
  switch (typeArray[0]) {
    case "editor": {
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
        newCardErrors
      )
    }
    // inner dnd for hero
    // passed in via droppableId
    case "dropdownelem": {
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
    case "highlight": {
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
    case "announcement": {
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
    case "textcardcard": {
      const parentId = parseInt(typeArray[1], RADIX_PARSE_INT)
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
    default:
      return homepageState
  }
}

// NOTE: Handles only placement,
// let the caller decide what to create
export const onCreate = <E,>(
  homepageState: EditorHomepageState,
  elemType: EditorHomepageElement,
  val: PossibleEditorSections,
  err: E,
  parentId = 0
): EditorHomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
    displayAnnouncementItems,
  } = homepageState

  switch (elemType) {
    case "section": {
      const sections = createElement(frontMatter.sections, val)
      const newErrorSections = createElement(errors.sections, err)

      const resetDisplaySections = _.fill(Array(displaySections.length), false)
      const newDisplaySections = createElement(resetDisplaySections, true)

      const newTextcardErrors = createElement(errors.textcards, [])

      return updateEditorSection(
        homepageState,
        newDisplaySections,
        sections as EditorHomepageState["frontMatter"]["sections"],
        newErrorSections,
        newTextcardErrors
      )
    }
    case "dropdownelem": {
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
    case "highlight": {
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
    case "announcement": {
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

      const announcements = createElementFromTop(
        announcementBlockSection.announcements.announcement_items,
        val as AnnouncementOption
      )

      const resetDisplaySections = _.fill(
        Array(displayAnnouncementItems.length),
        false
      )
      const newDisplayAnnouncementItems = createElementFromTop(
        resetDisplaySections,
        true
      )

      const newAnnouncementErrors = createElementFromTop(
        errors.announcementItems,
        err
      )

      return updateAnnouncementSection(
        homepageState,
        newDisplayAnnouncementItems,
        announcements,
        newAnnouncementErrors,
        announcementsIndex
      )
    }
    case "textcardcard": {
      if (
        !_.isEmpty(
          ((frontMatter.sections[parentId] as TextcardFrontmatterSection)
            .textcards as EditorTextcardCardsSection).cards
        )
      ) {
        const newTextCards = createElement(
          ((frontMatter.sections[parentId] as TextcardFrontmatterSection)
            .textcards as EditorTextcardCardsSection).cards,
          val
        )
        const newTextcardErrors = createElement(errors.textcards[parentId], err)
        return updateTextCardsCardSection(
          homepageState,
          parentId,
          newTextCards,
          newTextcardErrors
        )
      }
      return updateTextCardsCardSection(homepageState, parentId, [val], [err])
    }
    default:
      return homepageState
  }
}

export const onDelete = (
  homepageState: EditorHomepageState,
  elemType: EditorHomepageElement,
  indexToDelete: number,
  subindexToDelete = 0
): EditorHomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
    displayAnnouncementItems,
  } = homepageState

  switch (elemType) {
    case "section": {
      const sections = deleteElement(frontMatter.sections, indexToDelete)
      const newErrorSections = deleteElement(errors.sections, indexToDelete)
      const newDisplaySections = deleteElement(displaySections, indexToDelete)
      const newTextcardErrors = deleteElement(errors.textcards, indexToDelete)

      return updateEditorSection(
        homepageState,
        newDisplaySections,
        sections,
        newErrorSections,
        newTextcardErrors
      )
    }

    case "dropdownelem": {
      const newDropdownOptions = deleteElement(
        ((frontMatter.sections[0] as HeroFrontmatterSection)
          .hero as EditorHeroDropdownSection).dropdown.options,
        indexToDelete
      )
      const newDropdownErrors = deleteElement(
        errors.dropdownElems,
        indexToDelete
      )
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
    case "highlight": {
      const newHighlightOptions = deleteElement(
        ((frontMatter.sections[0] as HeroFrontmatterSection)
          .hero as EditorHeroHighlightsSection).key_highlights,
        indexToDelete
      )
      const newHighlightErrors = deleteElement(errors.highlights, indexToDelete)

      const newDisplayHighlights = deleteElement(
        displayHighlights,
        indexToDelete
      )

      return updateHighlightsSection(
        homepageState,
        newDisplayHighlights,
        newHighlightOptions,
        newHighlightErrors
      )
    }
    case "announcement": {
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
    case "textcardcard": {
      const newTextCards = deleteElement(
        ((frontMatter.sections[indexToDelete] as TextcardFrontmatterSection)
          .textcards as EditorTextcardCardsSection).cards,
        subindexToDelete
      )
      const newTextcardErrors = deleteElement(
        errors.textcards[indexToDelete],
        subindexToDelete
      )
      return updateTextCardsCardSection(
        homepageState,
        indexToDelete,
        newTextCards,
        newTextcardErrors
      )
    }
    default:
      return homepageState
  }
}
