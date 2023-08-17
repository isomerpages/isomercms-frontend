export const recommendWwwValue = (domain: string): boolean => {
  if (!domain) return true

  const commonDomains = ["gov.sg", "com.sg", ".org.sg", ".net.sg"]

  if (commonDomains.some((commonDomain) => domain.endsWith(commonDomain))) {
    if (domain.split(".").length === 3) return true
    return false
  }

  if (domain.endsWith("moe.edu.sg")) {
    if (domain.split(".").length === 4) return true
    return false
  }

  if (domain.endsWith(".sg") || domain.endsWith(".com")) {
    if (domain.split(".").length === 2) return true
    return false
  }
  // Default to true
  return true
}
