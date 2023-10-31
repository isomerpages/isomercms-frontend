import _ from "lodash"

import { NUM_DEFAULT_HOMEPAGE_BLOCKS } from "constants/featureFlags"

export const getErrorValues = (
  obj: Record<string, string>
): Record<string, string> => {
  return _.mapValues(obj, () => "")
}

export const getShouldShowNewLayouts = (blocks: unknown[]) => {
  return blocks.length > NUM_DEFAULT_HOMEPAGE_BLOCKS
}
