// import dependencies
import yaml from "yaml"
import cheerio from "cheerio"
import slugify from "slugify"
import axios from "axios"
import _ from "lodash"
import { QueryClient } from "react-query"
import { getMediaDetails } from "./api"
import { SITES_IS_PRIVATE_KEY } from "./constants"

// axios settings
axios.defaults.withCredentials = true

// Constants
export const DEFAULT_RETRY_MSG =
  "Please try again or check your internet connection"
export const DEFAULT_ERROR_TOAST_MSG = `Something went wrong. ${DEFAULT_RETRY_MSG}`

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

// this function converts directories into readable form
// for example, 'this-is-a-directory' -> 'This Is A Directory'
export function deslugifyDirectory(dirName) {
  return dirName
    .split("-")
    .map((string) => _.upperFirst(string)) // capitalize first letter
    .join(" ") // join it back together
}

// this function converts file names into readable form
// for example, 'this-is-a-file.md' -> 'This Is A File'
export function deslugifyPage(pageName) {
  return pageName
    .split(".")[0] // remove the file extension
    .split("-")
    .map((string) => _.upperFirst(string)) // capitalize first letter
    .join(" ") // join it back together
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
    const isPrivate = JSON.parse(localStorage.getItem(SITES_IS_PRIVATE_KEY))[
      siteName
    ]
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

const monthMap = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
}

function monthIntToStr(monthInt) {
  return monthMap[monthInt]
}

// Takes in a resource file name and retrieves the date, type, and title of the resource.
// =================
// Each fileName comes in the format of `{date}-{type}-{title}.md`
// A sample fileName is 2019-08-23-post-CEO-made-a-speech.md
// {date} is YYYY-MM-DD, e.g. 2019-08-23
// {type} is either `post` or `file`
// {title} is a string containing [a-z,A-Z,0-9] and all whitespaces are replaced by hyphens
export function retrieveResourceFileMetadata(fileName) {
  const fileNameArray = fileName.split(".md")[0]
  const tokenArray = fileNameArray.split("-")
  const date = tokenArray.slice(0, 3).join("-")

  const type = ["file", "post"].includes(tokenArray[3])
    ? tokenArray[3]
    : undefined

  const titleTokenArray = type ? tokenArray.slice(4) : tokenArray.slice(3)
  const prettifiedTitleTokenArray = titleTokenArray.map((token) => {
    // We search for special characters which were converted to text
    // Convert dollar back to $ if it is followed by any alphanumeric character
    const convertedToken = token.replaceAll(/dollar(?=([0-9]))/g, "$")
    if (convertedToken.length < 2) return convertedToken.toUpperCase()
    return convertedToken.slice(0, 1).toUpperCase() + convertedToken.slice(1)
  })
  const title = prettifiedTitleTokenArray.join(" ")

  return { date, type, title }
}

export function prettifyDate(date) {
  const tokenArray = date.split("-")
  const day = tokenArray[2]
  const month = monthIntToStr(tokenArray[1])
  const year = tokenArray[0]
  return `${day} ${month} ${year}`
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

export function generateResourceFileName(title, date, isPost) {
  const safeTitle = slugify(title, { lower: true }).replace(
    /[^a-zA-Z0-9-]/g,
    ""
  )
  return `${date}-${isPost ? "post" : "file"}-${safeTitle}.md`
}

export function slugifyCategory(category) {
  return slugify(category)
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
}

export function prettifyPageFileName(fileName) {
  const fileNameArray = fileName.split(".md")[0]
  const tokenArray = fileNameArray.split("-").map((token) => {
    if (token.length < 2) return token.toUpperCase()
    return token.slice(0, 1).toUpperCase() + token.slice(1)
  })

  return tokenArray.join(" ")
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

export const getObjectDiff = (obj1, obj2) => {
  const allkeys = _.union(_.keys(obj1), _.keys(obj2))
  const difference = _.reduce(
    allkeys,
    function (result, key) {
      const newResult = { ...result }
      if (!_.isEqual(obj1[key], obj2[key])) {
        newResult[key] = { obj1: obj1[key], obj2: obj2[key] }
      }
      return newResult
    },
    {}
  )
  return difference
}

export const parseDirectoryFile = (folderContent) => {
  const decodedContent = yaml.parse(folderContent)
  const collectionKey = Object.keys(decodedContent.collections)[0]
  return decodedContent.collections[collectionKey]
}

export const updateDirectoryFile = (folderName, isFolderLive, folderOrder) => {
  const newContent = {
    collections: {
      [folderName]: {
        output: isFolderLive,
        order: folderOrder,
      },
    },
  }
  return yaml.stringify(newContent)
}

export const getNavFolderDropdownFromFolderOrder = (folderOrder) => {
  return folderOrder.reduce((acc, curr) => {
    const pathArr = curr.split("/") // sample paths: "prize-sponsor.md", "prize-jury/nominating-committee.md"

    if (pathArr.length === 1) {
      acc.push(deslugifyDirectory(curr.split(".")[0])) // remove file extension
    }

    if (
      pathArr.length === 2 &&
      deslugifyDirectory(pathArr[0]) !== acc[acc.length - 1] &&
      pathArr[1] !== ".keep"
    ) {
      acc.push(deslugifyDirectory(pathArr[0]))
    }

    return acc
  }, [])
}

export const convertFolderOrderToArray = (folderOrder) => {
  let currFolderEntry = {}
  return folderOrder.reduce((acc, curr, currIdx) => {
    const folderPathArr = curr.split("/")
    if (folderPathArr.length === 1) {
      if (JSON.stringify(currFolderEntry) !== "{}") acc.push(currFolderEntry)
      currFolderEntry = {}
      acc.push({
        type: "file",
        path: curr,
        fileName: curr,
      })
    }

    if (folderPathArr.length > 1) {
      const subfolderTitle = folderPathArr[0]

      // Start of a new subfolder section
      if (currFolderEntry.fileName !== subfolderTitle) {
        // Case: two consecutive subfolders - transitioning from one to the other
        if (
          currFolderEntry.fileName &&
          currFolderEntry.fileName !== subfolderTitle
        ) {
          acc.push(currFolderEntry)
        }

        currFolderEntry = {
          type: "dir",
          fileName: subfolderTitle,
          path: curr,
          children: [curr],
        }
      } else {
        currFolderEntry.children.push(curr)
      }

      // last entry
      if (currIdx === folderOrder.length - 1) acc.push(currFolderEntry)
    }

    return acc
  }, [])
}

export const convertArrayToFolderOrder = (array) => {
  const updatedFolderOrder = array.map(({ type, children, path }) => {
    if (type === "dir") return children
    if (type === "file") return path
    return undefined
  })
  return _.flatten(updatedFolderOrder)
}

export const retrieveSubfolderContents = (folderOrder, subfolderName) => {
  return folderOrder.reduce((acc, curr) => {
    const folderPathArr = curr.split("/")
    if (folderPathArr.length === 2) {
      const [subfolderTitle, subfolderFileName] = folderPathArr
      if (subfolderTitle === subfolderName) {
        acc.push({
          type: "file",
          path: curr,
          fileName: subfolderFileName,
        })
      }
    }
    return acc
  }, [])
}

export const convertSubfolderArray = (
  folderOrderArray,
  rawFolderContents,
  subfolderName
) => {
  const placeholderItem = {
    path: `${subfolderName}/.keep`,
  }
  const arrayCopy = [placeholderItem].concat(_.cloneDeep(folderOrderArray))
  return rawFolderContents.map((curr) => {
    const folderPathArr = curr.split("/")
    const subfolderTitle = folderPathArr[0]
    if (folderPathArr.length === 2 && subfolderTitle === subfolderName) {
      const { path } = arrayCopy.shift()
      return path
    }
    return curr
  })
}

export const generateImageorFilePath = (customPath, fileName) => {
  if (customPath) return encodeURIComponent(`${customPath}/${fileName}`)
  return fileName
}
