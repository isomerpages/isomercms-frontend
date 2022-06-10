import axios from "axios"

// api client
const API_BASE_URL_V2 = `${process.env.REACT_APP_BACKEND_URL_V2}`
export const apiService = axios.create({
  baseURL: API_BASE_URL_V2,
  // 100 secs
  timeout: 100000,
})
