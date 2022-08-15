import { LoginParams, VerifyOtpParams } from "types/login"

import { apiService } from "./ApiService"

export const sendLoginOtp = async ({ email }: LoginParams): Promise<void> => {
  const endpoint = `/auth/login`
  return apiService.post(endpoint, { email })
}

export const verifyLoginOtp = async ({
  email,
  otp,
}: VerifyOtpParams): Promise<void> => {
  const endpoint = `/auth/verify`
  const res = await apiService.post(endpoint, { email, otp })
  return res.data
}
