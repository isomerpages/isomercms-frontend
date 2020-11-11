// Supported CSP checks are img-src, frame-src, media-src, object-src script-src-elem 
// Supported fallbacks are child-src, script-src, and default-src

import toml from 'toml';
import axios from 'axios';
import Policy from 'csp-parse';
import _ from 'lodash';
import { isLinkInternal } from '../utils';
import cheerio from 'cheerio';
import escapeStringRegexp from 'escape-string-regexp';

/* Helper function to retrieve the netlify.toml from repo */
async function _parseNetlifyToml(repoName) {
  // axios get withCredentials false is required https://stackoverflow.com/questions/34078676/access-control-allow-origin-not-allowed-when-credentials-flag-is-true-but/34099399 
  const tomlUrl = `https://raw.githubusercontent.com/isomerpages/${repoName}/staging/netlify.toml`;
  const tomlFile = await axios.get(tomlUrl, { withCredentials: false } ); 
  return toml.parse(tomlFile.data);
};

export async function getCSP(repoName) {
  const tomlData = await _parseNetlifyToml(repoName);
  const csp = tomlData.headers[0].values['Content-Security-Policy'];
  const cspPolicy = new Policy(csp);
  return cspPolicy;
};

function _stringContainsValue(string, value) {
  // regex checks specifically if value is preceded by whitespace or is at the start/ end of the string
  const VALUE_REGEX = `(\\s|^)${value}(\\s|$)`;
  const ValueRegexTest = new RegExp(VALUE_REGEX);
  return ValueRegexTest.test(string);
};

function _toRegExp(string) {
  const strippedString = string.replace(/\/$/, '') // removes ending '/' from domains eg 'abc.com/'
  const escapedStrippedString = escapeStringRegexp(strippedString) // add escape characters 
  const wildcardEscapedStrippedString = escapedStrippedString.replace('\\*', '[a-z0-9-]*') // convert wildcards
  const RegExpString = RegExp(wildcardEscapedStrippedString) // converts to RegExp
  return RegExpString;
};

/* Helper functions to check if elemSrc satisfies each CSP source specification: host-source, schema-source and 'self' */
function _checkHostsourcePolicy (elemSrc, policy) {
  if (_stringContainsValue(policy, '\\*')) return true;

  const specialValues = ['http:', 'https:', 'data:', 'mediastream:', 'blob:', 'filesystem:', "'self'", "'none'", '*'];
  const hostsources = policy.split(' ').filter(value => (!specialValues.includes(value)));
  
  const hostsourcesSatisfied = hostsources.some(hostsource => (_toRegExp(hostsource).test(elemSrc)));
  return hostsourcesSatisfied;
};

function _checkSchemasourcePolicy (elemSrc, policy) {
  const schemes = ['http:', 'https:'];
  const dataSchemes = ['data:', 'mediastream:', 'blob:', 'filesystem:'];

  const schemesSatisfied = schemes.some(scheme => (_stringContainsValue(policy, scheme) && _.startsWith(elemSrc, scheme)) );
  const dataSchemesSatisfied = dataSchemes.some(dataScheme => (_stringContainsValue(policy, dataScheme) && _.startsWith(elemSrc, dataScheme)) );
  return schemesSatisfied || dataSchemesSatisfied;
};

function  _checkSelfPolicy (elemSrc, policy) {
  return ( isLinkInternal(elemSrc) && _stringContainsValue(policy, "'self'"));
};

/* Helper function to check if elemAttr satisfies CSP source specifications */
function _elemAttrSatisfiesPolicies (elemAttr, policy) {
  if (_stringContainsValue(policy, "'none'")) return false; 
  
  const selfSatisfied = _checkSelfPolicy(elemAttr, policy);
  const schemasourceSatisfied = _checkSchemasourcePolicy(elemAttr, policy);
  const hostsourceSatisfied = _checkHostsourcePolicy(elemAttr, policy);
  return selfSatisfied || schemasourceSatisfied || hostsourceSatisfied;
};

/* Helper function to get resource policy from csp for given policyType*/
function _getResourcePolicy(cspPolicy, policyType) {
  const resourcePolicyMapping = { 
    'frame-src': ['frame', 'iframe'],
    'img-src': ['img'],
    'media-src': ['audio', 'video', 'track'],
    'object-src': ['object', 'embed', 'applet'],
    'script-src-elem': ['script'],
  };

  let resourcePolicy
  if (policyType === 'frame-src') { // from http://csplite.com/csp/test121/, fallback chain: frame-src -> child-src -> default-src
    resourcePolicy = cspPolicy.get(policyType) || cspPolicy.get('child-src') || cspPolicy.get('default-src');
  } else if (policyType === 'script-src-elem') { // fallback chain: script-src-elem -> script-src -> default-src
    resourcePolicy = cspPolicy.get(policyType) || cspPolicy.get('script-src') || cspPolicy.get('default-src');
  } else {
    resourcePolicy = cspPolicy.get(policyType) || cspPolicy.get('default-src');
  }
  const resourcePolicyElems = resourcePolicyMapping[policyType];
  return { resourcePolicy, resourcePolicyElems } 
}

/* Helper function to check if resourcePolicyElems for a specific policyType satisfies CSP source specifications */
function _checkResourcePolicyElems(resourcePolicyElems, policy, { $ , cspViolationArr }) {
  let cspViolation = false;
  resourcePolicyElems.forEach(elemType => { 
    $(elemType).each((i, elem) => {
      const checkAttr = elemType === 'object' ? 'data' : 'src' // exception for object html: <object data='abc.html'></object>
      if (!_elemAttrSatisfiesPolicies($(elem).attr(checkAttr), policy)) {
        $(elem).replaceWith(`<span style="color:#c91508"><br> Intended &lt${elemType}&gt content violates Content Security Policy and therefore could not be displayed. Isomer does not support display of any forbidden resources. </span>`);
        cspViolation = true;
      }
    });
  });
  cspViolationArr.push(cspViolation)
  return { $, cspViolationArr };
};

export function checkCSP(
  cspPolicy,
  chunk,
  policyTypes = ['img-src', 'media-src', 'frame-src', 'object-src', 'script-src-elem'],
  ) {

  const reducer = ({ $, cspViolationArr } , policyType) => {
    const { resourcePolicy, resourcePolicyElems } = _getResourcePolicy(cspPolicy, policyType);
    return _checkResourcePolicyElems(resourcePolicyElems, resourcePolicy, { $, cspViolationArr } );
  }

  let $ = cheerio.load(chunk);
  let cspViolationArr = [];
  ({ $, cspViolationArr } = policyTypes.reduce( reducer, { $, cspViolationArr } ));

  return {
    sanitisedHtml: $.html(),
    isCspViolation: _.some(cspViolationArr),
  };
};
