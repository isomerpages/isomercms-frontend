import axios from 'axios';
import { Base64 } from 'js-base64';
import {
    getNavFolderDropdownFromFolderOrder,
    parseDirectoryFile,
    generateResourceFileName,
    concatFrontMatterMdBody,
    frontMatterParser,
} from './utils';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getDirectoryFile = async (siteName, folderName) => {
    if (!folderName) return
    return await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`);
}

const setDirectoryFile = async (siteName, folderName, payload) => {
    return await axios.post(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`, payload);
}

const getFolderContents = async (siteName, folderName, subfolderName) => {
    return await axios.get(`${BACKEND_URL}/sites/${siteName}/folders?path=_${folderName}${subfolderName ? `/${subfolderName}` : ''}`);
}

// Move files
const moveUnlinkedPage = async ({ siteName, fileName, newFolderName }) => {
    const apiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/pages/move/${newFolderName}`
    const params = {
        files: [fileName]
    }
    await axios.post(apiUrl, params)
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

const getEditPageData = async ({folderName, subfolderName, fileName, siteName, resourceName}) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
    const resp = await axios.get(apiEndpoint);
    const { content:pageContent, sha:pageSha } = resp.data;
    
    if (!pageContent) return

    return {
        pageContent,
        pageSha,
    }
}

const getCsp = async (siteName) => {
    // retrieve CSP
    return await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`);
}

const updatePageData = async ({folderName, subfolderName, fileName, siteName, resourceName}, content, sha) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
    const params = {
        content,
        sha,
    };
    return await axios.post(apiEndpoint, params);
}

const deletePageData = async ({folderName, subfolderName, fileName, siteName, resourceName}, sha) => {
    const apiEndpoint = getPageApiEndpoint({folderName, subfolderName, fileName, siteName, resourceName})
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

const getPage = async (pageType, siteName, collectionName, pageName) => {
    const endpointUrl = (pageType === 'collection') 
                      ? `${siteName}/collections/${collectionName}/pages/${pageName}`
                      : `${siteName}/pages/${pageName}`
    const resp = await axios.get(`${BACKEND_URL}/sites/${endpointUrl}`);
    return resp.data
}

const updatePage = async(endpointUrl, content, sha) => {
    return await axios.post(`${BACKEND_URL}/sites/${endpointUrl}`, { content, sha });
}

const deletePage = async(endpointUrl, sha) => {
    return
    // return await axios.delete(`${BACKEND_URL}/sites/${endpointUrl}`, { content, sha });
}

const moveFiles = async (siteName, selectedFiles, title, parentFolder) => {
    const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${parentFolder ? `/collections/${parentFolder}` : '/pages'}`
    const params = {
        files: selectedFiles
    };
    const newPath = encodeURIComponent(`${parentFolder ? `${parentFolder}/` : ''}${title}`)
    return await axios.post(`${baseApiUrl}/move/${newPath}`, params)
}

// Resource pages
const createNewResourcePage = async ({ content, pageName, siteName, category }) => {
    const params = {
        content,
        pageName,
    };
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages`, params);
}

const getResourcePage = async ({ siteName, category, fileName }) => {
    const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`)
    const { content, sha: fileSha } = resp.data;
    const base64DecodedContent = Base64.decode(content);
    const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);
    return {
        fileSha,
        frontMatter,
        mdBody,
    }
}

const updateResourcePage = async ({ sha, content, siteName, category, fileName }) => {
    const params = {
        sha,
        content,
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, params);
}

const deleteResourcePage = async ({ sha, siteName, category, fileName }) => {
    const params = {
        data: {
          sha,
        },
    }
    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}/pages/${fileName}`, params);
}

const saveResourcePage = async (fileInfo) => {
    const {
      category,
      date,
      fileUrl,
      mdBody,
      permalink,
      resourceType,
      sha,
      title,
      fileName,
      isNewFile,
      siteName,
    } = fileInfo

    const newFileName = generateResourceFileName(title.toLowerCase(), date, resourceType);
    const frontMatter = { title, date };

    if (permalink) {
      frontMatter.permalink = permalink;
    }

    if (fileUrl) {
      frontMatter.file_url = fileUrl;
    }

    const content = concatFrontMatterMdBody(frontMatter, mdBody);
    const base64EncodedContent = Base64.encode(content);

    if (newFileName !== fileName) {
      // We'll need to create a new .md file with a new filename
      await createNewResourcePage({
        content: base64EncodedContent,
        pageName: newFileName,
        siteName,
        category,
      });

      // If it is an existing file, delete the existing page
      if (!isNewFile) {
        await deleteResourcePage({ sha, siteName, category, fileName})
      }
    } else {
      // Save to existing .md file
      await updateResourcePage({
        content: base64EncodedContent,
        sha,
        siteName,
        category,
        fileName,
      })
    }

    let newPageUrl
    if (resourceType === 'file') {
      newPageUrl = `/sites/${siteName}/resources/${category}`
    } else {
      newPageUrl = `/sites/${siteName}/resources/${category}/${newFileName}`
    }

    return newPageUrl
}

export {
    getDirectoryFile,
    setDirectoryFile,
    getFolderContents,
    moveUnlinkedPage,
    getEditPageData,
    getCsp,
    updatePageData,
    deletePageData,
    getEditNavBarData,
    updateNavBarData,
    createPage,
    getPage,
    updatePage,
    deletePage,
    moveFiles,
    getResourcePage,
    saveResourcePage,
}