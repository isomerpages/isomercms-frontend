import {
  SgidAuthUrlResponseDto,
  LoginParams,
  VerifyOtpParams,
} from "types/login"

import { apiService } from "./ApiService"

export const sendLoginOtp = async ({ email }: LoginParams): Promise<void> => {
  const endpoint = `/auth/login`
  return apiService.post(endpoint, { email: email.toLowerCase() })
}

export const verifyLoginOtp = async ({
  email,
  otp,
}: VerifyOtpParams): Promise<void> => {
  const endpoint = `/auth/verify`
  return apiService.post(endpoint, { email: email.toLowerCase(), otp })
}

export const getSgidAuthUrl = async (): Promise<SgidAuthUrlResponseDto> => {
  return apiService
    .get<SgidAuthUrlResponseDto>(`/auth/sgid/auth-url`)
    .then(({ data }) => data)
}
