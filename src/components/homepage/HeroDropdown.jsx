import { Button, IconButton } from "@opengovsg/design-system-react"
import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"
import { Droppable, Draggable } from "react-beautiful-dnd"

import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"

/* eslint
  react/no-array-index-key: 0
 */

const HeroDropdownElem = ({
  title,
  url,
  dropdownsIndex,
  onFieldChange,
  deleteHandler,
  shouldDisplay,
  displayHandler,
  errors,
}) => (
  <div className={elementStyles.card}>
    <div className={elementStyles.cardHeader}>
      <h2>{title}</h2>
      <IconButton
        variant="clear"
        id={`dropdownelem-${dropdownsIndex}-toggle`}
        onClick={displayHandler}
      >
        <i
          className={`bx ${
            shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
          }`}
          id={`dropdownelem-${dropdownsIndex}-icon`}
        />
      </IconButton>
    </div>
    {shouldDisplay ? (
      <>
        <div className={elementStyles.cardContent}>
          <FormContext isRequired hasError={!!errors.title}>
            <FormTitle>Dropdown element title</FormTitle>
            <FormField
              placeholder="Dropdown element title"
              id={`dropdownelem-${dropdownsIndex}-title`}
              value={title}
              onChange={onFieldChange}
            />
            <FormError>{errors.title}</FormError>
          </FormContext>
          <FormContext isRequired hasError={!!errors.url}>
            <FormTitle>Dropdown element URL</FormTitle>
            <FormField
              placeholder="Dropdown element URL"
              id={`dropdownelem-${dropdownsIndex}-url`}
              value={url}
              onChange={onFieldChange}
            />
            <FormError>{errors.url}</FormError>
          </FormContext>
        </div>
        <div className={elementStyles.inputGroup}>
          <Button
            w="100%"
            colorScheme="danger"
            id={`dropdownelem-${dropdownsIndex}-delete`}
            onClick={deleteHandler}
          >
            Delete dropdown option
          </Button>
        </div>
      </>
    ) : null}
  </div>
)

const HeroDropdown = ({
  title,
  options,
  createHandler,
  deleteHandler,
  onFieldChange,
  displayHandler,
  displayDropdownElems,
  errors,
}) => (
  <div>
    <FormContext isRequired hasError={!!errors.sections[0].hero.dropdown}>
      <FormTitle>Hero dropdown title</FormTitle>
      <FormField
        placeholder="Hero dropdown title"
        id="dropdown-title"
        value={title}
        onChange={onFieldChange}
      />
      <FormError>{errors.sections[0].hero.dropdown}</FormError>
    </FormContext>
    <Droppable droppableId="dropdownelem" type="dropdownelem">
      {(droppableProvided) => (
        /* eslint-disable react/jsx-props-no-spreading */
        <div
          className={styles.card}
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
        >
          {options && options.length > 0 ? (
            <>
              <b>Hero dropdown options</b>
              {options.map((option, dropdownsIndex) => (
                <Draggable
                  draggableId={`dropdownelem-${dropdownsIndex}-draggable`}
                  index={dropdownsIndex}
                >
                  {(draggableProvided) => (
                    <div
                      className={styles.card}
                      key={dropdownsIndex}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                    >
                      <HeroDropdownElem
                        key={`dropdownelem-${dropdownsIndex}`}
                        title={option.title}
                        url={option.url}
                        dropdownsIndex={dropdownsIndex}
                        onFieldChange={onFieldChange}
                        deleteHandler={deleteHandler}
                        createHandler={createHandler}
                        displayHandler={displayHandler}
                        shouldDisplay={displayDropdownElems[dropdownsIndex]}
                        errors={errors.dropdownElems[dropdownsIndex]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </>
          ) : null}
          {droppableProvided.placeholder}
          <Button
            id={`dropdownelem-${options.length}-create`}
            onClick={createHandler}
          >
            Add dropdown option
          </Button>
        </div>
      )}
    </Droppable>
  </div>
)

export default HeroDropdown

HeroDropdownElem.propTypes = {
  title: PropTypes.string,
  url: PropTypes.string,
  dropdownsIndex: PropTypes.number,
  onFieldChange: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    title: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
}

HeroDropdown.propTypes = {
  title: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displayDropdownElems: PropTypes.arrayOf(PropTypes.bool),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      dropdownsIndex: PropTypes.number,
      onFieldChange: PropTypes.func.isRequired,
      shouldDisplay: PropTypes.bool.isRequired,
      displayHandler: PropTypes.func.isRequired,
    })
  ).isRequired,
  errors: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        hero: PropTypes.shape({
          dropdown: PropTypes.string,
        }),
      })
    ),
    dropdownElems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }).isRequired,
}
