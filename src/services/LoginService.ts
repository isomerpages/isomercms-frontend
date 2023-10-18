import {
  SgidAuthUrlResponseDto,
  LoginParams,
  VerifyOtpParams,
  VerifySgidLoginParams,
  VerifySgidLoginResponseDto,
  VerifySgidMultiuserLoginParams,
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
    .get<SgidAuthUrlResponseDto>(`/auth/sgid/auth-url`, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
    .then(({ data }) => {
      return data
    })
}

export const verifySgidLogin = async ({
  code,
}: VerifySgidLoginParams): Promise<VerifySgidLoginResponseDto> => {
  return apiService
    .get<VerifySgidLoginResponseDto>(`/auth/sgid/verify-login?code=${code}`)
    .then(({ data }) => {
      return data
    })
}

export const verifySgidMultiuserLogin = async ({
  email,
}: VerifySgidMultiuserLoginParams): Promise<void> => {
  const endpoint = `/auth/sgid/verify-multiuser-login`
  return apiService.post(endpoint, { email })
}
