// import dependencies
import axios from "axios"
import cheerio from "cheerio"
import { format } from "date-fns-tz"
import _ from "lodash"
import { QueryClient } from "react-query"
import slugify from "slugify"
import yaml from "yaml"

import { getMediaDetails } from "../api"
import { LOCAL_STORAGE_KEYS } from "../constants/localStorage"

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

// takes a string URL and returns true if the link is an internal link
// only works on browser side
export function isLinkInternal(url) {
  const tempLink = document.createElement("a")
  tempLink.href = url
  return tempLink.hostname === window.location.hostname
}

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i += 1) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType })
  return blob
}

/**
 * Checks if the current repo with siteName is private
 * If repo is public, returns the raw GitHub image URL
 * If repo is private, calls the backend image API endpoint to retrieve the b64 encoded image blob text and returns the blob URL
 *
 * @param {string} siteName - Name of Isomer page repo
 * @param {string} filePath - File path of image in repo. Should be of the format '/images/folder/subfolder1/subfolder2.../imagename.ext'.
 *    The leading '/' is optional. The filePath parameter should be URI decoded. Examples:
 *    images/test-folder/image sample.png
 *    /images/test.svg
 *    /images/folder 1/folder2/folder3/names.jpg
 * @param {boolean} shouldLoad - Specifies whether url should be generated or not. Images/documents in the Files tab should
 *    should not have image URLs.
 * @returns {Promise<string>}
 */
export async function fetchImageURL(siteName, filePath, shouldLoad = true) {
  if (shouldLoad) {
    const cleanPath = filePath.replace(/^\//, "") // Remove leading / if it exists e.g. /images/example.png -> images/example.png
    // If the image is public, return the link to the raw file, otherwise make a call to the backend API to retrieve the image blob
    const isPrivate = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEYS.SitesIsPrivate)
    )[siteName]
    if (!isPrivate) {
      return `https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${cleanPath}${
        cleanPath.endsWith(".svg") ? "?sanitize=true" : ""
      }`
    }
    const filePathArr = cleanPath.split("/")
    const fileName = filePathArr[filePathArr.length - 1]
    const customPath = filePathArr.slice(1, filePathArr.length - 1).join("%2F")
    const { imageName, content } = await getMediaDetails({
      siteName,
      type: "images",
      fileName,
      customPath,
    })

    const imageExt = imageName.slice(imageName.lastIndexOf(".") + 1)
    const contentType = `image/${imageExt === "svg" ? "svg+xml" : imageExt}`

    const blob = b64toBlob(content, contentType)
    return URL.createObjectURL(blob)
  }
  return undefined
}

// takes in a permalink and returns a URL that links to the image on the staging branch of the repo
export async function prependImageSrc(repoName, chunk) {
  const $ = cheerio.load(chunk)
  const imagePromises = []
  const elementsToUpdate = []
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity, // Never automatically refetch image unless query is invalidated
      },
    },
  })

  $("img").each((i, elem) => {
    // check for whether the original image source is from within Github or outside of Github
    // only modify URL if it's a permalink on the website
    if (isLinkInternal($(elem).attr("src"))) {
      const filePath = $(elem).attr("src")
      const imagePromise = queryClient.fetchQuery(
        `${repoName}/${filePath}`,
        () => fetchImageURL(repoName, filePath)
      )
      imagePromises.push(imagePromise)
      elementsToUpdate.push(elem)
    }
    // change src to placeholder image if images not found
    $(elem).attr(
      "onerror",
      "this.onerror=null; this.src='/placeholder_no_image.png';"
    )
  })

  const imageURLs = await Promise.allSettled(imagePromises)
  elementsToUpdate.forEach((elem, index) => {
    $(elem).attr("src", imageURLs[index].value)
  })
  return $.html()
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
