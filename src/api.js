import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Toast from './components/Toast';

import { DEFAULT_ERROR_TOAST_MSG } from './utils';

import elementStyles from './styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

// Constants
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const getDirectoryFile = async (siteName, folderName) => {
    try {
        return await axios.get(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`);
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

const setDirectoryFile = async (siteName, folderName, payload) => {
    try {
        return await axios.post(`${BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`, payload);
    } catch (err) {
        // if need be, add custom error handling here
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
        foldersContent = foldersResp.data
        
        if (foldersContent && foldersContent.allFolderContent) {
            collectionContent = {
                collections: foldersContent.allFolderContent.map((folder) => folder.name.slice(1)),
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