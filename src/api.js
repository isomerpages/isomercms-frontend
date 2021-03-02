import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Toast from './components/Toast';

import { DEFAULT_ERROR_TOAST_MSG, parseDirectoryFile, getNavFolderDropdownFromFolderOrder } from './utils';

import elementStyles from './styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getDirectoryFile = async (siteName, folderName, errorCallback) => {
    try {
        return await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`);
    } catch (err) {
        if (err.response && err.response.status === 404) {
            errorCallback()
        } else {
            toast(
                <Toast notificationType='error' text={`There was a problem retrieving data from your repo. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
                {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
            );
        }
        throw err
    }
}

const setDirectoryFile = async (siteName, folderName, payload) => {
    try {
        await axios.post(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`, payload);
        return toast(
            <Toast notificationType='success' text={`Successfully updated page order!`}/>,
            {className: `${elementStyles.toastSuccess}`},
        );
    } catch (err) {
        toast(
            <Toast notificationType='error' text={`Your file reordering could not be saved. Please try again. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
            {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
        );
        throw err
    }
}

const getFolderContents = async (siteName, folderName, subfolderName) => {
    return await axios.get(`${BACKEND_URL}/sites/${siteName}/folders?path=_${folderName}${subfolderName ? `/${subfolderName}` : ''}`);
}

// EditNavBar

const getEditNavBarData = async(siteName) => {
    let navContent, collectionContent, foldersContent, resourceContent, navSha
      try {
        const resp = await axios.get(`${BACKEND_URL}/sites/${siteName}/navigation`);
        const { content, sha } = resp.data;
        navContent = content
        navSha = sha
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

            collectionContent = {
                collections: foldersResp.data.allFolderContent.map((folder) => folder.name),
            }
        }

        if (!navContent) return

        return {
            navContent,
            navSha,
            collectionContent,
            foldersContent,
            resourceContent,
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
            throw {
                status: 404,
                message: err.response.data.message,
            }
        }

        throw err
    }
}

const updateNavBarData = async (siteName, originalNav, links, sha) => {
    try {
        const params = {
            content: {
                ...originalNav,
                links
            },
            sha: sha,
        };
        await axios.post(`${BACKEND_URL}/sites/${siteName}/navigation`, params);
        window.location.reload();
    } catch (err) {
        toast(
          <Toast notificationType='error' text={`There was a problem trying to save your nav bar. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
          {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
        );
        throw err
    }
}

export {
    getDirectoryFile,
    setDirectoryFile,
    getFolderContents,
    getEditNavBarData,
    updateNavBarData,
}