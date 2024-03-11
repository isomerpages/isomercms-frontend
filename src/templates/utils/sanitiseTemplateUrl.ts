import { sanitizeUrl } from "@braintree/sanitize-url"

export function sanitiseTemplateUrl(userUrl: string): string {
  const allowedProtocols = ["mailto:", "https:", "tel:"]
  try {
    const url = new URL(userUrl)
    if (allowedProtocols.includes(url.protocol)) {
      return sanitizeUrl(url.href)
    }
  } catch (e) {
    return "about:blank"
  }
  return "about:blank"
}
