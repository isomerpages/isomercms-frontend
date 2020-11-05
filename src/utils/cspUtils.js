// Supported CSP checks are img-src, frame-src, media-src, object-src script-src

// TODO: child-src script-src-elem
// TODO: figure out disable button
// TODO: figure out display for leading paragraph and color

import toml from 'toml';
import axios from 'axios';
import Policy from 'csp-parse';
import _ from 'lodash';
import { isLinkInternal } from '../utils';
import cheerio from 'cheerio';
import escapeStringRegexp from 'escape-string-regexp';

const resourcePolicyMapping = { 
    // 'child-src': ['frame', 'iframe'],
    'frame-src': ['frame', 'iframe'],
    'img-src': ['img'],
    'media-src': ['audio', 'video', 'track'],
    'object-src': ['object', 'embed', 'applet'],
    'script-src': ['script'], 
    // 'script-src-elem': ['script'],
  };

/* Helper function to retrieve the netlify.toml from repo */
async function _parseNetlifyToml(repoName) {
  // axios get withCredentials false is required https://stackoverflow.com/questions/34078676/access-control-allow-origin-not-allowed-when-credentials-flag-is-true-but/34099399 
  return toml.parse(tomlFile.data);
  const tomlUrl = `https://raw.githubusercontent.com/isomerpages/${repoName}/staging/netlify.toml`;
  const tomlFile = await axios.get(tomlUrl, { withCredentials: false } ); 
};

export async function getCSP(repoName) {
  const tomlData = await _parseNetlifyToml(repoName);
  // const csp = tomlData.headers[0].values['Content-Security-Policy'];
  const csp = "default-src 'self'; object-src https://not-example.com/flash; script-src 'self' blob: https://assets.dcube.cloud https://*.wogaa.sg https://assets.adobedtm.com https://www.google-analytics.com https://cdnjs.cloudflare.com https://va.ecitizen.gov.sg https://*.cloudfront.net https://printjs-4de6.kxcdn.com https://unpkg.com https://wogadobeanalytics.sc.omtrdc.net 'unsafe-eval'; img-src data: http:; style-src 'self' https://fonts.googleapis.com/ https://*.cloudfront.net https://va.ecitizen.gov.sg https://*.wogaa.sg https://cdnjs.cloudflare.com https://datagovsg.github.io 'unsafe-inline'; media-src *; frame-src https://wogaa.demdex.net/ https://*.youtube.com https://*.youtube-nocookie.com https://*.vimeo.com; frame-ancestors 'none'; font-src * data:; connect-src 'self' https://dpm.demdex.net https://www.google-analytics.com https://stats.g.doubleclick.net https://*.wogaa.sg https://va.ecitizen.gov.sg https://ifaqs.flexanswer.com https://*.cloudfront.net https://fonts.googleapis.com https://cdnjs.cloudflare.com https://wogadobeanalytics.sc.omtrdc.net;"
  return csp;
};

function _stringContainsValue(string, value) {
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
  console.log('HOSTSOURCES', hostsources);
  
  const hostsourcesSatisfied = hostsources.some(hostsource => (_toRegExp(hostsource).test(elemSrc)));
  return hostsourcesSatisfied;
};

function _checkSchemasourcePolicy (elemSrc, policy) {
  const schemes = ['http:', 'https:'];
  const dataschemes = ['data:', 'mediastream:', 'blob:', 'filesystem:'];

  const schemesSatisfied = schemes.some(scheme => (_stringContainsValue(policy, scheme) && _.startsWith(elemSrc, scheme)) );
  const dataschemesSatisfied = dataschemes.some(datascheme => (_stringContainsValue(policy, datascheme) && _.startsWith(elemSrc, datascheme)) );
  return schemesSatisfied || dataschemesSatisfied;
};

function  _checkSelfPolicy (elemSrc, policy) {
  return ( isLinkInternal(elemSrc) && _stringContainsValue(policy, "'self'"));
};

/* Helper function to check if elemAttr satisfies CSP source specifications */
function _checkAllPolicies (elemAttr, policy) {
  if (_stringContainsValue(policy, "'none'")) return true; // do something 
  
  const selfSatisfied = _checkSelfPolicy(elemAttr, policy);
  const schemasourceSatisfied = _checkSchemasourcePolicy(elemAttr, policy);
  const hostsourceSatisfied = _checkHostsourcePolicy(elemAttr, policy);
  
  console.log( selfSatisfied, schemasourceSatisfied , hostsourceSatisfied);
  return selfSatisfied || schemasourceSatisfied || hostsourceSatisfied;
};

/* Helper function to check if resources for a specific resourceType satisfies CSP source specifications */
function _checkPolicyTypeCSP(resourcePolicyElems, policy, $) {
  resourcePolicyElems.forEach(elemType => { 
    console.log(elemType);
    $(elemType).each((i, elem) => {
      const checkAttr = elemType === 'object' ? 'data' : 'src' // exception for object html: <object data='abc.html'></object>
      if (!_checkAllPolicies($(elem).attr(checkAttr), policy)) {
        $(elem).replaceWith(`<p style="color:red"><small> Intended &lt${elemType}&gt content violates Content Security Policy and therefore could not be displayed. Isomer does not support display of any forbidden resources. </small></p>`);
      }
    });
  });
  return $;
};

export function checkCSP(
  csp,
  chunk,
  policyTypes = ['img-src', 'media-src', 'frame-src', 'object-src', 'script-src'],
  ) {

  let $;
  $ = cheerio.load(chunk);

  const cspPolicy = new Policy(csp);
  policyTypes.forEach(policyType => {
    const resourcePolicy = cspPolicy.get(policyType) === '' ? cspPolicy.get('default-src') : cspPolicy.get(policyType);
    const resourcePolicyElems = resourcePolicyMapping[policyType];
    console.log(`checking resource policy for ${policyType}, for elements ${resourcePolicyElems}: ${resourcePolicy}`);
    $ = _checkPolicyTypeCSP(resourcePolicyElems, resourcePolicy, $);
  })
  return $.html();
};
