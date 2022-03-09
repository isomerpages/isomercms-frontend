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
  url: Yup.lazy((val) => {
    if (val && val.startsWith("/"))
      return Yup.string(
        `URL must be either a permalink to a page on the site or a valid external URL`
      )
    return Yup.string()
      .url(
        `URL must be either a permalink to a page on the site or a valid external URL`
      )
      .nullable()
  }),
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
  button: Yup.string()
    .min(
      HERO_BUTTON_MIN_LENGTH,
      `Button text must be longer than ${HERO_BUTTON_MIN_LENGTH} characters`
    )
    .max(
      HERO_BUTTON_MAX_LENGTH,
      `Button text must be shorter than ${HERO_BUTTON_MAX_LENGTH} characters`
    )
    .nullable(),
  url: Yup.lazy((val) => {
    if (val && val.startsWith("/"))
      return Yup.string(
        `URL must be either a permalink to a page on the site or a valid external URL`
      )
    return Yup.string()
      .url(
        `URL must be either a permalink to a page on the site or a valid external URL`
      )
      .nullable()
  }),
  key_highlights: Yup.lazy((val) =>
    val ? Yup.array().of(HeroHighlightOptionSchema) : Yup.object().nullable()
  ),
})
