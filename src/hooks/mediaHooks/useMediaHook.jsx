import axios from 'axios';
import { useQuery } from 'react-query'
import { generateImageorFilePath } from '../../utils';

const fetchImageURL = async (siteName, filePath) => {
  const cleanPath = filePath.replace(/^\//, '') //Remove leading / if it exists e.g. /images/example.png -> images/example.png
  //If the image is public, return the link to the raw file, otherwise make a call to the backend API to retrieve the image blob
  const isPrivate = JSON.parse(localStorage.getItem(SITES_IS_PRIVATE_KEY))[siteName]
  if (!isPrivate) {
    return `https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${cleanPath}${cleanPath.endsWith('.svg') ? '?sanitize=true' : ''}`
  } else {
    const filePathArr = cleanPath.split('/')
    const fileName = filePathArr[filePathArr.length - 1]
    const customPath = filePathArr.slice(1, filePathArr.length - 1).join('%2F')
    const mediaResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'images' ? 'images' : 'documents'}/${generateImageorFilePath(customPath, fileName)}`)
    const {imageName, content} = mediaResp.data

    const imageExt = imageName.slice(imageName.lastIndexOf('.') + 1)
    const contentType = 'image/' + (imageExt === 'svg' ? 'svg+xml' : imageExt)

    const blob = b64toBlob(content, contentType)
    return URL.createObjectURL(blob)
  }
}

export function useMediaHook(siteName, type, filePath) {
  return useQuery(
    `${siteName}/${filePath}`,
    () => fetchImageURL(siteName, filePath), {
      enabled: type === 'images',
      refetchOnWindowFocus: false,
      staleTime: Infinity, // Never automatically refetch image unless query is invalidated
    }
  )
}