import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import EditorContactCard from './ContactCard';
import EditorLocationCard from './LocationCard';
import _ from 'lodash';
import { isEmpty } from '../../utils';

/* eslint
  react/no-array-index-key: 0
 */


const EditorSection = ({
  cards,
  onFieldChange,
  createHandler,
  deleteHandler,
  shouldDisplay,
  displayCards,
  displayHandler,
  errors,
  sectionId,
}) => (
  <div className={`${elementStyles.card} ${!shouldDisplay && !isEmpty(errors) ? elementStyles.error : ''}`}>
    <div className={elementStyles.cardHeader}>
      <h2>{`${_.upperFirst(sectionId)} section`}</h2>
      <button type="button" id={`section-${sectionId}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionId}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <Droppable droppableId={sectionId} type={sectionId}>
            {(droppableProvided) => (
              /* eslint-disable react/jsx-props-no-spreading */
              <div
                className={styles.card}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {cards && cards.length > 0 && (
                  <>
                    { cards.map((card, cardIndex) => (
                      <Draggable
                        draggableId={`${sectionId}-${cardIndex}-draggable`}
                        index={cardIndex}
                      >
                        {(draggableProvided) => (
                          <div
                            className={styles.card}
                            key={cardIndex}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            ref={draggableProvided.innerRef}
                          >
                            { sectionId=== 'contacts' 
                              ? 
                              <EditorContactCard
                                title={card.title}
                                content={card.content}
                                cardIndex={cardIndex}
                                deleteHandler={(event)=>deleteHandler(event, sectionId)}
                                onFieldChange={onFieldChange}
                                shouldDisplay={displayCards[cardIndex]}
                                displayHandler={displayHandler}
                                cardErrors={errors[cardIndex]}
                                sectionId={sectionId}
                              />
                              : 
                              <EditorLocationCard
                                title={card.title}
                                address={card.address}
                                operatingHours={card.operating_hours}
                                mapUrl={card.maps_link}
                                cardIndex={cardIndex}
                                deleteHandler={(event)=>deleteHandler(event, sectionId)}
                                onFieldChange={onFieldChange}
                                shouldDisplay={displayCards[cardIndex]}
                                displayHandler={displayHandler}
                                cardErrors={errors[cardIndex]}
                                sectionId={sectionId}
                              />
                            }
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                )}
                {droppableProvided.placeholder}
              </div>  
            )}
          </Droppable>
          <div className={`${elementStyles.inputGroup} pt-5`}>
            <button type="button" id={`${sectionId}`} className={`btn-block ${elementStyles.blue}`} onClick={createHandler}>{`Add ${sectionId}`}</button>
          </div>
        </>
      )
      : null}
  </div>
);

export default EditorSection;

EditorSection.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
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
      }),
      PropTypes.shape({
        title: PropTypes.string,
        address: PropTypes.arrayOf(PropTypes.string),
        operatingHours: PropTypes.arrayOf(
          PropTypes.shape({
            days: PropTypes.string,
            time: PropTypes.string,
            description: PropTypes.string,
          }),
        ),
        mapUrl: PropTypes.string,
      }),
    ])
  ),
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  sectionId: PropTypes.string.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayCards: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
  displayHandler: PropTypes.func.isRequired,
};