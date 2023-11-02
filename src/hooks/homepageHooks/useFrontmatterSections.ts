import { useFeatureValue } from "@growthbook/growthbook-react"
import _ from "lodash"
import { useCallback } from "react"

import { FEATURE_FLAGS } from "constants/featureFlags"
import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLocalStorage } from "hooks/useLocalStorage"

import { EditorHomepageFrontmatterSection } from "types/homepage"

const getIsFeatureEnabled = (
  section: EditorHomepageFrontmatterSection,
  enabledBlocks: string[]
) => {
  const blockKeys = _.keys(section)
  // NOTE: If the block keys is not in the list of
  // allowed blocks, then it has been rolled back.
  return _.intersection(blockKeys, enabledBlocks).length > 0
}

type UseFrontmatterSectionsReturn = (
  sections: EditorHomepageFrontmatterSection[]
) => EditorHomepageFrontmatterSection[]

export const useFrontmatterSections = (): UseFrontmatterSectionsReturn => {
  const [storedFrontmatter, setStoredFrontmatter] = useLocalStorage<
    EditorHomepageFrontmatterSection[]
  >(LOCAL_STORAGE_KEYS.HomepageFrontmatterSections, [])

  const { blocks } = useFeatureValue(FEATURE_FLAGS.HOMEPAGE_ENABLED_BLOCKS, {
    blocks: [],
  })

  return useCallback(
    (baseFrontmatterSections: EditorHomepageFrontmatterSection[]) => {
      const actualBlocks = baseFrontmatterSections.filter((section) =>
        getIsFeatureEnabled(section, blocks)
      )

      // NOTE: First, check if there are blocks that are on our sections
      // that are NOT enabled.
      // These blocks have been rolled back and should be
      // saved to local storage to avoid data loss.
      const rolledBackBlocks = _.cloneDeep(
        baseFrontmatterSections.filter(
          (section) => !getIsFeatureEnabled(section, blocks)
        )
      )

      const enabledStoredFrontmatterBlocks = storedFrontmatter.filter(
        (section) => {
          return getIsFeatureEnabled(section, blocks)
        }
      )

      const remainingStoredFrontmatterBlocks = storedFrontmatter.filter(
        (section) => {
          return !getIsFeatureEnabled(section, blocks)
        }
      )

      setStoredFrontmatter(
        _.uniqBy(
          [...rolledBackBlocks, ...remainingStoredFrontmatterBlocks],
          (obj) => JSON.stringify(obj)
        )
      )

      return [...actualBlocks, ...enabledStoredFrontmatterBlocks]
    },
    // NOTE: We are disabling the eslint rule here because
    // the function referenced in the dependency array
    // would change on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blocks]
  )
}
