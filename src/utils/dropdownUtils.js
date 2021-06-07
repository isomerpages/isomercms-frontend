import axios from "axios"

import { DEFAULT_RETRY_MSG } from "../utils"
import { errorToast } from "./toasts"

// axios settings
axios.defaults.withCredentials = true

export const retrieveThirdNavOptions = async (
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
    errorToast(
      `There was a problem trying to retrieve data from your repo. ${DEFAULT_RETRY_MSG}`
    )
    console.log(err)
  }
}
