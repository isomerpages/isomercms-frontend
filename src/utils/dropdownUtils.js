import axios from 'axios';

// axios settings
axios.defaults.withCredentials = true

export const retrieveThirdNavOptions = async (siteName, collectionName, isExistingCollection) => {
    let thirdNavArr = [], allCollectionPages = []
    if (isExistingCollection) {
        const endpoint = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages`
        const { data : { collectionPages } } = await axios.get(endpoint)
        thirdNavArr = collectionPages.filter((elem) => elem.type === 'third-nav')
        allCollectionPages = collectionPages
    }
    const thirdNavOptions = [''].concat(thirdNavArr).map((thirdNav) => (
        {
            value:thirdNav.title,
            label:thirdNav.title ? thirdNav.title : 'None',
        }
    ))
    return {
        collectionPages: allCollectionPages,
        thirdNavOptions,
    }
}
