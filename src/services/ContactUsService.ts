import { ContactUsDto } from "types/contactUs"

import { apiService } from "./ApiService"

const getContactUsEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/contactUs`
}

export const getContactUs = async (siteName: string): Promise<ContactUsDto> => {
  const endpoint = getContactUsEndpoint(siteName)
  return apiService.get(endpoint).then((res) => res.data)
}

export const updateContactUs = async (
  siteName: string,
  contactUsData: ContactUsDto
): Promise<void> => {
  const endpoint = getContactUsEndpoint(siteName)
  return apiService.post(endpoint, contactUsData).then((res) => res.data)
}
