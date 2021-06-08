import axios from "axios"

import { DEFAULT_RETRY_MSG } from "@src/utils"
import { errorToast } from "@utils/toasts.jsx"

// axios settings
axios.defaults.withCredentials = true

const retrieveThirdNavOptions = async (
  siteName,
  collectionName,
  isExistingCollection
) => {
  try {
    let thirdNavArr = []
    let allCollectionPages = []
    if (isExistingCollection) {
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages`
      const {
        data: { collectionPages },
      } = await axios.get(endpoint)
      thirdNavArr = collectionPages.filter((elem) => elem.type === "third-nav")
      allCollectionPages = collectionPages
    }
    const thirdNavOptions = thirdNavArr.map((thirdNav) => ({
      value: thirdNav.title,
      label: thirdNav.title ? thirdNav.title : "None",
    }))
    return {
      collectionPages: allCollectionPages,
      thirdNavOptions,
    }
  } catch (err) {
    console.log(err)
    return errorToast(
      `There was a problem trying to retrieve data from your repo. ${DEFAULT_RETRY_MSG}`
    )
  }
}

export default retrieveThirdNavOptions
