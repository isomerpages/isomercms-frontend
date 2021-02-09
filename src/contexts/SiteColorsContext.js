import { createContext } from 'react';

// Utils
import { defaultSiteColors } from '../utils/siteColorUtils';

export const SiteColorsContext = createContext({
    siteColors: defaultSiteColors,
    setSiteColors: () => {},
});
