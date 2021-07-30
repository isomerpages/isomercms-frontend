import axios from "axios"

import {
  getNavFolderDropdownFromFolderOrder,
  generateImageorFilePath,
} from "utils"

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

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

// EditPage
const getPageApiEndpoint = ({
  folderName,
  subfolderName,
  fileName,
  siteName,
  resourceName,
}) => {
  if (folderName) {
    return `${
      process.env.REACT_APP_BACKEND_URL
    }/sites/${siteName}/collections/${folderName}/pages/${encodeURIComponent(
      `${subfolderName ? `${subfolderName}/` : ""}${fileName}`
    )}`
  }
  if (resourceName) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`
}

const getCreatePageApiEndpoint = ({
  folderName,
  subfolderName,
  siteName,
  resourceName,
  newFileName,
}) => {
  if (folderName) {
    return `${
      process.env.REACT_APP_BACKEND_URL
    }/sites/${siteName}/collections/${folderName}/pages/new/${encodeURIComponent(
      `${subfolderName ? `${subfolderName}/` : ""}${newFileName}`
    )}`
  }
  if (resourceName) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/new/${newFileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/new/${newFileName}`
}

const getRenamePageApiEndpoint = ({
  folderName,
  subfolderName,
  fileName,
  siteName,
  resourceName,
  newFileName,
}) => {
  if (folderName) {
    return `${
      process.env.REACT_APP_BACKEND_URL
    }/sites/${siteName}/collections/${folderName}/pages/${encodeURIComponent(
      `${subfolderName ? `${subfolderName}/` : ""}${fileName}`
    )}/rename/${encodeURIComponent(
      `${subfolderName ? `${subfolderName}/` : ""}${newFileName}`
    )}`
  }
  if (resourceName) {
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}/rename/${newFileName}`
  }
  return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}/rename/${newFileName}`
}

const getMovePageEndpoint = ({
  siteName,
  resourceName,
  folderName,
  subfolderName,
  newPath,
}) => {
  if (folderName) {
    return `${BACKEND_URL}/sites/${siteName}/collections/${encodeURIComponent(
      `${folderName ? `${folderName}` : ""}${
        subfolderName ? `/${subfolderName}` : ""
      }`
    )}/move/${encodeURIComponent(`${newPath}`)}`
  }
  if (resourceName) {
    return `${BACKEND_URL}/sites/${siteName}/resources/${resourceName}/move/${encodeURIComponent(
      `${newPath}`
    )}`
  }
  return `${BACKEND_URL}/sites/${siteName}/pages/move/${encodeURIComponent(
    `${newPath}`
  )}`
}

const getEditPageData = async ({
  folderName,
  subfolderName,
  fileName,
  siteName,
  resourceName,
}) => {
  const apiEndpoint = getPageApiEndpoint({
    folderName,
    subfolderName,
    fileName,
    siteName,
    resourceName,
  })
  const resp = await axios.get(apiEndpoint)
  const { content: pageContent, sha: pageSha, resourceRoomName } = resp.data

  if (!pageContent) return undefined

  return {
    pageContent,
    pageSha,
    resourceRoomName,
  }
}

const getCsp = async (siteName) => {
  // retrieve CSP
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`
  )
  return resp.data
}

const createPageData = async (
  // temporary fix for v1 endpoint
  {
    folderName,
    subfolderName,
    newFileName,
    siteName,
    resourceRoomName,
    resourceName,
  },
  content
) => {
  const apiEndpoint = getCreatePageApiEndpoint({
    folderName,
    subfolderName,
    newFileName,
    siteName,
    resourceName,
  })
  const params = { content }
  await axios.post(apiEndpoint, params)

  // redirect to new page upon successful creation
  if (folderName) {
    return `/sites/${siteName}/folders/${folderName}/${
      subfolderName ? `subfolders/${subfolderName}/` : ""
    }editPage/${newFileName}` // V2
  }
  if (resourceName) {
    return `/sites/${siteName}/resourceRoom/${resourceRoomName}/resourceCategory/${resourceName}/editPage/${newFileName}`
  }
  return `/sites/${siteName}/pages/${newFileName}`
}

const renamePageData = async (
  { folderName, subfolderName, fileName, siteName, resourceName, newFileName },
  content,
  sha
) => {
  const apiEndpoint = getRenamePageApiEndpoint({
    folderName,
    subfolderName,
    fileName,
    siteName,
    resourceName,
    newFileName,
  })
  const params = {
    content,
    sha,
  }
  await axios.post(apiEndpoint, params)
}

const updatePageData = async (
  { folderName, subfolderName, fileName, siteName, resourceName },
  content,
  sha
) => {
  const apiEndpoint = getPageApiEndpoint({
    folderName,
    subfolderName,
    fileName,
    siteName,
    resourceName,
  })
  const params = {
    content,
    sha,
  }
  await axios.post(apiEndpoint, params)
}

const deletePageData = async (
  { folderName, subfolderName, fileName, siteName, resourceName },
  sha
) => {
  const apiEndpoint = getPageApiEndpoint({
    folderName,
    subfolderName,
    fileName,
    siteName,
    resourceName,
  })
  const params = { sha }
  return axios.delete(apiEndpoint, {
    data: params,
  })
}

// Folder and subfolders
const renameFolder = async ({ siteName, folderName, newFolderName }) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/rename/${newFolderName}`
  return axios.post(apiUrl)
}

const deleteFolder = async ({ siteName, folderName }) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}`
  return axios.delete(apiUrl)
}

const deleteSubfolder = async ({ siteName, folderName, subfolderName }) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/folders/${folderName}/subfolder/${subfolderName}`
  return axios.delete(apiUrl)
}

const renameSubfolder = async ({
  siteName,
  folderName,
  subfolderName,
  newSubfolderName,
}) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/folders/${folderName}/subfolder/${subfolderName}/rename/${newSubfolderName}`
  return axios.post(apiUrl)
}

const getResourceRoomName = async (siteName) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resource-room`
  const resp = await axios.get(apiUrl)
  const { resourceRoom } = resp.data
  return resourceRoom
}

// Resources
const deleteResourceCategory = async ({ siteName, categoryName }) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${categoryName}`
  return axios.delete(apiUrl)
}

const renameResourceCategory = async ({
  siteName,
  categoryName,
  newCategoryName,
}) => {
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${categoryName}/rename/${newCategoryName}`
  return axios.post(apiUrl)
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

const getAllResourceCategories = async (siteName) => {
  const apiEndpoint = `${BACKEND_URL}/sites/${siteName}/resources`
  const resp = await axios.get(apiEndpoint)
  return resp.data
}

const addResourceCategory = async (siteName, resourceName) => {
  if (!resourceName) return undefined
  const params = { resourceName }
  return axios.post(`${BACKEND_URL}/sites/${siteName}/resources`, params)
}

const getPages = async ({ siteName }) => {
  const pagesResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/pages`)
  return pagesResp.data.pages
}

const getResourcePages = async (siteName, resourceName) => {
  if (!resourceName) return undefined
  const apiEndpoint = `${BACKEND_URL}/sites/${siteName}/resources/${resourceName}`
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

const updateNavBarData = async (siteName, originalNav, links, sha) => {
  const params = {
    content: {
      ...originalNav,
      links,
    },
    sha,
  }
  return axios.post(`${BACKEND_URL}/sites/${siteName}/navigation`, params)
}

const moveFiles = async (siteName, selectedFiles, title, parentFolder) => {
  const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${
    parentFolder ? `/collections/${parentFolder}` : "/pages"
  }`
  const params = {
    files: selectedFiles,
  }
  const newPath = encodeURIComponent(
    `${parentFolder ? `${parentFolder}/` : ""}${title}`
  )
  return axios.post(`${baseApiUrl}/move/${newPath}`, params)
}

const moveFile = async ({
  selectedFile,
  siteName,
  resourceName,
  folderName,
  subfolderName,
  newPath,
}) => {
  const apiEndpoint = getMovePageEndpoint({
    siteName,
    resourceName,
    folderName,
    subfolderName,
    newPath,
  })
  const params = {
    files: [selectedFile],
  }
  return axios.post(apiEndpoint, params)
}

// Media
const getMedia = async (siteName, customPath, mediaType) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/files/${
      customPath ? encodeURIComponent(`${mediaType}/${customPath}`) : mediaType
    }`
  )
  const { directoryContents } = resp.data

  const respMedia = []
  const respDirectories = []
  directoryContents.forEach((fileOrDir) => {
    const processedFileOrDirData = { ...fileOrDir, fileName: fileOrDir.name }
    if (fileOrDir.type === "file") respMedia.push(processedFileOrDirData)
    if (fileOrDir.type === "dir") respDirectories.push(processedFileOrDirData)
  })

  return {
    respMedia,
    respDirectories,
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

const createMedia = async ({
  siteName,
  type,
  customPath,
  newFileName,
  content,
}) => {
  const params = {
    content,
  }

  if (type === "images") {
    params.imageName = newFileName
    params.imageDirectory = `images${customPath ? `/${customPath}` : ""}`
  } else {
    params.documentName = newFileName
    params.documentDirectory = `files${customPath ? `/${customPath}` : ""}`
  }

  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${
      type === "images" ? "images" : "documents"
    }`,
    params
  )
}

const renameMedia = async ({
  siteName,
  type,
  customPath,
  fileName,
  newFileName,
}) => {
  if (newFileName === fileName) return undefined
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${
      type === "images" ? "images" : "documents"
    }/${generateImageorFilePath(
      customPath,
      fileName
    )}/rename/${generateImageorFilePath(customPath, newFileName)}`
  )
}

const deleteMedia = async ({ siteName, type, sha, customPath, fileName }) => {
  const params = {
    sha,
  }

  return axios.delete(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${
      type === "images" ? "images" : "documents"
    }/${generateImageorFilePath(customPath, fileName)}`,
    {
      data: params,
    }
  )
}

const moveMedia = async ({
  siteName,
  type,
  oldCustomPath,
  newCustomPath,
  fileName,
}) => {
  if (newCustomPath === oldCustomPath) return undefined
  return axios.post(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${
      type === "images" ? "images" : "documents"
    }/${generateImageorFilePath(
      oldCustomPath,
      fileName
    )}/move/${generateImageorFilePath(newCustomPath, fileName)}`
  )
}

const createMediaSubfolder = async (siteName, mediaType, customPath) => {
  if ((mediaType !== "images" && mediaType !== "documents") || !customPath)
    return undefined
  return axios.post(
    `${
      process.env.REACT_APP_BACKEND_URL
    }/sites/${siteName}/media/${mediaType}/${encodeURIComponent(customPath)}`
  )
}

const renameMediaSubfolder = async ({
  siteName,
  mediaType,
  customPath,
  subfolderName,
  newSubfolderName,
}) => {
  const fullCustomPath = encodeURIComponent(
    `${customPath ? `${customPath}/` : ""}${subfolderName}`
  )
  const fullNewCustomPath = encodeURIComponent(
    `${customPath ? `${customPath}/` : ""}${newSubfolderName}`
  )
  const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/media/${mediaType}/${fullCustomPath}/rename/${fullNewCustomPath}`
  return axios.post(apiUrl)
}

const deleteMediaSubfolder = async ({ siteName, mediaType, customPath }) => {
  if ((mediaType !== "images" && mediaType !== "documents") || !customPath)
    return undefined
  return axios.delete(
    `${
      process.env.REACT_APP_BACKEND_URL
    }/sites/${siteName}/media/${mediaType}/${encodeURIComponent(customPath)}`
  )
}

// Login
const getOtp = (email) => {
  const endpoint = `${BACKEND_URL}/auth/otp`
  return axios.post(endpoint, { email })
}

const verifyOtp = async (email, otp) => {
  const endpoint = `${BACKEND_URL}/auth/login`
  const res = await axios.post(endpoint, { email, otp })
  return res.data
}

export {
  getDirectoryFile,
  setDirectoryFile,
  getLastUpdated,
  getEditPageData,
  getCsp,
  updatePageData,
  deletePageData,
  deleteFolder,
  renameFolder,
  deleteSubfolder,
  renameSubfolder,
  getResourceRoomName,
  deleteResourceCategory,
  renameResourceCategory,
  getAllResourceCategories,
  addResourceCategory,
  getPages,
  getResourcePages,
  getEditNavBarData,
  updateNavBarData,
  createPageData,
  renamePageData,
  getAllCategories,
  moveFiles,
  moveFile,
  getMedia,
  getMediaDetails,
  createMedia,
  renameMedia,
  deleteMedia,
  moveMedia,
  createMediaSubfolder,
  renameMediaSubfolder,
  deleteMediaSubfolder,
  getOtp,
  verifyOtp,
}
