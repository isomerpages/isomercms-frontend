import React from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

import { useFormContext, useFieldArray } from "react-hook-form"

import FormField from "components/FormField"
import { HeroOption } from "components/homepage/HeroSection/HeroOption"
import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"

const defaultDropdownOption = {
  title: "Hero Dropdown Element Title",
  url: "", // No default value so that no broken link is created
}

export const HeroDropdown = ({
  fieldId, // sections.0.hero.dropdown
}) => {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext()

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `${fieldId}.options`, // key for dropdown array
    shouldUnregister: true,
  })
  const sectionErrors = _.get(errors, fieldId)

  return (
    <div>
      <FormField
        register={register}
        title="Hero dropdown title"
        id={`${fieldId}.title`}
        errorMessage={sectionErrors?.title?.message}
        isRequired
      />
      <DragDropContext
        onDragEnd={({ source, destination }) =>
          destination && move(source.index, destination.index)
        }
      >
        <Droppable droppableId="dropdownelem" type="dropdownelem">
          {(droppableProvided) => (
            /* eslint-disable react/jsx-props-no-spreading */
            <div
              className={styles.card}
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {fields && fields.length > 0 ? (
                <>
                  <b>Hero dropdown options</b>
                  {fields.map((option, dropdownsIndex) => (
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
                          <HeroOption
                            fieldId={`${fieldId}.options.${dropdownsIndex}`}
                            key={`dropdownelem-${dropdownsIndex}`}
                            deleteHandler={() => remove(dropdownsIndex)}
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
        id={`dropdownelem-create`}
        className={`ml-auto ${elementStyles.blue}`}
        onClick={() => append(defaultDropdownOption)}
      >
        Create dropdown element
      </button>
    </div>
  )
}
