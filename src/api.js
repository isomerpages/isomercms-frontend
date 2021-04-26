import axios from 'axios';
import { getNavFolderDropdownFromFolderOrder, parseDirectoryFile } from './utils';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getDirectoryFile = async (siteName, folderName) => {
    if (!folderName) return
    const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`);
    return resp.data
}

const setDirectoryFile = async (siteName, folderName, payload) => {
    return await axios.post(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`, payload);
}

const getLastUpdated = async (siteName) => {
    if (!siteName) return
    const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/lastUpdated`);
    const { lastUpdated } = resp.data
    return { lastUpdated }
}

// EditPage
const getPageApiEndpoint = ({folderName, subfolderName, fileName, siteName, resourceName}) => {
    if (folderName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${fileName}`)}`
    }
    if (resourceName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}`
    }
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}`
}

const getCreatePageApiEndpoint = ({folderName, subfolderName, siteName, resourceName, newFileName}) => {
    if (folderName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/new/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${newFileName}`)}`
    }
    if (resourceName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/new/${newFileName}`
    }
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/new/${newFileName}`
}

const getRenamePageApiEndpoint = ({folderName, subfolderName, fileName, siteName, resourceName, newFileName}) => {
    if (folderName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${fileName}`)}/rename/${encodeURIComponent(`${subfolderName ? `${subfolderName}/` : ''}${newFileName}`)}`
    }
    if (resourceName) {
        return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${resourceName}/pages/${fileName}/rename/${newFileName}`
    }
    return `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/${fileName}/rename/${newFileName}`
}

const getMovePageEndpoint = ({siteName, resourceName, folderName, subfolderName, newPath}) => {
    if (folderName) {
        return `${BACKEND_URL}/sites/${siteName}/collections/${encodeURIComponent(`${folderName ? `${folderName}`: ''}${subfolderName ? `/${subfolderName}` : ''}`)}/move/${encodeURIComponent(`${newPath}`)}`
    }
    if (resourceName) {
        return `${BACKEND_URL}/sites/${siteName}/resources/${resourceName}/move/${encodeURIComponent(`${newPath}`)}`
    }
    return `${BACKEND_URL}/sites/${siteName}/pages/move/${encodeURIComponent(`${newPath}`)}`
}

const getEditPageData = async ({folderName, subfolderName, fileName, siteName, resourceName}) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
    const resp = await axios.get(apiEndpoint);
    const { content:pageContent, sha:pageSha, resourceRoomName } = resp.data;
    
    if (!pageContent) return

    return {
        pageContent,
        pageSha,
        resourceRoomName,
    }
}

const getCsp = async (siteName) => {
    // retrieve CSP
    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`)
    return resp.data
}

const createPageData = async ({folderName, subfolderName, newFileName, siteName, resourceName}, content) => {
    const apiEndpoint = getCreatePageApiEndpoint({folderName, subfolderName, newFileName, siteName, resourceName})
    const params = { content }
    await axios.post(apiEndpoint, params)
    
    // redirect to new page upon successful creation
    if (folderName) {
        return `/sites/${siteName}/folder/${folderName}/${subfolderName ? `subfolder/${subfolderName}/` : ''}${newFileName}`
    } 
    if (resourceName) {
        return `/sites/${siteName}/resources/${resourceName}/${newFileName}`
    }
    return `/sites/${siteName}/pages/${newFileName}`
}

const renamePageData = async ({folderName, subfolderName, fileName, siteName, resourceName, newFileName}, content, sha) => {
    const apiEndpoint = getRenamePageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName, newFileName})
    const params = {
        content,
        sha,
    };
    await axios.post(apiEndpoint, params)
}

const updatePageData = async ({folderName, subfolderName, fileName, siteName, resourceName}, content, sha) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
    const params = {
        content,
        sha,
    };
    await axios.post(apiEndpoint, params);
    return 
}

const deletePageData = async ({folderName, subfolderName, fileName, siteName, resourceName}, sha) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
    const params = { sha };
    return await axios.delete(apiEndpoint, {
        data: params,
    });
}

// Folder and subfolders
const renameFolder = async ({ siteName, folderName, newFolderName }) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/rename/${newFolderName}`
    return await axios.post(apiUrl)
}

const deleteSubfolder = async ({ siteName, folderName, subfolderName }) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/folders/${folderName}/subfolder/${subfolderName}`
    return await axios.delete(apiUrl)
}

const renameSubfolder = async ({ siteName, folderName, subfolderName, newSubfolderName }) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/folders/${folderName}/subfolder/${subfolderName}/rename/${newSubfolderName}`
    return await axios.post(apiUrl)
}

// Resources
const renameResourceCategory = async ({ siteName, categoryName, newCategoryName}) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${categoryName}/rename/${newCategoryName}`
    return await axios.post(apiUrl)
}

const getAllCategoriesApiEndpoint = ({siteName, isResource}) => {
    if (isResource) {
        return `${BACKEND_URL}/sites/${siteName}/resources`
    }
    return `${BACKEND_URL}/sites/${siteName}/collections`
}

const getAllCategories = async ({siteName, isResource}) => {
    const apiEndpoint = getAllCategoriesApiEndpoint({siteName, isResource})
    const resp = await axios.get(apiEndpoint);
    return resp.data
}

const getAllResourceCategories = async (siteName) => {
    const apiEndpoint = `${BACKEND_URL}/sites/${siteName}/resources`
    const resp = await axios.get(apiEndpoint)
    return resp.data;
}

const addResourceCategory = async (siteName, resourceName) => {
    if (!resourceName) return
    const params = { resourceName }
    return await axios.post(`${BACKEND_URL}/sites/${siteName}/resources`, params);
}

const getPages = async ({ siteName }) => {
    const pagesResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/pages`)
    return pagesResp.data.pages
}

const getResourcePages = async (siteName, resourceName) => {
    if (!resourceName) return
    const apiEndpoint = `${BACKEND_URL}/sites/${siteName}/resources/${resourceName}`
    const resp = await axios.get(apiEndpoint)
    return resp.data;
}

// EditNavBar
const getEditNavBarData = async(siteName) => {
    let navContent, collectionContent, resourceContent, navSha, foldersContent

    const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/navigation`);
    const { content, sha } = resp.data;
    navContent = content
    navSha = sha
    collectionContent = await getAllCategories({siteName, isResource: false})
    resourceContent = await getAllCategories({siteName, isResource: true})
    const foldersResp = await axios.get(`${BACKEND_URL}/sites/${siteName}/folders/all`)
    if (foldersResp.data && foldersResp.data.allFolderContent) {
        // parse directory files
        foldersContent = foldersResp.data.allFolderContent.reduce((acc, currFolder) => {
            const collectionKey = Object.keys(currFolder.content.collections)[0]
            const folderOrder = currFolder.content.collections[collectionKey].order
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

const moveFiles = async (siteName, selectedFiles, title, parentFolder) => {
    const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${parentFolder ? `/collections/${parentFolder}` : '/pages'}`
    const params = {
        files: selectedFiles
    };
    const newPath = encodeURIComponent(`${parentFolder ? `${parentFolder}/` : ''}${title}`)
    return await axios.post(`${baseApiUrl}/move/${newPath}`, params)
}

const moveFile = async ({selectedFile, siteName, resourceName, folderName, subfolderName, newPath}) => {
    const apiEndpoint = getMovePageEndpoint({siteName, resourceName, folderName, subfolderName, newPath})
    const params = {
        files: [selectedFile],
    }
    return await axios.post(apiEndpoint, params)
}

// Images
const getImages = async (siteName, customPath) => {
    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/files/${customPath ? encodeURIComponent(`images/${customPath}`) : 'images'}`);
    const { directoryContents } = resp.data;

    let respImages = []
    let respDirectories = []
    directoryContents.forEach((fileOrDir) => {
        const modifiedFileOrDir = { ...fileOrDir, fileName: fileOrDir.name }
        if (fileOrDir.type === 'file') respImages.push(modifiedFileOrDir)
        if (fileOrDir.type === 'dir') respDirectories.push(modifiedFileOrDir)
    })

    return {
        respImages,
        respDirectories,
    }
}

const createMediaSubfolder = async (siteName, mediaType, customPath) => {
    if (mediaType !== 'images' || !customPath) return
    return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/media/${mediaType}/${encodeURIComponent(customPath)}`)
}

export {
    getDirectoryFile,
    setDirectoryFile,
    getLastUpdated,
    getEditPageData,
    getCsp,
    updatePageData,
    deletePageData,
    renameFolder,
    deleteSubfolder,
    renameSubfolder,
    renameResourceCategory,
    getAllResourceCategories,
    addResourceCategory,
    getPages,
    getResourcePages,
    getEditNavBarData,
    updateNavBarData,
    createPageData,
    renamePageData,
    getAllCategories,
    moveFiles,
    moveFile,
    getImages,
    createMediaSubfolder
}