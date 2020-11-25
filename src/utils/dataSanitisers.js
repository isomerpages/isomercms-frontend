import _ from 'lodash';

// Constants
const DEFAULT_ADDRESS_FIELD_LENGTH = 3;
const DEFAULT_NUM_OPERATING_FIELDS = 5;

function sanitiseContent(content) {
  let sanitisedContent = [];
  // sanitisedContent should be an array of 3 objects, [{phone: }, {email: }, {other: }]
  // we find the first object of each of type (phone, email, other) and push it 
  sanitisedContent.push( _.find(content, obj => 'phone' in obj)  || {phone: ''});
  sanitisedContent.push( _.find(content, obj => 'email' in obj)  || {email: ''});
  sanitisedContent.push( _.find(content, obj => 'other' in obj)  || {other: ''});
  return sanitisedContent;
}

function sanitiseAddress(address) {
  let sanitisedAddress = [];
  // sanitisedAddress should be an array of strings of length DEFAULT_ADDRESS_FIELD_LENGTH
  _.range(DEFAULT_ADDRESS_FIELD_LENGTH).forEach( (index) => {
    sanitisedAddress.push( (address && address[index] ) ? address[index] : '')
  })
  return sanitisedAddress;
}

function sanitiseOperatingHours(operatingHours) {
  let sanitisedOperatingHours = [];
  // sanitisedOperatingHours should be an array of objects of maximum length DEFAULT_NUM_OPERATING_FIELDS
  _.range(DEFAULT_NUM_OPERATING_FIELDS).forEach( (index) => {
    if (operatingHours && operatingHours[index]) {
      sanitisedOperatingHours.push(operatingHours[index])
    }
  })
  return sanitisedOperatingHours;
}

function sanitiseContact(contact) { // rearrange 
  const { content } = contact
  const sanitisedContent = sanitiseContent(content)
  return {
    ...contact,
    content: sanitisedContent,
  }
}

function sanitiseLocation(location) {
  const { address, operating_hours: operatingHours } = location
  const sanitisedAddress = sanitiseAddress(address)
  const sanitisedOperatingHours = sanitiseOperatingHours(operatingHours)
  
  return {
    ...location,
    address: sanitisedAddress,
    operating_hours: sanitisedOperatingHours,
  }
}

export function sanitiseFrontMatter(frontMatter) {
  const { contacts, locations } = frontMatter;
  let sanitisedContacts = [];
  let sanitisedLocations = [];

  if (!_.isUndefined(contacts)) {
    contacts.forEach(contact => 
      sanitisedContacts.push(sanitiseContact(contact))
    )
  }
  if (!_.isUndefined(locations)) {
    locations.forEach(location => 
      sanitisedLocations.push(sanitiseLocation(location))
    )
  }
  return { 
    ...frontMatter,
    contacts: sanitisedContacts, 
    locations: sanitisedLocations,
  }
}