import axios from "axios"

import {
  getNavFolderDropdownFromFolderOrder,
  generateImageorFilePath,
} from "./utils/generate"

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL
const BACKEND_URL_V2 = process.env.REACT_APP_BACKEND_URL_V2

const getDirectoryFile = async (siteName, folderName) => {
  if (!folderName) return undefined
  const resp = await axios.get(
    `${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`
  )
  return resp.data
}

const setDirectoryFile = async (siteName, folderName, payload) => {
  return axios.post(
    `${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`,
    payload
  )
}

const getLastUpdated = async (siteName) => {
  if (!siteName) return undefined
  const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/lastUpdated`)
  const { lastUpdated } = resp.data
  return { lastUpdated }
}

const getAllCategoriesApiEndpoint = ({ siteName, isResource }) => {
  if (isResource) {
    return `${BACKEND_URL}/sites/${siteName}/resources`
  }
  return `${BACKEND_URL}/sites/${siteName}/collections`
}

const getAllCategories = async ({ siteName, isResource }) => {
  const apiEndpoint = getAllCategoriesApiEndpoint({ siteName, isResource })
  const resp = await axios.get(apiEndpoint)
  return resp.data
}

// EditNavBar
const getEditNavBarData = async (siteName) => {
  let foldersContent

  const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/navigation`)
  const { content, sha } = resp.data
  const navContent = content
  const navSha = sha
  const collectionContent = await getAllCategories({
    siteName,
    isResource: false,
  })
  const resourceContent = await getAllCategories({ siteName, isResource: true })
  const foldersResp = await axios.get(
    `${BACKEND_URL}/sites/${siteName}/folders/all`
  )
  if (foldersResp.data && foldersResp.data.allFolderContent) {
    // parse directory files
    foldersContent = foldersResp.data.allFolderContent.reduce(
      (acc, currFolder) => {
        const collectionKey = Object.keys(currFolder.content.collections)[0]
        const folderOrder = currFolder.content.collections[collectionKey].order
        acc[currFolder.name] = getNavFolderDropdownFromFolderOrder(folderOrder)
        return acc
      },
      {}
    )
  }

  if (!navContent) return undefined

  return {
    navContent,
    navSha,
    collectionContent,
    foldersContent,
    resourceContent,
  }
}

const getMediaDetails = async ({ siteName, type, customPath, fileName }) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${
      type === "images" ? "images" : "documents"
    }/${generateImageorFilePath(customPath, fileName)}`
  )
  return resp.data
}

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
  getDirectoryFile,
  setDirectoryFile,
  getLastUpdated,
  getEditNavBarData,
  getAllCategories,
  getMediaDetails,
  getEmailOtp,
  verifyEmailOtp,
  getMobileNumberOtp,
  verifyMobileNumberOtp,
}
