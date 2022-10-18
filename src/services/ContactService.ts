import { ContactParams, VerifyOtpParams } from "types/contact"

import { apiService } from "./ApiService"

export const sendContactOtp = async ({
  mobile,
}: ContactParams): Promise<void> => {
  const endpoint = `/user/mobile/otp`
  return apiService.post(endpoint, { mobile })
}

export const verifyContactOtp = async ({
  mobile,
  otp,
}: VerifyOtpParams): Promise<void> => {
  const endpoint = `/user/mobile/verifyOtp`
  return apiService.post(endpoint, { mobile, otp })
}
