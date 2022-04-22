import * as Yup from "yup"

import {
  mediaSpecialCharactersRegexTest,
  specialCharactersRegexTest,
  slugifyLowerFalseRegexTest,
  DIRECTORY_SETTINGS_TITLE_MIN_LENGTH,
  DIRECTORY_SETTINGS_TITLE_MAX_LENGTH,
} from "utils/validators"

import { deslugifyDirectory } from "utils"

// eslint-disable-next-line import/prefer-default-export
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
      // We only have four possible types (passed from context)
      .when("$type", (type, schema) => {
        if (type === "mediaDirectoryName") {
          return schema
            .transform((value) => deslugifyDirectory(value))
            .test(
              "Special characters found",
              'Title cannot contain any of the following special characters: ~%^*+#?./`;{}[]"<>',
              (value) => !mediaSpecialCharactersRegexTest.test(value)
            )
        }
        if (type === "subCollectionName" || type === "resourceRoomName") {
          return schema
            .transform((value) => deslugifyDirectory(value))
            .test(
              "Special characters found",
              'Title cannot contain any of the following special characters: ~%^*_+-./`;{}[]"<>',
              (value) => !specialCharactersRegexTest.test(value)
            )
        }
        if (type === "collectionName") {
          return schema
            .transform((value) =>
              value.trim().replaceAll(" ", "-").toLowerCase()
            )
            .matches(
              slugifyLowerFalseRegexTest,
              "Title cannot contain any symbols"
            )
        }

        return schema.test(
          "Invalid case",
          "This is an invalid value for the collection type!",
          () => false
        )
      }),
  })
