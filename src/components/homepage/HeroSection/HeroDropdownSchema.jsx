import * as Yup from "yup"

import {
  DROPDOWNELEM_TITLE_MIN_LENGTH,
  DROPDOWNELEM_TITLE_MAX_LENGTH,
  HERO_DROPDOWN_TITLE_MIN_LENGTH,
  HERO_DROPDOWN_TITLE_MAX_LENGTH,
} from "utils/validators"

export const HeroDropdownOptionSchema = Yup.object({
  title: Yup.string()
    .min(
      DROPDOWNELEM_TITLE_MIN_LENGTH,
      `Title must be longer than ${DROPDOWNELEM_TITLE_MIN_LENGTH} characters`
    )
    .max(
      DROPDOWNELEM_TITLE_MAX_LENGTH,
      `Title must be shorter than ${DROPDOWNELEM_TITLE_MAX_LENGTH} characters`
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
})

export const HeroDropdownSchema = Yup.object().shape({
  options: Yup.array().of(HeroDropdownOptionSchema),
  title: Yup.string()
    .min(
      HERO_DROPDOWN_TITLE_MIN_LENGTH,
      `Title must be longer than ${HERO_DROPDOWN_TITLE_MIN_LENGTH} characters`
    )
    .max(
      HERO_DROPDOWN_TITLE_MAX_LENGTH,
      `Title must be shorter than ${HERO_DROPDOWN_TITLE_MAX_LENGTH} characters`
    ),
})
