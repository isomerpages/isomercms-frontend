import * as Yup from "yup"
import {
  HIGHLIGHTS_DESCRIPTION_MIN_LENGTH,
  HIGHLIGHTS_DESCRIPTION_MAX_LENGTH,
  HIGHLIGHTS_TITLE_MIN_LENGTH,
  HIGHLIGHTS_TITLE_MAX_LENGTH,
} from "utils/validators"

export const HeroHighlightOptionSchema = Yup.object({
  title: Yup.string()
    .min(
      HIGHLIGHTS_TITLE_MIN_LENGTH,
      `Title must be longer than ${HIGHLIGHTS_TITLE_MIN_LENGTH} characters`
    )
    .max(
      HIGHLIGHTS_TITLE_MAX_LENGTH,
      `Title must be shorter than ${HIGHLIGHTS_TITLE_MAX_LENGTH} characters`
    ),
  url: Yup.string(),
  description: Yup.string()
    .min(
      HIGHLIGHTS_DESCRIPTION_MIN_LENGTH,
      `Title must be longer than ${HIGHLIGHTS_DESCRIPTION_MIN_LENGTH} characters`
    )
    .max(
      HIGHLIGHTS_DESCRIPTION_MAX_LENGTH,
      `Title must be shorter than ${HIGHLIGHTS_DESCRIPTION_MAX_LENGTH} characters`
    ),
})
