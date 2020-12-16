import axios from 'axios';

// axios settings
axios.defaults.withCredentials = true

const DEFAULT_ISOMER_PRIMARY_COLOR = '#6031b6';
const DEFAULT_ISOMER_SECONDARY_COLOR = '#4372d6';

const defaultSiteColors = {
    defult: {
        primaryColor: DEFAULT_ISOMER_PRIMARY_COLOR,
        secondaryColor: DEFAULT_ISOMER_SECONDARY_COLOR,
    }
}

const getStyleSheet = (unique_title) => {
    for(let i=0; i<document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      if(sheet.title == unique_title) {
        return sheet;
      }
    }
}

const createPageStyleSheet = (repoName, primaryColor, secondaryColor) => {
    const styleElement = document.createElement('style')
    const styleTitle = `${repoName}-style`
    styleElement.setAttribute('id', styleTitle)
    styleElement.setAttribute('title', styleTitle)
    document.head.appendChild(styleElement);
  
    const customStyleSheet = getStyleSheet(styleTitle)
  
    // breadcrumb - primary color
    customStyleSheet.insertRule(`.bp-section.bp-section-pagetitle { background-color: ${primaryColor} !important;}`, 0);
  
    // headings
    customStyleSheet.insertRule(`.content h1 strong { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.content h2 strong { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.content h3 strong { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.content h4 strong { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.content h5 strong { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.has-text-secondary { color: ${secondaryColor} !important;}`, 0);
  
    // left nav
    customStyleSheet.insertRule(`.bp-menu-list a.is-active { color: ${secondaryColor} !important; border-bottom: 2px solid ${secondaryColor} !important}`, 0);
    customStyleSheet.insertRule(`.bp-menu-list a.is-active:hover { color: ${secondaryColor} !important; border-bottom: 2px solid ${secondaryColor} !important}`, 0);
    customStyleSheet.insertRule(`.bp-menu-list a:hover { color: ${secondaryColor} !important; border-bottom: 2px solid ${secondaryColor} !important}`, 0);
    customStyleSheet.insertRule(`.sgds-icon-chevron-up:before { color: ${secondaryColor} !important;}`, 0);
    customStyleSheet.insertRule(`.sgds-icon-chevron-down:before { color: ${secondaryColor} !important;}`, 0);
}

const getSiteColors = async (siteName) => {
    try {
        // get settings data from backend
        const settingsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/settings`);
        const { settings } = settingsResp.data;
        const { configFieldsRequired: { colors } } = settings;

        return {
            primaryColor: colors?.['primary-color'] || DEFAULT_ISOMER_PRIMARY_COLOR,
            secondaryColor: colors?.['secondary-color'] || DEFAULT_ISOMER_SECONDARY_COLOR,
        }
    } catch (err) {
        console.log(err);
        throw err
    }
}

export {
    defaultSiteColors,
    createPageStyleSheet,
    getSiteColors,
}