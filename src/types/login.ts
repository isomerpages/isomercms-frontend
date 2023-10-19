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

export interface VerifySgidMultiuserLoginParams {
  email: string
}

export interface PublicOfficerData {
  email: string
  agencyName: string
  departmentName: string
  employmentTitle: string
}
export interface VerifySgidLoginResponseDto {
  userData: PublicOfficerData[]
}
