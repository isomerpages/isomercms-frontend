import { DropResult } from "@hello-pangea/dnd"
import update from "immutability-helper"
import _ from "lodash"

import {
  EditorHeroDropdownSection,
  EditorHeroHighlightsSection,
  EditorHomepageElement,
  EditorHomepageState,
  HeroFrontmatterSection,
  PossibleEditorSections,
} from "types/homepage"

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
  newSectionErrors: unknown[]
): EditorHomepageState => ({
  ...homepageState,
  displaySections: newDisplaySections,
  frontMatter: {
    ...homepageState.frontMatter,
    sections: newFrontMatterSection,
  },
  errors: { ...homepageState.errors, sections: newSectionErrors },
})

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
  } = homepageState

  // If the user dropped the draggable to no known droppable
  if (!destination) return homepageState

  // The draggable elem was returned to its original position
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  )
    return homepageState

  switch (type) {
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
        newSectionErrors
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
  err: E
): EditorHomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
  } = homepageState

  switch (elemType) {
    case "section": {
      const sections = createElement(frontMatter.sections, val)
      const newErrorSections = createElement(errors.sections, err)

      const resetDisplaySections = _.fill(Array(displaySections.length), false)
      const newDisplaySections = createElement(resetDisplaySections, true)

      return updateEditorSection(
        homepageState,
        newDisplaySections,
        sections,
        newErrorSections
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
    default:
      return homepageState
  }
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
  } = homepageState

  switch (elemType) {
    case "section": {
      const sections = deleteElement(frontMatter.sections, indexToDelete)
      const newErrorSections = deleteElement(errors.sections, indexToDelete)
      const newDisplaySections = deleteElement(displaySections, indexToDelete)

      return updateEditorSection(
        homepageState,
        newDisplaySections,
        sections,
        newErrorSections
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
    default:
      return homepageState
  }
}
