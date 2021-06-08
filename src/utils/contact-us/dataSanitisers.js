import _ from "lodash"

// Constants
const DEFAULT_ADDRESS_FIELD_LENGTH = 3
const DEFAULT_NUM_OPERATING_FIELDS = 5

function isNotNullAndEqual(arrVal, othVal) {
  if (Object.values(arrVal)[0] == null) {
    return true
  }
  return _.isEqual(arrVal, othVal)
}

function getContentDataField(content, dataType) {
  const dataObj = _.find(content, (obj) => dataType in obj && _.isString(obj[dataType]))
  return _.cloneDeep(dataObj) || { [dataType]: "" }
}

function sanitiseContent(content) {
  const sanitisedContent = []
  let deletedContent = []
  // sanitisedContent should be an array of 3 objects, [{phone: }, {email: }, {other: }]
  // we find the first object of each of type (phone, email, other) and push a deep clone, else return initialized objects
  sanitisedContent.push(getContentDataField(content, "phone"))
  sanitisedContent.push(getContentDataField(content, "email"))
  sanitisedContent.push(getContentDataField(content, "other"))
  deletedContent = _.differenceWith(
    content,
    sanitisedContent,
    isNotNullAndEqual
  )
  return { sanitisedContent, deletedContent }
}

function sanitiseAddressArr(address) {
  const sanitisedAddressArr = []
  let deletedAddressArr = []
  // sanitisedAddressArr should be an array of strings of length DEFAULT_ADDRESS_FIELD_LENGTH
  // we find the first DEFAULT_ADDRESS_FIELD_LENGTH strings and push a deep clone if they exist, else return empty strings
  _.range(DEFAULT_ADDRESS_FIELD_LENGTH).forEach((index) => {
    sanitisedAddressArr.push(
      address && address[index] ? _.cloneDeep(address[index]) : ""
    )
  })
  deletedAddressArr =
    address && address.length > 3
      ? _.slice(address, DEFAULT_ADDRESS_FIELD_LENGTH)
      : []
  return { sanitisedAddressArr, deletedAddressArr }
}

function sanitiseOperatingHours(operatingHours) {
  const sanitisedOperatingHours = {}
  sanitisedOperatingHours.days = _.cloneDeep(operatingHours.days) || ""
  sanitisedOperatingHours.time = _.cloneDeep(operatingHours.time) || ""
  sanitisedOperatingHours.description =
    _.cloneDeep(operatingHours.description) || ""
  return sanitisedOperatingHours
}

function sanitiseOperatingHoursArr(operatingHoursArr) {
  let sanitisedOperatingHoursArr = []
  let deletedOperatingHoursArr = []
  // sanitisedOperatingHours should be an array of objects of maximum length DEFAULT_NUM_OPERATING_FIELDS
  // we find the first DEFAULT_NUM_OPERATING_FIELDS objects and push a deep clone if they exist
  _.range(DEFAULT_NUM_OPERATING_FIELDS).forEach((index) => {
    sanitisedOperatingHoursArr.push(
      operatingHoursArr && operatingHoursArr[index]
        ? sanitiseOperatingHours(operatingHoursArr[index])
        : undefined
    )
  })
  sanitisedOperatingHoursArr = sanitisedOperatingHoursArr.filter((elem) => elem)
  deletedOperatingHoursArr =
    operatingHoursArr && operatingHoursArr.length > 3
      ? _.slice(operatingHoursArr, DEFAULT_NUM_OPERATING_FIELDS)
      : []
  return { sanitisedOperatingHoursArr, deletedOperatingHoursArr }
}

function sanitiseContact(contact) {
  // rearrange
  const { title, content } = contact

  const { sanitisedContent, deletedContent } = sanitiseContent(content)
  const sanitisedContact = {}
  sanitisedContact.content = sanitisedContent
  sanitisedContact.title = _.cloneDeep(title) || ""

  const deletedContact = {}
  deletedContact.content = deletedContent
  return { sanitisedContact, deletedContact }
}

function sanitiseLocation(location) {
  const {
    title,
    address,
    operating_hours: operatingHours,
    maps_link: mapUrl,
  } = location

  const { sanitisedAddressArr, deletedAddressArr } = sanitiseAddressArr(address)
  const {
    sanitisedOperatingHoursArr,
    deletedOperatingHoursArr,
  } = sanitiseOperatingHoursArr(operatingHours)

  const sanitisedLocation = {}
  sanitisedLocation.address = sanitisedAddressArr
  sanitisedLocation.operating_hours = sanitisedOperatingHoursArr
  sanitisedLocation.maps_link = _.cloneDeep(mapUrl) || ""
  sanitisedLocation.title = _.cloneDeep(title) || ""

  const deletedLocation = {}
  deletedLocation.address = deletedAddressArr
  deletedLocation.operating_hours = deletedOperatingHoursArr
  return { sanitisedLocation, deletedLocation }
}

export default function sanitiseFrontMatter(frontMatter) {
  const { contacts, locations } = frontMatter

  const sanitisedFrontMatter = _.cloneDeep(frontMatter)
  const deletedFrontMatter = {}
  const sanitisedContacts = []
  const deletedContacts = []
  const sanitisedLocations = []
  const deletedLocations = []

  if (contacts !== undefined) {
    contacts.forEach((contact) => {
      const { sanitisedContact, deletedContact } = sanitiseContact(contact)
      sanitisedContacts.push(sanitisedContact)
      deletedContacts.push(deletedContact)
    })
  }
  if (locations !== undefined) {
    locations.forEach((location) => {
      const { sanitisedLocation, deletedLocation } = sanitiseLocation(location)
      sanitisedLocations.push(sanitisedLocation)
      deletedLocations.push(deletedLocation)
    })
  }

  sanitisedFrontMatter.contacts = sanitisedContacts
  sanitisedFrontMatter.locations = sanitisedLocations
  deletedFrontMatter.contacts = deletedContacts
  deletedFrontMatter.locations = deletedLocations
  return { sanitisedFrontMatter, deletedFrontMatter }
}
