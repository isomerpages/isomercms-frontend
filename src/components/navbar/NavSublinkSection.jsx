import React from "react"
import PropTypes from "prop-types"
import { Droppable, Draggable } from "react-beautiful-dnd"
import styles from "../../styles/App.module.scss"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import FormField from "../FormField"
import { isEmpty } from "../../utils"

const SublinkElem = ({
  title,
  url,
  linkIndex,
  sublinkIndex,
  onFieldChange,
  deleteHandler,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div
    className={`${elementStyles.navCard} ${
      !shouldDisplay && !isEmpty(errors) ? elementStyles.error : ""
    }`}
  >
    <div className={elementStyles.cardHeader}>
      <h2>{title}</h2>
      <button
        type="button"
        id={`sublink-${linkIndex}-${sublinkIndex}-toggle`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`sublink-${linkIndex}-${sublinkIndex}-icon`}
        />
      </button>
    </div>
    {shouldDisplay ? (
      <>
        <div className={elementStyles.cardContent}>
          <FormField
            title="Submenu title"
            id={`sublink-${linkIndex}-${sublinkIndex}-title`}
            value={title}
            isRequired
            onFieldChange={onFieldChange}
            errorMessage={errors.title}
          />
          <FormField
            title="Submenu URL"
            id={`sublink-${linkIndex}-${sublinkIndex}-url`}
            value={url}
            isRequired
            onFieldChange={onFieldChange}
            errorMessage={errors.url}
          />
        </div>
        <div className={elementStyles.inputGroup}>
          <button
            type="button"
            id={`sublink-${linkIndex}-${sublinkIndex}-delete`}
            className={`ml-auto ${elementStyles.warning}`}
            onClick={deleteHandler}
          >
            Delete Submenu
          </button>
        </div>
      </>
    ) : null}
  </div>
)

const NavSublinkSection = ({
  linkIndex,
  sublinks,
  createHandler,
  deleteHandler,
  onFieldChange,
  displayHandler,
  displaySublinks,
  errors,
}) => (
  <Droppable droppableId={`sublink-${linkIndex}`} type="sublink">
    {(droppableProvided) => (
      /* eslint-disable react/jsx-props-no-spreading */
      <div
        className={styles.card}
        ref={droppableProvided.innerRef}
        {...droppableProvided.droppableProps}
      >
        {sublinks && sublinks.length > 0 ? (
          <>
            <b>Submenu</b>
            {sublinks.map((sublink, sublinkIndex) => (
              <Draggable
                draggableId={`sublink-${linkIndex}-${sublinkIndex}-draggable`}
                key={`sublink-${linkIndex}-${sublinkIndex}-draggable`}
                index={sublinkIndex}
              >
                {(draggableProvided) => (
                  <div
                    className={styles.card}
                    key={sublinkIndex}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                  >
                    <SublinkElem
                      key={`sublink-${linkIndex}-${sublinkIndex}`}
                      title={sublink.title}
                      url={sublink.url}
                      linkIndex={linkIndex}
                      sublinkIndex={sublinkIndex}
                      onFieldChange={onFieldChange}
                      deleteHandler={deleteHandler}
                      displayHandler={displayHandler}
                      shouldDisplay={displaySublinks[sublinkIndex]}
                      errors={errors[sublinkIndex]}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          </>
        ) : null}
        {droppableProvided.placeholder}
        <button
          type="button"
          id={`sublink-${linkIndex}-${sublinks.length}-create`}
          className={`ml-auto mt-4 ${elementStyles.blue}`}
          onClick={createHandler}
        >
          Create Submenu
        </button>
      </div>
    )}
  </Droppable>
)

export default NavSublinkSection

SublinkElem.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  linkIndex: PropTypes.number.isRequired,
  sublinkIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  }),
}

NavSublinkSection.propTypes = {
  linkIndex: PropTypes.number,
  sublinks: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displaySublinks: PropTypes.arrayOf(PropTypes.bool),
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    })
  ),
}
