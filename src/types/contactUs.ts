export interface ContactContentItem {
  phone?: string
  email?: string
  other?: string
}

export interface ContactItem {
  content: ContactContentItem[]
  title?: string
}

export interface OperatingHoursItem {
  days?: string
  time?: string
  description?: string
}

export interface LocationItem {
  address?: string
  // eslint-disable-next-line camelcase
  operating_hours?: OperatingHoursItem[]
  // eslint-disable-next-line camelcase
  maps_link?: string
  title?: string
}

export interface ContactUsFrontMatter {
  layout: "homepage"
  title: string
  permalink: string
  feedback?: string
  // eslint-disable-next-line camelcase
  agency_name: string
  locations: LocationItem[]
  contacts: ContactItem[]
}

export interface ContactUsDto {
  content: {
    frontMatter: ContactUsFrontMatter
    pageBody?: string
  }
  sha: string
}
