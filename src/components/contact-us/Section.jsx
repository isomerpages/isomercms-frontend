import React from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styles from '../../styles/App.module.scss';
import elementStyles from '../../styles/isomer-cms/Elements.module.scss';
import EditorContactCard from './ContactCard';
import EditorLocationCard from './LocationCard';
import _ from 'lodash';
import EditorLocationSection from './LocationCard';

/* eslint
  react/no-array-index-key: 0
 */


const EditorSection = ({
  cards,
  onFieldChange,
  createHandler,
  deleteHandler,
  sectionType,
  shouldDisplay,
  displayCards,
  displayHandler,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>{`${_.upperFirst(sectionType)} section`}</h2>
      <button type="button" id={`section-${sectionType}`} onClick={displayHandler}>
        <i className={`bx ${shouldDisplay ? 'bx-chevron-down' : 'bx-chevron-right'}`} id={`section-${sectionType}-icon`} />
      </button>
    </div>
    {shouldDisplay
      ? (
        <>
          <Droppable droppableId={sectionType} type={sectionType}>
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
                        draggableId={`${sectionType}-${cardIndex}-draggable`}
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
                            { sectionType === 'contact' 
                              ? 
                              <EditorContactCard
                                title={card.title}
                                content={card.content}
                                cardIndex={cardIndex}
                                deleteHandler={deleteHandler}
                                onFieldChange={onFieldChange}
                                shouldDisplay={displayCards[cardIndex]}
                                displayHandler={displayHandler}
                              />
                              : 
                              <EditorLocationCard
                                title={card.title}
                                address={card.address}
                                operatingHours={card.operating_hours}
                                mapUrl={card.maps_link}
                                cardIndex={cardIndex}
                                deleteHandler={deleteHandler}
                                onFieldChange={onFieldChange}
                                shouldDisplay={displayCards[cardIndex]}
                                displayHandler={displayHandler}
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
            <button type="button" id={`${sectionType}`} className={`btn-block ${elementStyles.blue}`} onClick={createHandler}>{`Add ${sectionType}`}</button>
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
  sectionType: PropTypes.string.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayCards: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
  displayHandler: PropTypes.func.isRequired,
};