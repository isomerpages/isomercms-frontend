import * as Yup from "yup"
import {
  specialCharactersRegexTest,
  DIRECTORY_SETTINGS_TITLE_MIN_LENGTH,
  DIRECTORY_SETTINGS_TITLE_MAX_LENGTH,
} from "utils/validators"

export const DirectorySettingsSchema = (existingTitlesArray = []) =>
  Yup.object().shape({
    newDirectoryName: Yup.string()
      .required("Title is required")
      .min(
        DIRECTORY_SETTINGS_TITLE_MIN_LENGTH,
        `Title must be longer than ${DIRECTORY_SETTINGS_TITLE_MIN_LENGTH} characters`
      )
      .max(
        DIRECTORY_SETTINGS_TITLE_MAX_LENGTH,
        `Title must be shorter than ${DIRECTORY_SETTINGS_TITLE_MAX_LENGTH} characters`
      )
      .notOneOf(
        existingTitlesArray,
        "Title is already in use. Please choose a different title."
      )
      .test(
        "Special characters found",
        'Title cannot contain any of the following special characters: ~%^*_+-./\\`;~{}[]"<>',
        (value) => !specialCharactersRegexTest.test(value)
      ),
  })
