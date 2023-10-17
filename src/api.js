import axios from "axios"

<<<<<<< HEAD
import { getNavFolderDropdownFromFolderOrder } from "./utils/generate"
=======
import { generateImageorFilePath } from "./utils/generate"
>>>>>>> 62b6ef2f (chore(api): remove unused API functions)

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL_V2 = process.env.REACT_APP_BACKEND_URL_V2

// Login
const getEmailOtp = (email) => {
  const endpoint = `${BACKEND_URL_V2}/user/email/otp`
  return axios.post(endpoint, { email: email.toLowerCase() })
}

const verifyEmailOtp = async (email, otp) => {
  const endpoint = `${BACKEND_URL_V2}/user/email/verifyOtp`
  const res = await axios.post(endpoint, { email: email.toLowerCase(), otp })
  return res.data
}

const getMobileNumberOtp = (mobile) => {
  const endpoint = `${BACKEND_URL_V2}/user/mobile/otp`
  return axios.post(endpoint, { mobile })
}

const verifyMobileNumberOtp = async (mobile, otp) => {
  const endpoint = `${BACKEND_URL_V2}/user/mobile/verifyOtp`
  const res = await axios.post(endpoint, { mobile, otp })
  return res.data
}

export {
  getEmailOtp,
  verifyEmailOtp,
  getMobileNumberOtp,
  verifyMobileNumberOtp,
}
