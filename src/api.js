import axios from 'axios';
import { getNavFolderDropdownFromFolderOrder, parseDirectoryFile } from './utils';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getDirectoryFile = async (siteName, folderName) => {
    return await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`);
}

const setDirectoryFile = async (siteName, folderName, payload) => {
    return await axios.post(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`, payload);
}

const getFolderContents = async (siteName, folderName, subfolderName) => {
    return await axios.get(`${BACKEND_URL}/sites/${siteName}/folders?path=_${folderName}${subfolderName ? `/${subfolderName}` : ''}`);
}

// EditPage
const getPageApiEndpoint = (isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName) => {
    if (isCollectionPage) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${fileName}`)}`
    }
    if (isResourcePage) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`
    }
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`
}

const getEditPageData = async (isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName) => {
    const apiEndpoint = getPageApiEndpoint(isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName)
    const resp = await axios.get(apiEndpoint);
    const { content:pageContent, sha:pageSha } = resp.data;
    
    if (!pageContent) return

    // retrieve CSP
    const cspResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`);
    const { netlifyTomlHeaderValues } = cspResp.data;

    let dirContent, dirSha
    if  (isCollectionPage) {
        // retrieve directory information
        const dirResp = await getDirectoryFile(siteName, collectionName)
        const { content, sha } = dirResp.data
        dirContent = content
        dirSha = sha
    }

    return {
        pageContent,
        pageSha,
        netlifyTomlHeaderValues,
        dirContent,
        dirSha,
    }
}

const updatePageData = async (isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName, content, sha) => {
    const apiEndpoint = getPageApiEndpoint(isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName)
    const params = {
        content,
        sha,
    };
    return await axios.post(apiEndpoint, params);
}

const deletePageData = async (isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName, sha) => {
    const apiEndpoint = getPageApiEndpoint(isResourcePage, isCollectionPage, collectionName, subfolderName, fileName, siteName, resourceName)
    const params = { sha };
    return await axios.delete(apiEndpoint, {
        data: params,
    });
}

// EditNavBar
const getEditNavBarData = async(siteName) => {
    let navContent, collectionContent, resourceContent, navSha, foldersContent

    const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/navigation`);
    const { content, sha } = resp.data;
    navContent = content
    navSha = sha
    const collectionResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/collections`)
    collectionContent = collectionResp.data
    const resourceResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/resources`)
    resourceContent = resourceResp.data
    const foldersResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/folders/all`)
    if (foldersResp.data && foldersResp.data.allFolderContent) {
        // parse directory files
        foldersContent = foldersResp.data.allFolderContent.reduce((acc, currFolder) => {
            const folderOrder = parseDirectoryFile(currFolder.content)
            acc[currFolder.name] = getNavFolderDropdownFromFolderOrder(folderOrder)
            return acc
        }, {})
    }

    if (!navContent) return

    return {
        navContent,
        navSha,
        collectionContent,
        foldersContent,
        resourceContent,
    }
}

const updateNavBarData = async (siteName, originalNav, links, sha) => {
    const params = {
        content: {
            ...originalNav,
            links
        },
        sha: sha,
    };
    return await axios.post(`${BACKEND_URL}/sites/${siteName}/navigation`, params);
}

const createPage = async (endpointUrl, content) => {
    return await axios.post(`${BACKEND_URL}/sites/${endpointUrl}`, { content });
}

const moveFiles = async (siteName, selectedFiles, title, parentFolder) => {
    const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${parentFolder ? `/collections/${parentFolder}` : '/pages'}`
    const params = {
        files: selectedFiles
    };
    const newPath = encodeURIComponent(`${parentFolder ? `${parentFolder}/` : ''}${title}`)
    return await axios.post(`${baseApiUrl}/move/${newPath}`, params)
}

export {
    getDirectoryFile,
    setDirectoryFile,
    getFolderContents,
    getEditPageData,
    updatePageData,
    deletePageData,
    getEditNavBarData,
    updateNavBarData,
    createPage,
    moveFiles,
}