import * as Yup from "yup"
import {
  DROPDOWNELEM_TITLE_MIN_LENGTH,
  DROPDOWNELEM_TITLE_MAX_LENGTH,
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
  url: Yup.string(),
})
