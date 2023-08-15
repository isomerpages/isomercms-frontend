import _ from "lodash"

export const getErrorValues = (
  obj: Record<string, string>
): Record<string, string> => {
  return _.mapValues(obj, () => "")
}
