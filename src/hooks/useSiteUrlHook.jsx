import axios from 'axios';
// Constants
const LOCAL_STORAGE_STAGING_URL = 'isomercms_staging_url'

const useSiteUrlHook = () => {
    const getStagingUrlObj = () => {
        const localStorageStagingUrl = JSON.parse(localStorage.getItem(LOCAL_STORAGE_STAGING_URL))
        return localStorageStagingUrl
    }

    const setLocalStorageStagingUrlObj = (newStagingUrlObj) => {
        localStorage.setItem(LOCAL_STORAGE_STAGING_URL, JSON.stringify(newStagingUrlObj))
    }

    const retrieveStagingUrl = async (siteName) => {
        const localStorageStagingUrlObj = getStagingUrlObj()
        if (!localStorageStagingUrlObj || !localStorageStagingUrlObj[siteName]) {
            const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/stagingUrl`);
            const { stagingUrl } = resp.data
            setLocalStorageStagingUrlObj({
                ...localStorageStagingUrlObj,
                [siteName]: {
                    stagingUrl
                },
            })
            return stagingUrl
        }
        return localStorageStagingUrlObj[siteName].stagingUrl
    }

    return { retrieveStagingUrl }
}

export default useSiteUrlHook;