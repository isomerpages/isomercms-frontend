import React from 'react';
import PropTypes from 'prop-types';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import FormField from '../FormField';
import ContactFields from './ContactFields';

/* eslint
  react/no-array-index-key: 0
 */

const EditorContactCard = ({
  title,
  content,
  cardIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  errors,
}) => {
  return (
  <div className={`${elementStyles.card} move`}>
    <div className={elementStyles.cardHeader}>
      <h2>
        {title}
      </h2>
      <button type="button" id={`contact-${cardIndex}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`contact-${cardIndex}-icon`} />
      </button>
    </div>
    { shouldDisplay
      ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Title"
              id={`contact-${cardIndex}-title`}
              value={title}
              onFieldChange={onFieldChange}
            />
            <ContactFields
              cardIndex={cardIndex} 
              content={content}
              onFieldChange={onFieldChange}
            />
          </div>
          <div className={`${elementStyles.inputGroup} pt-5`}>
            <button type="button" id={`contact-${cardIndex}`} className={`btn-block ${elementStyles.warning}`} onClick={deleteHandler}>Delete section</button>
          </div>
        </>
      )
      : null}
  </div>
)};

export default EditorContactCard;

EditorContactCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.arrayOf(
    PropTypes.shape({
      phone: PropTypes.string,
    }),
    PropTypes.shape({
      email: PropTypes.string,
    }),
    PropTypes.shape({
      other: PropTypes.string,
    }),
  ),
  cardIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
};
