import * as Yup from "yup"

import {
  specialCharactersRegexTest,
  MEDIA_SETTINGS_TITLE_MIN_LENGTH,
  MEDIA_SETTINGS_TITLE_MAX_LENGTH,
  MEDIA_FILE_MAX_SIZE,
} from "utils/validators"

export const MediaSettingsSchema = (existingTitlesArray = []) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Title is required")
      .test(
        "Special characters found",
        'Title cannot contain any of the following special characters: ~%^*_+-./\\`;~{}[]"<>',
        (value) => !specialCharactersRegexTest.test(value.split(".")[0])
      )
      .min(
        MEDIA_SETTINGS_TITLE_MIN_LENGTH,
        `Title must be longer than ${MEDIA_SETTINGS_TITLE_MIN_LENGTH} characters`
      )
      .max(
        MEDIA_SETTINGS_TITLE_MAX_LENGTH,
        `Title must be shorter than ${MEDIA_SETTINGS_TITLE_MAX_LENGTH} characters`
      )
      .notOneOf(
        existingTitlesArray,
        "Title is already in use. Please choose a different title."
      ),
  })
