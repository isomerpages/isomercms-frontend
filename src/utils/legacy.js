// import dependencies
import axios from "axios"
import { format } from "date-fns-tz"
import _ from "lodash"
import slugify from "slugify"
import yaml from "yaml"

import { deslugifyDirectory } from "./deslugify"

// axios settings
axios.defaults.withCredentials = true

// Constants
export const DEFAULT_RETRY_MSG =
  "Please try again or check your internet connection"

// extracts yaml front matter from a markdown file path
export function frontMatterParser(content) {
  // format file to extract yaml front matter
  const results = content.split("---")
  const frontMatter = yaml.parse(results[1]) // get the front matter as an object
  const mdBody = results.slice(2).join("---")

  return {
    frontMatter,
    mdBody,
  }
}

// this function concatenates the front matter with the main content body
// of the markdown file
export function concatFrontMatterMdBody(frontMatter, mdBody) {
  return ["---\n", yaml.stringify(frontMatter), "---\n", mdBody].join("")
}

// function recursively checks if all child object values are empty
// note that {a: '', b: {c: ''}, d: [ {e: ''}, {f: [ {g: ''} ]} ]} returns true
export function isEmpty(obj) {
  let isEmptyVal = true
  Object.keys(obj).forEach((key) => {
    if (
      typeof obj[key] === "object" &&
      Object.prototype.hasOwnProperty.call(obj, key)
    ) {
      isEmptyVal = isEmptyVal && isEmpty(obj[key])
    } else if (obj[key] !== "" && obj[key] !== null) {
      isEmptyVal = false
    }
  })
  return isEmptyVal
}

export function prettifyCollectionPageFileName(fileName) {
  const fileNameArray = fileName.split(".md")[0]
  const tokenArray = fileNameArray.split("-").map((token) => {
    if (token.length < 2) return token.toUpperCase()
    return token.slice(0, 1).toUpperCase() + token.slice(1)
  })
  return tokenArray.slice(1).join(" ")
}

export function generatePageFileName(title) {
  return `${slugify(title, { lower: true }).replace(/[^a-zA-Z0-9-]/g, "")}.md`
}

export function slugifyLower(str) {
  return slugify(str, { lower: true })
}

export const parseDirectoryFile = (folderContent) => {
  const decodedContent = yaml.parse(folderContent)
  const collectionKey = Object.keys(decodedContent.collections)[0]
  return decodedContent.collections[collectionKey]
}

export const getRedirectUrl = ({
  siteName,
  collectionName,
  subCollectionName,
  resourceRoomName,
  resourceCategoryName,
  mediaRoom,
  mediaDirectoryPath,
  fileName,
}) => {
  if (!fileName) {
    if (mediaDirectoryPath) {
      return `/sites/${siteName}/media/${mediaRoom}/mediaDirectory/${encodeURIComponent(
        mediaDirectoryPath
      )}`
    }
    if (resourceRoomName) {
      return `/sites/${siteName}/resourceRoom/${resourceRoomName}${
        resourceCategoryName
          ? `/resourceCategory/${encodeURIComponent(resourceCategoryName)}`
          : ""
      }`
    }
    if (collectionName) {
      return `/sites/${siteName}/folders/${collectionName}${
        subCollectionName
          ? `/subfolders/${encodeURIComponent(subCollectionName)}`
          : ""
      }`
    }
  } else {
    if (resourceRoomName && resourceCategoryName) {
      // if resourceType is 'file', redirect to resourceCategory
      // temporary workaround until we allow for preview of PDF
      return `/sites/${siteName}/resourceRoom/${resourceRoomName}/resourceCategory/${encodeURIComponent(
        resourceCategoryName
      )}${
        fileName.split("-")[3] === "file" || fileName.split("-")[3] === "link"
          ? ""
          : `/editPage/${encodeURIComponent(fileName)}`
      }`
    }
    if (collectionName) {
      return `/sites/${siteName}/folders/${collectionName}/${
        subCollectionName ? `subfolders/${subCollectionName}/` : ""
      }editPage/${encodeURIComponent(fileName)}`
    }
  }
  return `/sites/${siteName}/editPage/${encodeURIComponent(fileName)}`
}

export const getBackButton = ({
  resourceRoomName,
  resourceCategoryName,
  collectionName,
  siteName,
  subCollectionName,
  fileName,
}) => {
  if (resourceCategoryName)
    return {
      backButtonLabel: `Back to ${deslugifyDirectory(resourceCategoryName)}`,
      backButtonUrl: `/sites/${siteName}/resourceRoom/${resourceRoomName}/resourceCategory/${resourceCategoryName}`,
    }
  if (collectionName) {
    if (subCollectionName && fileName)
      return {
        backButtonLabel: `Back to ${deslugifyDirectory(subCollectionName)}`,
        backButtonUrl: `/sites/${siteName}/folders/${collectionName}/subfolders/${encodeURIComponent(
          subCollectionName
        )}`,
      }
    if (fileName || subCollectionName)
      return {
        backButtonLabel: `Back to ${deslugifyDirectory(collectionName)}`,
        backButtonUrl: `/sites/${siteName}/folders/${collectionName}`,
      }
    return {
      backButtonLabel: "Back to My Workspace",
      backButtonUrl: `/sites/${siteName}/workspace`,
    }
  }
  if (siteName) {
    if (fileName)
      return {
        backButtonLabel: "Back to Workspace",
        backButtonUrl: `/sites/${siteName}/workspace`,
      }
    return {
      backButtonLabel: "Back to Sites",
      backButtonUrl: `/sites`,
    }
  }
  return {}
}

export const getDefaultFrontMatter = (params, existingTitles) => {
  const {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
  } = params
  let exampleTitle = "Example Title"
  let examplePermalink = "/"
  const exampleDate = format(Date.now(), "yyyy-MM-dd")
  const exampleLayout = "post"
  if (resourceRoomName)
    while (
      existingTitles.includes(
        `${exampleDate}-${exampleLayout}-${exampleTitle}.md`
      )
    ) {
      exampleTitle += " 1"
    }
  else
    while (existingTitles.includes(`${exampleTitle}.md`)) {
      exampleTitle += " 1"
    }
  if (collectionName) {
    examplePermalink += `${
      slugify(collectionName) ? `${slugify(collectionName)}/` : "unrecognised/"
    }`
  }
  if (subCollectionName) {
    examplePermalink += `${
      slugify(subCollectionName)
        ? `${slugify(subCollectionName)}/`
        : "unrecognised/"
    }`
  }
  if (resourceRoomName) {
    examplePermalink += `${
      slugify(resourceRoomName)
        ? `${slugify(resourceRoomName)}/`
        : "unrecognised/"
    }`
  }
  if (resourceCategoryName) {
    examplePermalink += `${
      slugify(resourceCategoryName)
        ? `${slugify(resourceCategoryName)}/`
        : "unrecognised/"
    }`
  }
  examplePermalink += `permalink`
  examplePermalink = examplePermalink.toLowerCase()
  if (!resourceRoomName)
    return {
      title: exampleTitle,
      permalink: examplePermalink,
    }
  return {
    title: exampleTitle,
    permalink: examplePermalink,
    date: exampleDate,
    layout: exampleLayout,
  }
}

export const isLastItem = (type, params) => {
  const {
    collectionName,
    subCollectionName,
    resourceRoomName,
    resourceCategoryName,
    mediaRoom,
    mediaDirectoryName,
    fileName,
  } = params
  if (type === "siteName") {
    return (
      !collectionName &&
      !subCollectionName &&
      !fileName &&
      !resourceRoomName &&
      !resourceCategoryName &&
      !mediaRoom &&
      !mediaDirectoryName &&
      !fileName
    )
  }
  if (type === "collectionName") {
    return !subCollectionName && !fileName
  }
  if (type === "subCollectionName") {
    return !fileName
  }
  if (type === "resourceRoomName") {
    return !resourceCategoryName && !fileName
  }
  if (type === "resourceCategoryName") {
    return !fileName
  }
  if (type === "mediaRoom") {
    return !mediaDirectoryName && !fileName
  }
  if (type === "mediaDirectoryName") {
    return !fileName
  }
  if (type === "fileName") {
    return !!fileName
  }

  return false
}

export const getLastItemType = (params) => {
  const types = Object.keys(params)
  const lastItemType = types.filter((type) => isLastItem(type, params))[0]
  return lastItemType
}

export const getMediaDirectoryName = (
  mediaDirectoryName,
  { start = 0, end, splitOn = "%2F", joinOn = "%2F", decode = false }
) => {
  const mediaDirectoryArray = mediaDirectoryName.split(splitOn)
  const selectedMediaDirectoryArray = mediaDirectoryArray.slice(start, end)
  if (decode) {
    const decodedSelectedMediaDirectoryArray = selectedMediaDirectoryArray.map(
      (v) => decodeURIComponent(v)
    )
    return decodedSelectedMediaDirectoryArray.join(joinOn)
  }
  return selectedMediaDirectoryArray.join(joinOn)
}

export const getNextItemType = (params) => {
  const lastItemType = getLastItemType(params)
  if (lastItemType === "siteName") {
    return "collectionName"
  }
  if (lastItemType === "mediaRoom") {
    return "mediaDirectoryName"
  }
  if (lastItemType === "collectionName") {
    return "subCollectionName"
  }
  if (lastItemType === "subCollectionName") {
    return "fileName"
  }
  if (lastItemType === "resourceRoomName") {
    return "resourceCategoryName"
  }
  if (lastItemType === "resourceCategoryName") {
    return "fileName"
  }
  if (lastItemType === "fileName") {
    return false
  }
  return false
}
