/*
Note, we have moved these specific utils into their own file as Cypress tests
are using them. If these are in legacy.js, the file relies on process.env, which is 
not support in Webpack 5 and in Cypress, hence breaking the tests.
*/
import slugify from "slugify"

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

export function prettifyDate(date) {
  const tokenArray = date.split("-")
  const day = tokenArray[2]
  const month = monthIntToStr(tokenArray[1])
  const year = tokenArray[0]
  return `${day} ${month} ${year}`
}

export function prettifyPageFileName(fileName) {
  const fileNameArray = fileName.split(".md")[0]
  const tokenArray = fileNameArray.split("-").map((token) => {
    if (token.length < 2) return token.toUpperCase()
    return token.slice(0, 1).toUpperCase() + token.slice(1)
  })

  return tokenArray.join(" ")
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

  const type = ["file", "post", "link"].includes(tokenArray[3])
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

export function slugifyCategory(category) {
  return slugify(category)
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
}

export function generateResourceFileName(title, date, isPost) {
  return `${date}-${isPost ? "post" : "file"}-${title}.md`
}

export function titleToPageFileName(title) {
  return `${title}.md`
}

export function pageFileNameToTitle(pageFileName, isResourcePage = false) {
  if (isResourcePage) return retrieveResourceFileMetadata(pageFileName).title
  return `${pageFileName.split(".md")[0]}`
}

export const extractMetadataFromFilename = ({
  resourceCategoryName,
  fileName,
}) => {
  if (resourceCategoryName) {
    const resourceMetadata = retrieveResourceFileMetadata(fileName)
    return {
      ...resourceMetadata,
      date: prettifyDate(resourceMetadata.date),
    }
  }
  return { title: prettifyPageFileName(fileName), date: "" }
}
