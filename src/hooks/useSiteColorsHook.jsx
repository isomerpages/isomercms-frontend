import React, { useState } from 'react';

// Utils
import { defaultSiteColors, getSiteColors, createPageStyleSheet } from '../utils/siteColorUtils';

const useSiteColorsHook = () => {
    const [siteColors, setSiteColors] = useState(defaultSiteColors)

    const retrieveSiteColors = async (siteName) => {
        if (!siteColors[siteName]) {
            const {
                primaryColor,
                secondaryColor,
            } = await getSiteColors(siteName)
    
            setSiteColors((prevState) => ({
                ...prevState,
                [siteName]: {
                    primaryColor,
                    secondaryColor,
                }
            }))
        }
    }

    const generatePageStyleSheet = (siteName) => {
        let primaryColor = defaultSiteColors.default.primaryColor
        let secondaryColor = defaultSiteColors.default.secondaryColor

        if (siteColors[siteName]) {
            const {
                primaryColor: sitePrimaryColor,
                secondaryColor: siteSecondaryColor,
            } = siteColors[siteName]
            primaryColor = sitePrimaryColor
            secondaryColor = siteSecondaryColor
        }

        createPageStyleSheet(siteName, primaryColor, secondaryColor)
    }

    return [
        siteColors,
        retrieveSiteColors,
        generatePageStyleSheet,
    ]
}

export default useSiteColorsHook;