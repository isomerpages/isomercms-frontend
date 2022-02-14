import * as Yup from "yup"
import {
  RESOURCES_TITLE_MIN_LENGTH,
  RESOURCES_TITLE_MAX_LENGTH,
  RESOURCES_SUBTITLE_MIN_LENGTH,
  RESOURCES_SUBTITLE_MAX_LENGTH,
  RESOURCES_BUTTON_MIN_LENGTH,
  RESOURCES_BUTTON_MAX_LENGTH,
} from "utils/validators"

export const EditorResourcesSchema = Yup.object().shape({
  title: Yup.string()
    .min(
      RESOURCES_TITLE_MIN_LENGTH,
      `Title must be longer than ${RESOURCES_TITLE_MIN_LENGTH} characters`
    )
    .max(
      RESOURCES_TITLE_MAX_LENGTH,
      `Title must be shorter than ${RESOURCES_TITLE_MAX_LENGTH} characters`
    ),
  subtitle: Yup.string()
    .min(
      RESOURCES_SUBTITLE_MIN_LENGTH,
      `Title must be longer than ${RESOURCES_SUBTITLE_MIN_LENGTH} characters`
    )
    .max(
      RESOURCES_SUBTITLE_MAX_LENGTH,
      `Title must be shorter than ${RESOURCES_SUBTITLE_MAX_LENGTH} characters`
    ),
  button: Yup.string()
    .min(
      RESOURCES_BUTTON_MIN_LENGTH,
      `Title must be longer than ${RESOURCES_BUTTON_MIN_LENGTH} characters`
    )
    .max(
      RESOURCES_BUTTON_MAX_LENGTH,
      `Title must be shorter than ${RESOURCES_BUTTON_MAX_LENGTH} characters`
    ),
})
