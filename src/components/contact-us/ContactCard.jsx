import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"
import FormField from "../FormField"
import ContactFields from "./ContactFields"
import { isEmpty } from "../../utils"

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
        <button
          type="button"
          id={`${sectionId}-${cardIndex}`}
          onClick={displayHandler}
        >
          <i
            className={`bx ${
              shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
            }`}
            id={`${sectionId}-${cardIndex}-icon`}
          />
        </button>
      </div>
      {shouldDisplay ? (
        <>
          <div className={elementStyles.cardContent}>
            <FormField
              title="Title"
              id={`${sectionId}-${cardIndex}-title`}
              value={title}
              onFieldChange={onFieldChange}
              errorMessage={cardErrors.title}
            />
            <ContactFields
              cardIndex={cardIndex}
              content={content}
              onFieldChange={onFieldChange}
              errors={cardErrors.content}
              sectionId={sectionId}
            />
          </div>
          <div className={`${elementStyles.inputGroup} pt-5`}>
            <button
              type="button"
              id={`${sectionId}-${cardIndex}`}
              className={`btn-block ${elementStyles.warning}`}
              onClick={deleteHandler}
            >
              Delete section
            </button>
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
