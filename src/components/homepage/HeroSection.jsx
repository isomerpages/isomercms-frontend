import { FormControl, Flex, Icon, Text, VStack, Box } from "@chakra-ui/react"
import { Droppable, Draggable } from "@hello-pangea/dnd"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import PropTypes from "prop-types"
import { BiInfoCircle } from "react-icons/bi"

import { FormContext, FormError, FormTitle } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"
import HeroButton from "components/homepage/HeroButton"
import HeroDropdown from "components/homepage/HeroDropdown"
import KeyHighlight from "components/homepage/KeyHighlight"

import styles from "styles/App.module.scss"
import elementStyles from "styles/isomer-cms/Elements.module.scss"

/* eslint
  react/no-array-index-key: 0
 */

// Constants
const MAX_NUM_KEY_HIGHLIGHTS = 4

const EditorHeroSection = ({
  title,
  subtitle,
  background,
  button,
  url,
  dropdown,
  sectionIndex,
  highlights,
  onFieldChange,
  createHandler,
  deleteHandler,
  displayHandler,
  displayDropdownElems,
  displayHighlights,
  errors,
  handleHighlightDropdownToggle,
  notification,
}) => (
  <Box px="0.5rem">
    <VStack align="flex-start" spacing="1.25rem">
      <FormControl>
        <FormLabel>Notification Banner</FormLabel>
        <Input
          // TODO: Remove the `id/onChange`
          // and change to react hook forms
          id="site-notification"
          onChange={onFieldChange}
          value={notification}
          placeholder="This is a notification banner"
        />
        <Flex flexDir="row" mt="0.75rem" alignItems="center">
          <Icon
            as={BiInfoCircle}
            fill="base.content.brand"
            mr="0.5rem"
            fontSize="1rem"
          />
          <Text textStyle="caption-2">
            Leave this blank if you don&apos;t want the banner to appear
          </Text>
        </Flex>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.sections[0].hero.title}>
        <FormLabel>Hero title</FormLabel>
        <Input
          placeholder="Hero title"
          id={`section-${sectionIndex}-hero-title`}
          value={title}
          onChange={onFieldChange}
        />
        <FormErrorMessage>{errors.sections[0].hero.title}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.sections[0].hero.subtitle}>
        <FormLabel>Hero subtitle</FormLabel>
        <Input
          placeholder="Hero subtitle"
          id={`section-${sectionIndex}-hero-subtitle`}
          value={subtitle}
          onChange={onFieldChange}
        />
        <FormErrorMessage>{errors.sections[0].hero.subtitle}</FormErrorMessage>
      </FormControl>
      <Box>
        {/* TODO: migrate this to design system components */}
        <FormContext
          hasError={!!errors.sections[0].hero.background}
          onFieldChange={onFieldChange}
          isRequired
        >
          <Box mb="0.5rem">
            <FormTitle>Hero background image</FormTitle>
          </Box>
          <FormFieldMedia
            value={background}
            id={`section-${sectionIndex}-hero-background`}
            inlineButtonText="Select"
          />
          <FormError>{errors.sections[0].hero.background}</FormError>
        </FormContext>
      </Box>
    </VStack>
    <div className={styles.card}>
      <p className={elementStyles.formLabel}>Hero Section Type</p>
      {/* Permalink or File URL */}
      <div className="d-flex">
        <label htmlFor="radio-highlights" className="flex-fill">
          <input
            type="radio"
            id="radio-highlights"
            name="hero-type"
            defaultValue="highlights"
            onChange={handleHighlightDropdownToggle}
            checked={!dropdown}
          />
          Highlights + Button
        </label>
        <label htmlFor="radio-dropdown" className="flex-fill">
          <input
            type="radio"
            id="radio-dropdown"
            name="hero-type"
            defaultValue="dropdown"
            onChange={handleHighlightDropdownToggle}
            checked={!!dropdown}
          />
          Dropdown
        </label>
      </div>
      <span className={elementStyles.info}>
        Note: you can only have either Key Highlights+Hero button or a Hero
        Dropdown
      </span>
    </div>
    <div>
      {dropdown ? (
        <>
          <HeroDropdown
            title={dropdown.title}
            options={dropdown.options}
            sectionIndex={sectionIndex}
            createHandler={createHandler}
            deleteHandler={(event) => deleteHandler(event, "Dropdown Element")}
            onFieldChange={onFieldChange}
            displayDropdownElems={displayDropdownElems}
            displayHandler={displayHandler}
            errors={errors}
          />
        </>
      ) : (
        <>
          <HeroButton
            button={button}
            url={url}
            sectionIndex={sectionIndex}
            onFieldChange={onFieldChange}
            errors={errors.sections[0].hero}
          />
          <Droppable droppableId="highlight" type="highlight">
            {(droppableProvided) => (
              <div
                className={styles.card}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {highlights && highlights.length > 0 ? (
                  <>
                    <b>Hero highlights</b>
                    {highlights.map((highlight, highlightIndex) => (
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
                            <KeyHighlight
                              key={`highlight-${highlightIndex}`}
                              title={highlight.title}
                              description={highlight.description}
                              background={highlight.background}
                              url={highlight.url}
                              highlightIndex={highlightIndex}
                              onFieldChange={onFieldChange}
                              shouldDisplay={
                                displayHighlights[highlightIndex]
                                  ? displayHighlights[highlightIndex]
                                  : false
                              }
                              displayHandler={displayHandler}
                              shouldAllowMoreHighlights={
                                highlights.length < MAX_NUM_KEY_HIGHLIGHTS
                              }
                              deleteHandler={(event) =>
                                deleteHandler(event, "Highlight")
                              }
                              errors={errors.highlights[highlightIndex]}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                ) : null}
                {droppableProvided.placeholder}
                <Button
                  onClick={createHandler}
                  id={`highlight-${highlights.length}-create`}
                  isDisabled={highlights.length >= MAX_NUM_KEY_HIGHLIGHTS}
                  w="100%"
                >
                  Add highlight
                </Button>
              </div>
            )}
          </Droppable>
        </>
      )}
    </div>
  </Box>
)

export default EditorHeroSection

EditorHeroSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  background: PropTypes.string,
  button: PropTypes.string,
  url: PropTypes.string,
  sectionIndex: PropTypes.number.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  createHandler: PropTypes.func.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  displayHighlights: PropTypes.arrayOf(PropTypes.bool),
  displayDropdownElems: PropTypes.arrayOf(PropTypes.bool),
  highlights: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      url: PropTypes.string,
      highlightIndex: PropTypes.number,
      createHandler: PropTypes.func,
      deleteHandler: PropTypes.func,
      onFieldChange: PropTypes.func,
      allowMoreHighlights: PropTypes.bool,
    })
  ),
  dropdown: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        dropdownsIndex: PropTypes.number,
        onFieldChange: PropTypes.func,
      })
    ),
    title: PropTypes.string.isRequired,
  }),
  errors: PropTypes.shape({
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        hero: PropTypes.shape({
          title: PropTypes.string,
          subtitle: PropTypes.string,
          background: PropTypes.string,
          button: PropTypes.string,
          url: PropTypes.string,
          dropdown: PropTypes.string,
        }),
      })
    ),
    highlights: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }).isRequired,
}

EditorHeroSection.defaultProps = {
  highlights: undefined,
  dropdown: undefined,
}
