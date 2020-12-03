import axios from 'axios';
import React from 'react';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { toast } from 'react-toastify';
import Toast from '../components/Toast';

// axios settings
axios.defaults.withCredentials = true

export const retrieveThirdNavOptions = async (siteName, collectionName, isExistingCollection) => {
    try {
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
    } catch (err) {
        toast(
            <Toast notificationType='error' text={`There was a problem trying to retrieve data from your repo. Please try again or check your internet connection.`}/>,
            {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
          );
        console.log(err);
    }
}
