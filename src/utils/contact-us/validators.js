import { validateContactType, validateLocationType } from '../validators';

function validateOperatingHours(operatingHours) {
  const { days, time, description } = operatingHours
  return {
    days: validateLocationType('days', days),
    time: validateLocationType('time', time),
    description: validateLocationType('description', description)
  }
}

function validateOperatingHoursArr(operatingHours) {
  return operatingHours.map(hours => validateOperatingHours(hours))
}

function validateLocation(location) {
  const { title, address, operating_hours: operatingHours, maps_link: mapUrl } = location

  return {
    title: validateLocationType('title', title),
    address: validateLocationType('address', address),
    operating_hours: validateOperatingHoursArr(operatingHours),
    maps_link: validateLocationType('maps_link', mapUrl)
  }
}

function validateContact(contact) {
  const { title, content } = contact
  return {
    title: validateContactType('title', title),
    content: [
      {phone: validateContactType('phone', content[0].phone)},
      {email: validateContactType('email', content[1].email)},
      {other: validateContactType('other', content[2].other)},
    ]
  }
}

export function validateFrontMatter(frontMatter) {
    const { contacts, locations } = frontMatter;
  
    let contactsErrors = [];
    let locationsErrors = [];
  
    if (contacts !== undefined) {
      contacts.forEach(contact => 
        contactsErrors.push(validateContact(contact))
      )
    }
    if (locations !== undefined) {
      locations.forEach(location => 
        locationsErrors.push(validateLocation(location))
      )
    }
  
    const frontMatterErrors = {
      contactsErrors,
      locationsErrors,
    }
    
    return frontMatterErrors
  }