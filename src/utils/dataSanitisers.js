import _ from 'lodash';

// Constants
const DEFAULT_ADDRESS_FIELD_LENGTH = 3;
const DEFAULT_NUM_OPERATING_FIELDS = 5;

function getContentDataField(content, dataType) {
  const dataObj = _.find(content, (obj) => {
    return dataType in obj && _.isString(obj[dataType])
  })
  return _.cloneDeep(dataObj) || {[dataType]: ''}
}

function sanitiseContent(content) {
  let sanitisedContent = [];
  // sanitisedContent should be an array of 3 objects, [{phone: }, {email: }, {other: }]
  // we find the first object of each of type (phone, email, other) and push a deep clone, else return initialized objects
  sanitisedContent.push( getContentDataField(content, 'phone') );
  sanitisedContent.push( getContentDataField(content, 'email') );
  sanitisedContent.push( getContentDataField(content, 'other') );
  return sanitisedContent;
}

function sanitiseAddress(address) {
  let sanitisedAddress = [];
  // sanitisedAddress should be an array of strings of length DEFAULT_ADDRESS_FIELD_LENGTH
  // we find the first DEFAULT_ADDRESS_FIELD_LENGTH strings and push a deep clone if they exist, else return empty strings
  _.range(DEFAULT_ADDRESS_FIELD_LENGTH).forEach( (index) => {
    sanitisedAddress.push( (address && address[index] ) ? _.cloneDeep(address[index]) : '')
  })
  return sanitisedAddress;
}

function sanitiseOperatingHours(operatingHours) {
  let sanitisedOperatingHours = [];
  // sanitisedOperatingHours should be an array of objects of maximum length DEFAULT_NUM_OPERATING_FIELDS
  // we find the first DEFAULT_NUM_OPERATING_FIELDS objects and push a deep clone if they exist
  _.range(DEFAULT_NUM_OPERATING_FIELDS).forEach( (index) => {
    sanitisedOperatingHours.push( (operatingHours && operatingHours[index]) ? _.cloneDeep(operatingHours[index]) : undefined)
  })
  return sanitisedOperatingHours.filter(elem => elem);
}

function sanitiseContact(contact) { // rearrange 
  const { content } = contact
  
  let sanitisedContact = _.cloneDeep(contact)
  sanitisedContact.content = sanitiseContent(content)
  
  return sanitisedContact
}

function sanitiseLocation(location) {
  const { address, operating_hours: operatingHours } = location

  let sanitisedLocation = _.cloneDeep(location)
  sanitisedLocation.address = sanitiseAddress(address)
  sanitisedLocation.operating_hours = sanitiseOperatingHours(operatingHours)
  
  return sanitisedLocation
}

export function sanitiseFrontMatter(frontMatter) {
  const { contacts, locations } = frontMatter;

  let sanitisedFrontMatter = _.cloneDeep(frontMatter)
  let sanitisedContacts = [];
  let sanitisedLocations = [];

  if (contacts !== undefined) {
    contacts.forEach(contact => 
      sanitisedContacts.push(sanitiseContact(contact))
    )
  }
  if (locations !== undefined) {
    locations.forEach(location => 
      sanitisedLocations.push(sanitiseLocation(location))
    )
  }

  sanitisedFrontMatter.contacts = sanitisedContacts
  sanitisedFrontMatter.locations = sanitisedLocations
  return sanitisedFrontMatter
}