import _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect, createRef, useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"

import DeleteWarningModal from "components/DeleteWarningModal"
import Header from "components/Header"
import { EditorHeroSection } from "components/homepage/EditorHeroSection"
import { EditorInfobarSection } from "components/homepage/EditorInfobarSection"
import { EditorInfopicSection } from "components/homepage/EditorInfopicSection"
import { NewSectionCreator } from "components/homepage/NewSectionCreator"
import { EditorResourcesSection } from "components/homepage/EditorResourcesSection"
import LoadingButton from "components/LoadingButton"

import TemplateHeroSection from "templates/homepage/HeroSection"
import TemplateInfobarSection from "templates/homepage/InfobarSection"
import TemplateInfopicLeftSection from "templates/homepage/InfopicLeftSection"
import TemplateInfopicRightSection from "templates/homepage/InfopicRightSection"
import TemplateResourcesSection from "templates/homepage/ResourcesSection"
import {
  useGetConfigHook,
  useUpdateConfigHook,
  useSiteColorsHook,
} from "hooks/settingsHooks"

// Isomer components
import { createPageStyleSheet } from "utils/siteColorUtils"

import { yupResolver } from "@hookform/resolvers/yup"

import "styles/isomer-template.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

import { EditorHeroSchema } from "components/homepage/EditorHeroSection"
import { EditorInfopicSchema } from "components/homepage/EditorInfopicSection"
import { EditorInfobarSchema } from "components/homepage/EditorInfobarSection"
import { EditorResourcesSchema } from "components/homepage/EditorResourcesSection"

import * as Yup from "yup"
// Constants
// ==========
const RADIX_PARSE_INT = 10

const EditHomepageSchema = Yup.object().shape({
  sections: Yup.array().of(
    Yup.lazy((value) => {
      const key = Object.keys(value).find((k) => k !== "id")
      switch (key) {
        case "hero":
          return EditorHeroSchema
        case "infobar":
          return EditorInfobarSchema
        case "infopic":
          return EditorInfopicSchema
        case "resources":
          return EditorResourcesSchema
        default:
          return EditorHeroSchema
      }
    })
  ),
  notification: Yup.string(),
})

const EditHomepage = ({ match, location }) => {
  const { params, decodedParams } = match

  const { siteName } = match.params
  const [originalFrontMatter, setOriginalFrontMatter] = useState({})
  const [hasResources, setHasResources] = useState(false)

  const [hasChanged, setHasChanged] = useState(false)

  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: "",
    type: "",
  })

  const methods = useForm({
    resolver: yupResolver(EditHomepageSchema),
    mode: "onBlur",
  })
  const {
    watch,
    control,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = methods

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  })
  const {
    fields: scrollRefs,
    append: appendRefs,
    remove: removeRefs,
    move: moveRefs,
  } = useFieldArray({
    control,
    name: "scrollRefs",
  })

  const { data: siteColorsData } = useSiteColorsHook(params)
  const { data: homepageData } = useGetConfigHook({
    ...params,
    isHomepage: true,
  })
  const { mutateAsync: updateHandler } = useUpdateConfigHook({
    ...params,
    isHomepage: true,
  })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (homepageData && watch("sections").length === 0) {
      const {
        frontMatter: { notification, sections },
      } = homepageData.content
      setValue("notification", notification)
      setValue("sections", sections)

      sections.forEach((section) => {
        if (section.hero) {
          if (
            section.hero.key_highlights ||
            section.hero.button ||
            section.hero.url
          )
            setValue(`sections.0.hero.heroType`, "highlights")
          else if (section.hero.dropdown)
            setValue(`sections.0.hero.heroType`, "dropdown")
          else setValue(`sections.0.hero.heroType`, "none")
        }
        if (section.resources) setHasResources(true)
        appendRefs(createRef())
      })

      setOriginalFrontMatter({
        notification: _.clone(notification),
        sections: _.cloneDeep(sections),
      })
    }
  }, [homepageData])

  useEffect(() => {
    if (siteColorsData)
      createPageStyleSheet(
        siteName,
        siteColorsData.primaryColor,
        siteColorsData.secondaryColor
      )
  }, [siteColorsData])

  useEffect(() => {
    setHasChanged(
      originalFrontMatter.notification !== watch("notification") ||
        JSON.stringify(originalFrontMatter.sections) !==
          JSON.stringify(watch("sections"))
    )
  }, [watch()])

  const createHandler = async (event) => {
    try {
      const { value, id } = event.target
      if (id === "resources") {
        setHasResources(true)
      }
      append(value)
      appendRefs(createRef())
      scrollRefs[scrollRefs.length - 1].current.scrollIntoView()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split(".")
      const sectionIndex = parseInt(idArray[1], RADIX_PARSE_INT)

      // Set hasResources to false to allow users to create a resources section
      if (fields[sectionIndex].resources) {
        setHasResources(false)
      }
      remove(sectionIndex)
      removeRefs(sectionIndex)
    } catch (err) {
      console.log(err)
    }
  }

  const onSubmit = (data) => {
    const { notification, sections } = data

    const filteredSections = sections.map((section) => {
      const newSection = {}
      for (const sectionName in section) {
        if (sectionName !== "id")
          // filter out useFieldArray's id
          newSection[sectionName] = _.cloneDeep(
            _.omitBy(section[sectionName], _.isEmpty)
          )
      }
      return newSection
    })
    return updateHandler({
      ...homepageData,
      content: {
        frontMatter: {
          ...homepageData.content.frontMatter,
          notification,
          sections: filteredSections,
        },
      },
    })
  }

  const onDragEnd = ({ source, destination }) => {
    // If the user dropped the draggable to no known droppable
    if (!destination) return

    move(source.index, destination.index)
    moveRefs(source.index, destination.index)
    scrollRefs[destination.index].current.scrollIntoView()
  }

  const isLeftInfoPic = (sectionIndex) => {
    // If the previous section in the list was not an infopic section
    // or if the previous section was a right infopic section, return true
    if (!fields[sectionIndex - 1].infopic || !isLeftInfoPic(sectionIndex - 1))
      return true

    return false
  }

  return (
    <FormProvider {...methods}>
      {itemPendingForDelete.id && (
        <DeleteWarningModal
          onCancel={() => setItemPendingForDelete({ id: null, type: "" })}
          onDelete={() => {
            deleteHandler(itemPendingForDelete.id)
            setItemPendingForDelete({ id: null, type: "" })
          }}
          type={itemPendingForDelete.type}
        />
      )}
      <Header
        siteName={siteName}
        title="Homepage"
        shouldAllowEditPageBackNav={!hasChanged}
        isEditPage
        backButtonText="Back to My Workspace"
        backButtonUrl={`/sites/${siteName}/workspace`}
      />
      {
        <div className={elementStyles.wrapper}>
          <div className={editorStyles.homepageEditorSidebar}>
            <div>
              <div className={`${elementStyles.card}`}>
                <p>
                  <b>Site notification</b>
                </p>
                <input
                  {...register("notification")}
                  placeholder="Notification"
                  id="site-notification"
                />
                <span className={elementStyles.info}>
                  Note: Leave text field empty if you don’t need this
                  notification bar
                </span>
              </div>

              {/* Homepage section configurations */}
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="leftPane" type="editor">
                  {(droppableProvided) => (
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {fields.map((section, sectionIndex) => (
                        <>
                          {/* Hero section */}
                          {section.hero ? (
                            <>
                              <EditorHeroSection
                                fieldId={`sections.0.hero`}
                                sectionIndex={0}
                                siteName={siteName}
                              />
                            </>
                          ) : null}
                          {/* Resources section */}
                          {section.resources ? (
                            <Draggable
                              draggableId={`resources-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorResourcesSection
                                    fieldId={`sections.${sectionIndex}.resources`}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Infobar Section",
                                      })
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Infobar section */}
                          {section.infobar ? (
                            <Draggable
                              draggableId={`infobar-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorInfobarSection
                                    fieldId={`sections.${sectionIndex}.infobar`}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Infobar Section",
                                      })
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Infopic section */}
                          {section.infopic ? (
                            <Draggable
                              draggableId={`infopic-${sectionIndex}-draggable`}
                              index={sectionIndex}
                            >
                              {(draggableProvided) => (
                                <div
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  ref={draggableProvided.innerRef}
                                >
                                  <EditorInfopicSection
                                    fieldId={`sections.${sectionIndex}.infopic`}
                                    deleteHandler={(event) =>
                                      setItemPendingForDelete({
                                        id: event.target.id,
                                        type: "Infobar Section",
                                      })
                                    }
                                  />
                                </div>
                              )}
                            </Draggable>
                          ) : null}

                          {/* Carousel section */}
                          {/* TO-DO */}
                        </>
                      ))}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Section creator */}
              <NewSectionCreator
                hasResources={hasResources}
                createHandler={createHandler}
              />
            </div>
          </div>
          <div className={editorStyles.homepageEditorMain}>
            {/* Isomer Template Pane */}
            {/* Notification */}
            {watch("notification") && (
              <div className="bp-notification bg-secondary is-marginless">
                <div className="bp-container">
                  <div className="row">
                    <div className="col">
                      <div className="field has-addons bp-notification-flex">
                        <div className="control has-text-centered has-text-white">
                          <h6>{watch("notification")}</h6>
                        </div>
                        <div className="button has-text-white">
                          <span className="sgds-icon sgds-icon-cross" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {fields.map((section, sectionIndex) => (
              <>
                {/* Hero section */}
                {section.hero ? (
                  <>
                    <TemplateHeroSection
                      key={`section-${sectionIndex}`}
                      hero={section.hero}
                      siteName={siteName}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Resources section */}
                {section.resources ? (
                  <>
                    <TemplateResourcesSection
                      key={`section-${sectionIndex}`}
                      title={section.resources.title}
                      subtitle={section.resources.subtitle}
                      button={section.resources.button}
                      sectionIndex={sectionIndex}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Infobar section */}
                {section.infobar ? (
                  <>
                    <TemplateInfobarSection
                      key={`section-${sectionIndex}`}
                      title={section.infobar.title}
                      subtitle={section.infobar.subtitle}
                      description={section.infobar.description}
                      button={section.infobar.button}
                      sectionIndex={sectionIndex}
                      ref={scrollRefs[sectionIndex]}
                    />
                  </>
                ) : null}
                {/* Infopic section */}
                {section.infopic ? (
                  <>
                    {isLeftInfoPic(sectionIndex) ? (
                      <TemplateInfopicLeftSection
                        key={`section-${sectionIndex}`}
                        title={section.infopic.title}
                        subtitle={section.infopic.subtitle}
                        description={section.infopic.description}
                        imageUrl={section.infopic.image}
                        imageAlt={section.infopic.alt}
                        button={section.infopic.button}
                        sectionIndex={sectionIndex}
                        siteName={siteName}
                        ref={scrollRefs[sectionIndex]}
                      />
                    ) : (
                      <TemplateInfopicRightSection
                        key={`section-${sectionIndex}`}
                        title={section.infopic.title}
                        subtitle={section.infopic.subtitle}
                        description={section.infopic.description}
                        imageUrl={section.infopic.image}
                        imageAlt={section.infopic.alt}
                        button={section.infopic.button}
                        sectionIndex={sectionIndex}
                        siteName={siteName}
                        ref={scrollRefs[sectionIndex]}
                      />
                    )}
                  </>
                ) : null}
              </>
            ))}
          </div>
          <div className={editorStyles.pageEditorFooter}>
            <LoadingButton
              label="Save"
              disabled={!_.isEmpty(errors)}
              disabledStyle={elementStyles.disabled}
              className={
                !_.isEmpty(errors) ? elementStyles.disabled : elementStyles.blue
              }
              callback={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      }
    </FormProvider>
  )
}

export default EditHomepage

EditHomepage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
