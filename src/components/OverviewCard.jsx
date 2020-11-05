import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

// Import utils
import {
  prettifyCollectionPageFileName,
  prettifyPageFileName,
  retrieveResourceFileMetadata,
} from '../utils';

const OverviewCard = ({
  date, category, settingsToggle, itemIndex, siteName, fileName, isResource, isHomepage
}) => {
  const generateLink = () => {
    if (isResource) {
      return `/sites/${siteName}/resources/${category}/${fileName}`
    } else if (isHomepage) {
      return `/sites/${siteName}/homepage`
    } else {
      if (category) {
        return `/sites/${siteName}/collections/${category}/${fileName}`
      } else {
        return `/sites/${siteName}/pages/${fileName}`
      }
    }
  }

  const generateTitle = () => {
    let title
    if (isResource) {
      title = retrieveResourceFileMetadata(fileName).title
    } else {
      if (category) {
        title = prettifyCollectionPageFileName(fileName)
      } else {
        title = prettifyPageFileName(fileName)
      }
    }
    return title
  }

  return (
    <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`} to={generateLink()}>
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <div className={contentStyles.componentCategory}>{category ? category : ''}</div>
        <h1 className={contentStyles.componentTitle}>{generateTitle()}</h1>
        <p className={contentStyles.componentDate}>{date ? date : ''}</p>
      </div>
      {settingsToggle &&
        <div className={contentStyles.componentIcon}>
          <button
            type="button"
            id={`settings-${itemIndex}`}
            onClick={(e) => {
              e.preventDefault(); 
              settingsToggle(e)}}
            className={contentStyles.componentIcon}
          >
            <i id={`settingsIcon-${itemIndex}`} className="bx bx-cog" />
          </button>
        </div>
      }
    </Link>
  );
};


OverviewCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string,
  category: PropTypes.string,
  settingsToggle: PropTypes.func,
  itemIndex: PropTypes.number.isRequired,
  siteName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isResource: PropTypes.bool,
};

export default OverviewCard