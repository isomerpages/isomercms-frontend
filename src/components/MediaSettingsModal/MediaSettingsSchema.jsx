import * as Yup from "yup"

import {
  imagesSuffixRegexTest,
  filesSuffixRegexTest,
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
            const prefix = isCreate ? value.split(".")[0] : value
            return !mediaSpecialCharactersRegexTest.test(prefix)
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
        if (isCreate && mediaRoom === "images") {
          return schema.test(
            "Special characters found",
            "Title must end with one of the following extensions: 'png', 'jpeg', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'",
            (value) => imagesSuffixRegexTest.test(value)
          )
        }
        if (isCreate && mediaRoom === "files") {
          return schema.test(
            "Special characters found",
            "Title must end with the following extensions: 'pdf'",
            (value) => filesSuffixRegexTest.test(value)
          )
        }

        return schema.test(
          "Invalid case",
          "This is an invalid value for the mediaRoom type!",
          () => mediaRoom === "files" || mediaRoom === "images"
        )
      })
      .notOneOf(
        existingTitlesArray,
        "Title is already in use. Please choose a different title."
      ),
  })
