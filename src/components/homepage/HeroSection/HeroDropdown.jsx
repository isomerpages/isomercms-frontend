import React, { useEffect } from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"

import { useForm, useFieldArray } from "react-hook-form"

import FormField from "components/FormField"
import { HeroOption } from "components/homepage/HeroSection/HeroOption"
import { HeroDropdownSchema } from "components/homepage/HeroSection/HeroDropdownSchema"
import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { yupResolver } from "@hookform/resolvers/yup"

const defaultDropdownOption = {
  title: "Hero Dropdown Element Title",
  url: "", // No default value so that no broken link is created
}

export const HeroDropdown = ({ dropdownContent, onUpdate }) => {
  const {
    register,
    formState: { errors },
    watch,
    control,
    trigger,
  } = useForm({
    defaultValues: dropdownContent,
    resolver: yupResolver(HeroDropdownSchema),
    mode: "onBlur",
  })
  const { append, remove, update } = useFieldArray({
    control,
    name: "options", // key for dropdown array
  })

  /** ****************** */
  /*   useForm effects   */
  /** ****************** */

  watch((data) => onUpdate(data)) // updates parent component (EditorHeroSection) when form values are changed
  useEffect(() => {
    trigger()
  }, []) // triggers validation when component is mounted

  return (
    <div>
      <FormField
        register={register}
        title="Hero dropdown title"
        id="title"
        errorMessage={errors.title?.message}
        isRequired
      />
      <Droppable droppableId="dropdownelem" type="dropdownelem">
        {(droppableProvided) => (
          /* eslint-disable react/jsx-props-no-spreading */
          <div
            className={styles.card}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {watch("options") && watch("options").length > 0 ? (
              <>
                <b>Hero dropdown options</b>
                {watch("options").map((option, dropdownsIndex) => (
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
                          optionContent={option}
                          key={`dropdownelem-${dropdownsIndex}`}
                          dropdownsIndex={dropdownsIndex}
                          deleteHandler={() => remove(dropdownsIndex)}
                          onUpdate={(data) => update(dropdownsIndex, data)}
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
              id={`dropdownelem-create`}
              className={`ml-auto ${elementStyles.blue}`}
              onClick={() => append(defaultDropdownOption)}
            >
              Create dropdown element
            </button>
          </div>
        )}
      </Droppable>
    </div>
  )
}
