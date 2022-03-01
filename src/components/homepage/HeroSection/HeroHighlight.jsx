import FormField from "components/FormField"
import { HeroOption } from "components/homepage/HeroSection/HeroOption"
import React from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useFormContext, useFieldArray } from "react-hook-form"

import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4

const defaultHighlightOption = {
  title: "Key Highlight Title",
  description: "Key Highlight description",
  url: "", // No default value so that no broken link is created
}

export const HeroHighlight = ({
  fieldId, // sections.0.hero
}) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext()
  const { fields, move, append, remove } = useFieldArray({
    control,
    name: `${fieldId}.key_highlights`, // key for highlights array
  })
  const sectionErrors = _.get(errors, fieldId)
  return (
    <>
      <FormField
        register={register}
        title="Button name"
        id={`${fieldId}.button`}
        errorMessage={sectionErrors?.button?.message}
      />
      <FormField
        register={register}
        title="Button url"
        id={`${fieldId}.url`}
        errorMessage={sectionErrors?.url?.message}
      />
      <DragDropContext
        onDragEnd={({ source, destination }) =>
          destination && move(source.index, destination.index)
        }
      >
        <Droppable droppableId="highlight" type="highlight">
          {(droppableProvided) => (
            /* eslint-disable react/jsx-props-no-spreading */
            <div
              className={styles.card}
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {fields.length > 0 ? (
                <>
                  <b>Hero highlights</b>
                  {fields.map((highlight, highlightIndex) => (
                    <Draggable
                      draggableId={`highlight-${highlightIndex}-draggable`}
                      index={highlightIndex}
                    >
                      {(draggableProvided) => (
                        <div
                          className={styles.card}
                          key={highlightIndex}
                          {...draggableProvided.draggableProps}
                          {...draggableProvided.dragHandleProps}
                          ref={draggableProvided.innerRef}
                        >
                          <HeroOption
                            fieldId={`${fieldId}.key_highlights.${highlightIndex}`}
                            key={`highlight-${highlightIndex}`}
                            deleteHandler={() => remove(highlightIndex)}
                            isHighlight
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </>
              ) : null}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <button
        type="button"
        id="highlight-create"
        disabled={fields && fields.length >= MAX_NUM_KEY_HIGHLIGHTS}
        className={
          fields && fields.length < MAX_NUM_KEY_HIGHLIGHTS
            ? `ml-auto ${elementStyles.blue}`
            : `ml-auto ${elementStyles.disabled}`
        }
        onClick={() => append(defaultHighlightOption)}
      >
        Create highlight
      </button>
    </>
  )
}

HeroHighlight.propTypes = {
  fieldId: PropTypes.string.isRequired,
}
