// Supported CSP checks are img-src, frame-src, media-src, object-src script-src-elem
// Supported fallbacks are child-src, script-src, and default-src

import cheerio from "cheerio"
import escapeStringRegexp from "escape-string-regexp"
import _ from "lodash"

import { isLinkInternal } from "utils"

function toRegExp(string) {
  const strippedString = string.replace(/\/$/, "") // removes ending '/' from domains eg 'abc.com/'
  const escapedStrippedString = escapeStringRegexp(strippedString) // add escape characters
  const wildcardEscapedStrippedString = escapedStrippedString.replace(
    "\\*",
    "[a-z0-9-]*"
  ) // convert wildcards

  // Support protocol-relative URLs without supporting http://
  // NOTE: Our CSP policy has all URLs as absolute URLs with https://, this
  // replacement is necessary to allow users to specify protocol-relative URLs
  // Our Isomer sites are served over https, so this is not a problem
  const relativeWildcardEscapedStrippedString = wildcardEscapedStrippedString.replace(
    "https://",
    "^(https:)?//"
  )
  const RegExpString = RegExp(relativeWildcardEscapedStrippedString) // converts to RegExp
  return RegExpString
}

/* Helper functions to check if elemSrc satisfies each CSP source specification: host-source, schema-source and 'self' */
function checkHostsourcePolicy(elemSrc, policy) {
  if (policy.includes("\\*")) return true

  const specialValues = [
    "http:",
    "https:",
    "data:",
    "mediastream:",
    "blob:",
    "filesystem:",
    "'self'",
    "'none'",
    "*",
  ]
  const hostsources = policy.filter((value) => !specialValues.includes(value))

  const hostsourcesSatisfied = hostsources.some((hostsource) =>
    toRegExp(hostsource).test(elemSrc)
  )
  return hostsourcesSatisfied
}

function checkSchemasourcePolicy(elemSrc, policy) {
  const schemes = ["http:", "https:"]
  const dataSchemes = ["data:", "mediastream:", "blob:", "filesystem:"]

  const schemesSatisfied = schemes.some(
    (scheme) => policy.includes(scheme) && _.startsWith(elemSrc, scheme)
  )
  const dataSchemesSatisfied = dataSchemes.some(
    (dataScheme) =>
      policy.includes(dataScheme) && _.startsWith(elemSrc, dataScheme)
  )
  return schemesSatisfied || dataSchemesSatisfied
}

function checkSelfPolicy(elemSrc, policy) {
  return isLinkInternal(elemSrc) && policy.includes("'self'")
}

/* Helper function to check if elemAttr satisfies CSP source specifications */
function elemAttrSatisfiesPolicies(elemAttr, policy) {
  if (policy.includes("'none'")) return false

  const selfSatisfied = checkSelfPolicy(elemAttr, policy)
  const schemasourceSatisfied = checkSchemasourcePolicy(elemAttr, policy)
  const hostsourceSatisfied = checkHostsourcePolicy(elemAttr, policy)
  return selfSatisfied || schemasourceSatisfied || hostsourceSatisfied
}

/* Helper function to get resource policy from csp for given policyType */
function getResourcePolicy(cspPolicy, policyType) {
  const resourcePolicyMapping = {
    "frame-src": ["frame", "iframe"],
    "img-src": ["img"],
    "media-src": ["audio", "video", "track"],
    "object-src": ["object", "embed", "applet"],
    "script-src-elem": ["script"],
  }

  let resourcePolicy
  if (policyType === "frame-src") {
    // from http://csplite.com/csp/test121/, fallback chain: frame-src -> child-src -> default-src
    resourcePolicy =
      cspPolicy[policyType] ||
      cspPolicy["child-src"] ||
      cspPolicy["default-src"]
  } else if (policyType === "script-src-elem") {
    // fallback chain: script-src-elem -> script-src -> default-src
    resourcePolicy =
      cspPolicy[policyType] ||
      cspPolicy["script-src"] ||
      cspPolicy["default-src"]
  } else {
    resourcePolicy = cspPolicy[policyType] || cspPolicy["default-src"]
  }
  const resourcePolicyElems = resourcePolicyMapping[policyType]
  return { resourcePolicy, resourcePolicyElems }
}

/* Helper function to check if resourcePolicyElems for a specific policyType satisfies CSP source specifications */
function checkResourcePolicyElems(
  resourcePolicyElems,
  policy,
  { $, cspViolationArr }
) {
  let cspViolation = false
  resourcePolicyElems.forEach((elemType) => {
    $(elemType).each((i, elem) => {
      const checkAttr = elemType === "object" ? "data" : "src" // exception for object html: <object data='abc.html'></object>
      if (!elemAttrSatisfiesPolicies($(elem).attr(checkAttr), policy)) {
        $(elem).replaceWith(
          `<span style="color:#c91508"><br> Intended &lt${elemType}&gt content violates Content Security Policy and therefore could not be displayed. Isomer does not support display of any forbidden resources. </span>`
        )
        cspViolation = true
      }
    })
  })
  cspViolationArr.push(cspViolation)
  return { $, cspViolationArr }
}

export default function checkCSP(
  cspPolicy,
  chunk,
  policyTypes = [
    "img-src",
    "media-src",
    "frame-src",
    "object-src",
    "script-src-elem",
  ]
) {
  const reducer = ({ $, cspViolationArr }, policyType) => {
    const { resourcePolicy, resourcePolicyElems } = getResourcePolicy(
      cspPolicy,
      policyType
    )
    return checkResourcePolicyElems(resourcePolicyElems, resourcePolicy, {
      $,
      cspViolationArr,
    })
  }

  let $ = cheerio.load(chunk)
  let cspViolationArr = []
  ;({ $, cspViolationArr } = policyTypes.reduce(reducer, {
    $,
    cspViolationArr,
  }))

  return {
    sanitisedHtml: $.html(),
    isCspViolation: _.some(cspViolationArr),
  }
}
