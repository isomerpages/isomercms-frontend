/**
 * Util method to retrieve image path from /images folder from the relative file path,
 * e.g. "/images/album/picture.jpg" -> "album/picture.jpg"
 */
export const getImagePath = (imageLink: string) => {
  const cleanImagePath = decodeURI(imageLink).replace(/^\//, "")
  const filePathArr = cleanImagePath.split("/")
  const filePath = filePathArr[filePathArr.length - 1]
  return filePath
}
