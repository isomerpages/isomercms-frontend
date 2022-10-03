export interface ContactParams {
  mobile: string
}

export interface VerifyOtpParams extends ContactParams {
  otp: string
}
