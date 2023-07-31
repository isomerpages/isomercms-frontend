import { DropResult, OnDragEndResponder } from "@hello-pangea/dnd"
import update from "immutability-helper"

import { HomepageDto } from "types/homepage"

const updatePositions = <T,>(
  section: T[],
  source: number,
  destination: number,
  elem: T
): T[] => {
  return update(section, {
    $splice: [
      // start index, delete count, insert item(s)
      [source, 1], // Remove elem from its original position
      [destination, 0, elem], // Splice elem into its new position
    ],
  })
}

interface HeroDropdownSection {
  dropdown: {
    options: []
  }
}

interface HeroHighlightsSection {
  key_highlights: []
}

type HomepageEditorHeroSection = HeroDropdownSection | HeroHighlightsSection

interface HomepageState {
  frontMatter: Omit<HomepageDto["content"]["frontMatter"], "sections"> & {
    sections: {
      hero: HomepageEditorHeroSection
    }[]
  }
  errors: {
    sections: unknown[]
    dropdownElems: unknown[]
    highlights: unknown[]
  }
  displaySections: unknown[]
  displayDropdownElems: unknown[]
  displayHighlights: unknown[]
}

// NOTE: We mutate by addr in some places
// maybe we just do a deep copy?
// and point it to a store next time,
// which will ensure read reference equality
const updateHomepageState = (
  result: DropResult,
  homepageState: HomepageState
): HomepageState => {
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

  // type is just to know which part to edit
  switch (type) {
    case "editor": {
      const draggedElem = frontMatter.sections[source.index]
      //! NOTE: Need to update this so that
      //! the assignment is correct.
      //! THIS HAS TO BE DONE BELOW AS WELL FOR EACH CASE!!!
      const newSections = updatePositions(
        frontMatter.sections,
        source.index,
        destination.index,
        draggedElem
      )
      const draggedError = errors.sections[source.index]
      //! NOTE: This is a mutation!!!
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

      return {
        ...homepageState,
        displaySections: newDisplaySections,
        frontMatter: {
          ...frontMatter,
          sections: newSections,
        },
        errors: { ...errors, sections: newSectionErrors },
      }
    }
    // inner dnd for hero
    // passed in via droppableId
    case "dropdownelem": {
      // TODO: type check to avoid casting
      const draggedElem = (frontMatter.sections[0].hero as HeroDropdownSection)
        .dropdown.options[source.index]
      const newSections = updatePositions(
        (frontMatter.sections[0].hero as HeroDropdownSection).dropdown.options,
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
          sections: newSections,
        },
        errors: { ...errors, dropdownElems: newDropdownErrors },
      }
    }
    case "highlight": {
      // TODO: type check to avoid casting
      const draggedElem = (frontMatter.sections[0]
        .hero as HeroHighlightsSection).key_highlights[source.index]
      const newSections = updatePositions(
        (frontMatter.sections[0].hero as HeroHighlightsSection).key_highlights,
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
      return {
        ...homepageState,
        displayHighlights: newDisplayHighlights,
        frontMatter: {
          ...frontMatter,
          sections: newSections,
        },
        errors: { ...errors, highlights: newHighlightErrors },
      }
    }
    default:
      return homepageState
  }
}

type OnDragEndResponseWrapper = (
  state: HomepageState
) => (result: DropResult) => HomepageState

// TODO: inline this into the call-site
// TODO: keep state in context rather than doing this
export const useDrag: OnDragEndResponseWrapper = (
  homepageState: HomepageState
) => (result) => {
  return updateHomepageState(result, homepageState)
}
