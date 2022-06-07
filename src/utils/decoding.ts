export const getDecodedParams = (
  params: Record<string, string>
): Record<string, string> => {
  const initialAcc: Record<string, string> = {}
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (!acc[key]) {
      acc[key] = decodeURIComponent(value)
    }
    return acc
  }, initialAcc)
}
