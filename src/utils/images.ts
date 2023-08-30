/**
 * Util method to retrieve image details from /images folder from the relative file path,
 * e.g. "/images/album%/picture$.jpg" -> { imageDirectory: "images%2Falbum%25", fileName: "picture%24.jpg" }
 */
export const getImageDetails = (imageLink: string): { fileName: string; imageDirectory: string } => {
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
