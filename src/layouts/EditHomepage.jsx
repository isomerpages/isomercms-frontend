import axios from "axios"
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
import NewSectionCreator from "components/homepage/NewSectionCreator"
import { EditorResourcesSection } from "components/homepage/EditorResourcesSection"
import LoadingButton from "components/LoadingButton"

import TemplateHeroSection from "templates/homepage/HeroSection"
import TemplateInfobarSection from "templates/homepage/InfobarSection"
import TemplateInfopicLeftSection from "templates/homepage/InfopicLeftSection"
import TemplateInfopicRightSection from "templates/homepage/InfopicRightSection"
import TemplateResourcesSection from "templates/homepage/ResourcesSection"

import { errorToast } from "utils/toasts"

import { yupResolver } from "@hookform/resolvers/yup"

import {
  frontMatterParser,
  concatFrontMatterMdBody,
  DEFAULT_RETRY_MSG,
} from "utils"

import "styles/isomer-template.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

// Import hooks
import useSiteColorsHook from "hooks/useSiteColorsHook"

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

// Section constructors
const ResourcesSectionConstructor = (isErrorConstructor) => ({
  resources: {
    title: isErrorConstructor ? "" : "Resources Section Title",
    subtitle: isErrorConstructor ? "" : "Resources Section Subtitle",
    button: isErrorConstructor ? "" : "Resources Button Name",
  },
})

const InfobarSectionConstructor = (isErrorConstructor) => ({
  infobar: {
    title: isErrorConstructor ? "" : "Infobar Title",
    subtitle: isErrorConstructor ? "" : "Infobar Subtitle",
    description: isErrorConstructor ? "" : "Infobar description",
    button: isErrorConstructor ? "" : "Button Text",
    url: "", // No default value so that no broken link is created
  },
})

const InfopicSectionConstructor = (isErrorConstructor) => ({
  infopic: {
    title: isErrorConstructor ? "" : "Infopic Title",
    subtitle: isErrorConstructor ? "" : "Infopic Subtitle",
    description: isErrorConstructor ? "" : "Infopic description",
    button: isErrorConstructor ? "" : "Button Text",
    url: "", // No default value so that no broken link is created
    image: "", // Always blank since the image modal handles this
    alt: isErrorConstructor ? "" : "Image alt text",
  },
})

const enumSection = (type, isErrorConstructor) => {
  switch (type) {
    case "resources":
      return ResourcesSectionConstructor(isErrorConstructor)
    case "infobar":
      return InfobarSectionConstructor(isErrorConstructor)
    case "infopic":
      return InfopicSectionConstructor(isErrorConstructor)
    default:
      return InfobarSectionConstructor(isErrorConstructor)
  }
}

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

const EditHomepage = ({ match }) => {
  const { retrieveSiteColors, generatePageStyleSheet } = useSiteColorsHook()

  const { siteName } = match.params
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  const [frontMatter, setFrontMatter] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    notification: "",
    sections: [],
  })
  const [originalFrontMatter, setOriginalFrontMatter] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    notification: "",
    sections: [],
  })
  const [sha, setSha] = useState(null)
  const [hasResources, setHasResources] = useState(false)
  const [dropdownIsActive, setDropdownIsActive] = useState(false)
  const [itemPendingForDelete, setItemPendingForDelete] = useState({
    id: "",
    type: "",
  })

  const methods = useForm({
    resolver: yupResolver(EditHomepageSchema),
    mode: "onBlur",
  })
  const { watch, control, register, setValue } = methods

  const { fields, append, remove, update, move } = useFieldArray({
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

  useEffect(() => {
    let _isMounted = true
    const loadPageDetails = async () => {
      // // Set page colors
      try {
        await retrieveSiteColors(siteName)
        generatePageStyleSheet(siteName)
      } catch (err) {
        console.log(err)
      }

      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`,
          {
            withCredentials: true,
          }
        )
        const { content, sha } = resp.data
        const { frontMatter } = frontMatterParser(content)
        // Compute hasResources and set displaySections
        let hasResources = false
        setValue("notification", frontMatter.notification)
        setValue("sections", frontMatter.sections)
        if (_isMounted) {
          setFrontMatter(frontMatter)
          setOriginalFrontMatter(_.cloneDeep(frontMatter))
          setSha(sha)
          setHasResources(hasResources)
          setHasLoaded(true)
        }
      } catch (err) {
        // Set frontMatter to be same to prevent warning message when navigating away
        if (_isMounted) setFrontMatter(originalFrontMatter)
        errorToast(
          `There was a problem trying to load your homepage. ${DEFAULT_RETRY_MSG}`
        )
        console.log(err)
      }
    }

    loadPageDetails()
    return () => {
      _isMounted = false
    }
  }, [])

  // useEffect(() => {
  //   const hasSectionErrors = _.some(errors.sections, (section) => {
  //     // Section is an object, e.g. { hero: {} }
  //     // _.keys(section) produces an array with length 1
  //     // The 0th element of the array contains the sectionType
  //     const sectionType = _.keys(section)[0]
  //     return (
  //       _.some(
  //         section[sectionType],
  //         (errorMessage) => errorMessage.length > 0
  //       ) === true
  //     )
  //   })

  //   const hasHighlightErrors = _.some(
  //     errors.highlights,
  //     (highlight) =>
  //       _.some(highlight, (errorMessage) => errorMessage.length > 0) === true
  //   )

  //   const hasDropdownElemErrors = _.some(
  //     errors.dropdownElems,
  //     (dropdownElem) =>
  //       _.some(dropdownElem, (errorMessage) => errorMessage.length > 0) === true
  //   )

  //   const hasErrors =
  //     hasSectionErrors || hasHighlightErrors || hasDropdownElemErrors

  //   setHasErrors(hasErrors)
  // }, [errors])

  const createHandler = async (event) => {
    try {
      const { value } = event.target
      if (value === "resources") {
        setHasResources(true)
      }
      append(enumSection(value, false))
      appendRefs(createRef())
      scrollRefs[scrollRefs.length - 1].current.scrollIntoView()
    } catch (err) {
      console.log(err)
    }
  }

  const deleteHandler = async (id) => {
    try {
      const idArray = id.split("-")
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

  const toggleDropdown = async () => {
    try {
      setDropdownIsActive((prevState) => !prevState)
    } catch (err) {
      console.log(err)
    }
  }

  const savePage = async () => {
    try {
      const { siteName } = match.params
      const filteredFrontMatter = _.cloneDeep(frontMatter)
      // Filter out components which have no input
      filteredFrontMatter.notification = watch("notification")
      filteredFrontMatter.sections = fields.map((section) => {
        const newSection = {}
        for (const sectionName in section) {
          newSection[sectionName] = _.cloneDeep(
            _.omitBy(section[sectionName], _.isEmpty)
          )
        }
        return newSection
      })
      const content = concatFrontMatterMdBody(filteredFrontMatter, "")

      const params = {
        content,
        sha,
      }

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/homepage`,
        params,
        {
          withCredentials: true,
        }
      )

      window.location.reload()
    } catch (err) {
      errorToast(
        `There was a problem trying to save your homepage. ${DEFAULT_RETRY_MSG}`
      )
      console.log(err)
    }
  }

  const onDragEnd = (result) => {
    const { source, destination } = result

    // If the user dropped the draggable to no known droppable
    if (!destination) return

    // The draggable elem was returned to its original position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return

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
        shouldAllowEditPageBackNav={
          JSON.stringify(originalFrontMatter) === JSON.stringify(frontMatter)
        }
        isEditPage
        backButtonText="Back to My Workspace"
        backButtonUrl={`/sites/${siteName}/workspace`}
      />
      {hasLoaded && (
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
                                    key={`section-${sectionIndex}`}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(
                                      event // temporary
                                    ) =>
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
                                    key={`section-${sectionIndex}`}
                                    sectionIndex={sectionIndex}
                                    deleteHandler={(
                                      event // temporary
                                    ) =>
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
                                    key={`section-${sectionIndex}`}
                                    deleteHandler={(
                                      event // temporary
                                    ) =>
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
                      dropdownIsActive={dropdownIsActive}
                      toggleDropdown={toggleDropdown}
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
              disabled={hasErrors}
              disabledStyle={elementStyles.disabled}
              className={
                hasErrors || !sha ? elementStyles.disabled : elementStyles.blue
              }
              callback={savePage}
            />
          </div>
        </div>
      )}
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
