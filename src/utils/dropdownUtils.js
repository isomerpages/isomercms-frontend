import axios from 'axios';

// axios settings
axios.defaults.withCredentials = true

export const retrieveThirdNavOptions = async (siteName, collectionName) => {
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages`
    const { data : { collectionPages } } = await axios.get(endpoint)
    const thirdNavArr = collectionPages.filter((elem) => elem.type === 'third-nav')
    const thirdNavOptions = [''].concat(thirdNavArr).map((thirdNav) => (
        {
            value:thirdNav.title,
            label:thirdNav.title ? thirdNav.title : 'None',
        }
    ))
    return {
        collectionPages,
        thirdNavOptions,
    }
}
