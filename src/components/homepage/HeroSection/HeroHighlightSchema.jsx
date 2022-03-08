import * as Yup from "yup"

import {
  HERO_BUTTON_MIN_LENGTH,
  HERO_BUTTON_MAX_LENGTH,
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
      `Description must be longer than ${HIGHLIGHTS_DESCRIPTION_MIN_LENGTH} characters`
    )
    .max(
      HIGHLIGHTS_DESCRIPTION_MAX_LENGTH,
      `Description must be shorter than ${HIGHLIGHTS_DESCRIPTION_MAX_LENGTH} characters`
    ),
})

export const HeroHighlightSchema = Yup.object().shape({
  button: Yup.lazy((val) =>
    val
      ? Yup.string()
          .min(
            HERO_BUTTON_MIN_LENGTH,
            `Button text must be longer than ${HERO_BUTTON_MIN_LENGTH} characters`
          )
          .max(
            HERO_BUTTON_MAX_LENGTH,
            `Button text must be shorter than ${HERO_BUTTON_MAX_LENGTH} characters`
          )
      : Yup.string().nullable()
  ),
  url: Yup.lazy((val) => (val ? Yup.string() : Yup.string().nullable())),
  key_highlights: Yup.lazy((val) =>
    val ? Yup.array().of(HeroHighlightOptionSchema) : Yup.object().nullable()
  ),
})
