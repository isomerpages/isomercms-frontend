export interface LoginParams {
  email: string
}

export interface VerifyOtpParams extends LoginParams {
  otp: string
}
