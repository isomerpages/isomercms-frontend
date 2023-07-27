export interface LoginParams {
  email: string
}

export interface VerifyOtpParams extends LoginParams {
  otp: string
}

export interface SgidAuthUrlResponseDto {
  redirectUrl: string
}

export interface VerifySgidLoginParams {
  code: string
}
