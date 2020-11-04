import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

const OverviewCard = ({
  title, date, category, settingsToggle, itemIndex, link, 
}) => {
  return (
    <Link className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.card}`} to={link}>
      <div id={itemIndex} className={contentStyles.componentInfo}>
        <div className={contentStyles.componentCategory}>{category ? category : ''}</div>
        <h1 className={contentStyles.componentTitle}>{title}</h1>
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
  link: PropTypes.string.isRequired,
};

export default OverviewCard