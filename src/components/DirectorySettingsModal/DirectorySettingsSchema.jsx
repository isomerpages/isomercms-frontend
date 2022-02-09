import * as Yup from "yup"

import {
  mediaSpecialCharactersRegexTest,
  specialCharactersRegexTest,
  slugifyLowerFalseRegexTest,
  DIRECTORY_SETTINGS_TITLE_MIN_LENGTH,
  DIRECTORY_SETTINGS_TITLE_MAX_LENGTH,
} from "utils/validators"

import { deslugifyDirectory } from "utils"

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
      .when("$type", (type, schema) => {
        if (type === "mediaDirectoryName")
          return schema
            .transform((value) => deslugifyDirectory(value))
            .test(
              "Special characters found",
              'Title cannot contain any of the following special characters: ~%^*+#?./`;{}[]"<>',
              (value) => !mediaSpecialCharactersRegexTest.test(value)
            )
        if (type === "subCollectionName")
          return schema
            .transform((value) => deslugifyDirectory(value))
            .test(
              "Special characters found",
              'Title cannot contain any of the following special characters: ~%^*_+-./`;{}[]"<>',
              (value) => !specialCharactersRegexTest.test(value)
            )
        if (type === "collectionName")
          return schema
            .transform((value) =>
              value.trim().replaceAll(" ", "-").toLowerCase()
            )
            .matches(
              slugifyLowerFalseRegexTest,
              "Title cannot contain any symbols"
            )
      }),
  })
