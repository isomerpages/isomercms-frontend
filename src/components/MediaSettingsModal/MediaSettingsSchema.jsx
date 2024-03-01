import * as Yup from "yup"

import {
  mediaSpecialCharactersRegexTest,
  MEDIA_SETTINGS_TITLE_MIN_LENGTH,
  MEDIA_SETTINGS_TITLE_MAX_LENGTH,
} from "utils/validators"

// eslint-disable-next-line import/prefer-default-export
export const MediaSettingsSchema = (existingTitlesArray = []) =>
  Yup.object().shape({
    name: Yup.string()
      .required("Title is required")
      .when("$isCreate", (isCreate, schema) =>
        schema.test(
          "Special characters found",
          'Title cannot contain any of the following special characters: ~%^*+#?./`;{}[]"<>',
          (value) => {
            return !mediaSpecialCharactersRegexTest.test(value)
          }
        )
      )
      .test(
        "File not supported",
        "File names cannot contain dots, except the extension at the end (e.g. '.png' or '.pdf')",
        (value) => {
          return (value.match(/\./g) || []).length <= 1
        }
      )
      .test(
        "File not supported",
        "File names cannot begin with an underscore",
        (value) => {
          return !value.startsWith("_")
        }
      )
      .min(
        MEDIA_SETTINGS_TITLE_MIN_LENGTH,
        `Title must be longer than ${MEDIA_SETTINGS_TITLE_MIN_LENGTH} characters`
      )
      .max(
        MEDIA_SETTINGS_TITLE_MAX_LENGTH,
        `Title must be shorter than ${MEDIA_SETTINGS_TITLE_MAX_LENGTH} characters`
      )
      // When this is called, mediaRoom is one of either images or files
      .when(["$mediaRoom", "$isCreate"], (mediaRoom, isCreate, schema) => {
        return schema.test(
          "Invalid case",
          "This is an invalid value for the mediaRoom type!",
          () => mediaRoom === "files" || mediaRoom === "images"
        )
      })
      .lowercase()
      .notOneOf(
        existingTitlesArray.map((title) => title.toLowerCase()),
        "Title is already in use. Please choose a different title."
      ),
  })
