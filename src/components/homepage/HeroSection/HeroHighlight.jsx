import React, { useEffect } from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"

import FormField from "components/FormField"
import { HeroOption } from "components/homepage/HeroSection/HeroOption"
import { HeroHighlightSchema } from "components/homepage/HeroSection/HeroHighlightSchema"
import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import { useForm, useFieldArray } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4

const defaultHighlightOption = {
  title: "Key Highlight Title",
  description: "Key Highlight description",
  url: "", // No default value so that no broken link is created
}

export const HeroHighlight = ({ highlightsContent, onUpdate }) => {
  const {
    register,
    formState: { errors },
    control,
    watch,
    trigger,
  } = useForm({
    defaultValues: highlightsContent,
    resolver: yupResolver(HeroHighlightSchema),
    mode: "onBlur",
  })
  const { append, remove, update } = useFieldArray({
    control,
    name: "key_highlights", // key for highlights array
  })

  /** ****************** */
  /*   useForm effects   */
  /** ****************** */

  watch((data) => !_.isEqual(data, highlightsContent) && onUpdate(data)) // updates parent component (EditorHeroSection) when form values are changed
  useEffect(() => {
    trigger()
  }, []) // triggers validation when component is mounted

  return (
    <>
      <FormField
        register={register}
        title="Button name"
        id="button"
        errorMessage={errors.button?.message}
      />
      <FormField
        register={register}
        title="Button url"
        id="url"
        errorMessage={errors.url?.message}
      />
      <Droppable droppableId="highlight" type="highlight">
        {(droppableProvided) => (
          /* eslint-disable react/jsx-props-no-spreading */
          <div
            className={styles.card}
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            {watch("key_highlights") && watch("key_highlights").length > 0 ? (
              <>
                <b>Hero highlights</b>
                {watch("key_highlights").map((highlight, highlightIndex) => (
                  <Draggable
                    draggableId={`highlight-${highlightIndex}-draggable`}
                    index={highlightIndex}
                  >
                    {(draggableProvided) => (
                      <div
                        className={styles.card}
                        key={highlightIndex}
                        {...draggableProvided}
                        ref={draggableProvided.innerRef}
                      >
                        <HeroOption
                          optionContent={highlight}
                          key={`highlight-${highlightIndex}`}
                          dropdownsIndex={highlightIndex}
                          deleteHandler={() => remove(highlightIndex)}
                          onUpdate={(data) => update(highlightIndex, data)}
                          isHighlight
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
              id={`highlight-create`}
              disabled={
                watch("key_highlights") &&
                watch("key_highlights").length >= MAX_NUM_KEY_HIGHLIGHTS
              }
              className={
                watch("key_highlights") &&
                watch("key_highlights").length < MAX_NUM_KEY_HIGHLIGHTS
                  ? `ml-auto ${elementStyles.blue}`
                  : `ml-auto ${elementStyles.disabled}`
              }
              onClick={() => append(defaultHighlightOption)}
            >
              Create highlight
            </button>
          </div>
        )}
      </Droppable>
    </>
  )
}
