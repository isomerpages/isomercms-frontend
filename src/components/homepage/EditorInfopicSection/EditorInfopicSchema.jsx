import * as Yup from "yup"
import {
  INFOPIC_TITLE_MIN_LENGTH,
  INFOPIC_TITLE_MAX_LENGTH,
  INFOPIC_SUBTITLE_MIN_LENGTH,
  INFOPIC_SUBTITLE_MAX_LENGTH,
  INFOPIC_DESCRIPTION_MIN_LENGTH,
  INFOPIC_DESCRIPTION_MAX_LENGTH,
  INFOPIC_BUTTON_MIN_LENGTH,
  INFOPIC_BUTTON_MAX_LENGTH,
  INFOPIC_ALT_MIN_LENGTH,
  INFOPIC_ALT_MAX_LENGTH,
} from "utils/validators"

export const EditorInfopicSchema = Yup.object().shape({
  infobar: Yup.object().shape({
    title: Yup.string()
      .min(
        INFOPIC_TITLE_MIN_LENGTH,
        `Title must be longer than ${INFOPIC_TITLE_MIN_LENGTH} characters`
      )
      .max(
        INFOPIC_TITLE_MAX_LENGTH,
        `Title must be shorter than ${INFOPIC_TITLE_MAX_LENGTH} characters`
      ),
    subtitle: Yup.string()
      .min(
        INFOPIC_SUBTITLE_MIN_LENGTH,
        `Title must be longer than ${INFOPIC_SUBTITLE_MIN_LENGTH} characters`
      )
      .max(
        INFOPIC_SUBTITLE_MAX_LENGTH,
        `Title must be shorter than ${INFOPIC_SUBTITLE_MAX_LENGTH} characters`
      ),
    description: Yup.string()
      .min(
        INFOPIC_DESCRIPTION_MIN_LENGTH,
        `Title must be longer than ${INFOPIC_DESCRIPTION_MIN_LENGTH} characters`
      )
      .max(
        INFOPIC_DESCRIPTION_MAX_LENGTH,
        `Title must be shorter than ${INFOPIC_DESCRIPTION_MAX_LENGTH} characters`
      ),
    button: Yup.string()
      .min(
        INFOPIC_BUTTON_MIN_LENGTH,
        `Title must be longer than ${INFOPIC_BUTTON_MIN_LENGTH} characters`
      )
      .max(
        INFOPIC_BUTTON_MAX_LENGTH,
        `Title must be shorter than ${INFOPIC_BUTTON_MAX_LENGTH} characters`
      ),
    url: Yup.string(),
    imageUrl: Yup.string(),
    alt: Yup.string()
      .min(
        INFOPIC_ALT_MIN_LENGTH,
        `Title must be longer than ${INFOPIC_ALT_MIN_LENGTH} characters`
      )
      .max(
        INFOPIC_ALT_MAX_LENGTH,
        `Title must be shorter than ${INFOPIC_ALT_MAX_LENGTH} characters`
      ),
  }),
})
