import { Button, IconButton } from "@opengovsg/design-system-react"
import ContactFields from "components/contact-us/ContactFields"
import FormContext from "components/Form/FormContext"
import FormError from "components/Form/FormError"
import FormTitle from "components/Form/FormTitle"
import FormField from "components/FormField"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { isEmpty } from "utils"

/* eslint
  react/no-array-index-key: 0
 */

const EditorContactCard = ({
  title,
  content,
  cardIndex,
  deleteHandler,
  onFieldChange,
  shouldDisplay,
  displayHandler,
  cardErrors,
  sectionId,
}) => {
  return (
    <div
      className={`${elementStyles.card} ${
        !shouldDisplay && !isEmpty(cardErrors) ? elementStyles.error : ""
      } move`}
    >
      <div className={elementStyles.cardHeader}>
        <h2>{title}</h2>
        <IconButton
          variant="clear"
          id={`${sectionId}-${cardIndex}`}
          onClick={displayHandler}
        >
          <i
            className={`bx ${
              shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
            }`}
            id={`${sectionId}-${cardIndex}-icon`}
          />
        </IconButton>
      </div>
      {shouldDisplay ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormContext hasError={!!cardErrors.title}>
              <FormTitle>Title</FormTitle>
              <FormField
                placeholder="Title"
                id={`${sectionId}-${cardIndex}-title`}
                value={title}
                onChange={onFieldChange}
              />
              <FormError>{cardErrors.title}</FormError>
            </FormContext>
            <ContactFields
              cardIndex={cardIndex}
              content={content}
              onFieldChange={onFieldChange}
              errors={cardErrors.content}
              sectionId={sectionId}
            />
          </div>
          <div className={`${elementStyles.inputGroup} pt-5`}>
            <Button
              colorScheme="danger"
              w="100%"
              id={`${sectionId}-${cardIndex}`}
              onClick={deleteHandler}
            >
              Delete section
            </Button>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default EditorContactCard

EditorContactCard.propTypes = {
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
    })
  ),
  cardIndex: PropTypes.number.isRequired,
  deleteHandler: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  shouldDisplay: PropTypes.bool.isRequired,
  displayHandler: PropTypes.func.isRequired,
  cardErrors: PropTypes.shape({
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
      })
    ),
  }),
  sectionId: PropTypes.string,
}
