import { DropResult } from "@hello-pangea/dnd"
import update from "immutability-helper"
import _ from "lodash"

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
      //! Thsis needs to be updated
      const newDropdownOptions = updatePositions(
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
      const draggedElem = (frontMatter.sections[0]
        .hero as HeroHighlightsSection).key_highlights[source.index]
      const newHighlightOptions = updatePositions(
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
          sections: _.set(
            frontMatter.sections,
            ["0", "hero", "key_highlights"],
            newHighlightOptions
          ),
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

type ElementOf<T> = T extends Array<infer U> ? U : never

type HomepageElement = "section" | "dropdownelem" | "highlight"
type PossibleSections = ElementOf<HomepageState["frontMatter"]["sections"]>

// NOTE: 2 things here - deciding what to create
// and the placement logic.
// we need to separate them
export const onCreate = <E,>(
  homepageState: HomepageState,
  elemType: HomepageElement,
  val: PossibleSections,
  err: E
): HomepageState => {
  const {
    errors,
    frontMatter,
    displaySections,
    displayDropdownElems,
    displayHighlights,
  } = homepageState

  switch (elemType) {
    case "section": {
      // based on the element type,
      // dynamically pass in the correct object to create
      const sections = createElement(frontMatter.sections, val)
      const newErrorSections = createElement(errors.sections, err)

      const resetDisplaySections = _.fill(Array(displaySections.length), false)
      const newDisplaySections = createElement(resetDisplaySections, true)

      return {
        ...homepageState,
        frontMatter: {
          ...frontMatter,
          sections,
        },
        errors: {
          ...errors,
          sections: newErrorSections,
        },
        displaySections: newDisplaySections,
      }
    }
    case "dropdownelem": {
      const newDropdownOptions = createElement(
        (frontMatter.sections[0].hero as HeroDropdownSection).dropdown.options,
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
      // If key highlights section exists
      if (
        !_.isEmpty(
          (frontMatter.sections[0].hero as HeroHighlightsSection).key_highlights
        )
      ) {
        const newHighlightOptions = createElement(
          (frontMatter.sections[0].hero as HeroHighlightsSection)
            .key_highlights,
          val
        )

        const newHighlightErrors = createElement(errors.highlights, err)

        const resetDisplayHighlights = _.fill(
          Array(displayHighlights.length),
          false
        )
        const newDisplayHighlights = createElement(resetDisplayHighlights, true)

        return {
          ...homepageState,
          displayHighlights: newDisplayHighlights,
          frontMatter: {
            ...frontMatter,
            sections: _.set(
              frontMatter.sections,
              ["0", "hero", "key_highlights"],
              newHighlightOptions
            ),
          },
          errors: { ...errors, highlights: newHighlightErrors },
        }
      }
      return {
        ...homepageState,
        displayHighlights: [true],
        frontMatter: {
          ...frontMatter,
          sections: _.set(
            frontMatter.sections,
            ["0", "hero", "key_highlights"],
            [val]
          ),
        },
        errors: { ...errors, highlights: [err] },
      }
    }
    default:
      return homepageState
  }
}
