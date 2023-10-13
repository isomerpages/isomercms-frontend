import * as cheerio from "cheerio"

import { MediaData } from "types/directory"

import { isLinkInternal } from "./misc"

/**
 * Util method to retrieve image details from /images folder from the relative file path,
 * e.g. "/images/album%/picture$.jpg" -> { imageDirectory: "images%2Falbum%25", fileName: "picture%24.jpg" }
 */
export const getImageDetails = (
  imageLink: string
): { fileName: string; imageDirectory: string } => {
  const cleanImagePath = decodeURI(imageLink).replace(/^\//, "")
  const filePathArr = cleanImagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
  const fileName = filePathArr[filePathArr.length - 1]
  const imageDirectory = filePathArr
    .slice(0, filePathArr.length - 1)
    .join("%2F")
  return {
    fileName,
    imageDirectory,
  }
}

/**
 * Util method to adjust image src in provided HTML, so that they can load from
 * the correct source (i.e. GitHub or as base64).
 */
export const adjustImageSrcs = (
  html: string,
  mediaData: MediaData[]
): string => {
  const $ = cheerio.load(html)

  $("img").each((_, element) => {
    const src = $(element).attr("src")

    if (src && isLinkInternal(src)) {
      $(element).attr(
        "src",
        mediaData.find((media) => src === `/${media.mediaPath}`)?.mediaUrl ||
          "/placeholder_no_image.png"
      )
    }

    // Set default placeholder image if image fails to load
    $(element).attr(
      "onerror",
      "this.onerror=null; this.src='/placeholder_no_image.png';"
    )
  })

  return $.html()
}

/**
 * Util method to extract all image srcs that are internal from the provided HTML.
 */
export const getMediaSrcsFromHtml = (html: string): string[] => {
  const $ = cheerio.load(html)
  const mediaSrcs: string[] = []

  $("img").each((_, element) => {
    const src = $(element).attr("src")

    if (src && isLinkInternal(src)) {
      mediaSrcs.push(src)
    }
  })

  return mediaSrcs
}
