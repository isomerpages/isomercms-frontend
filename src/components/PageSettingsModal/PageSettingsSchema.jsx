import _ from "lodash"
import * as Yup from "yup"

import {
  permalinkRegexTest,
  specialCharactersRegexTest,
  PAGE_SETTINGS_PERMALINK_MIN_LENGTH,
  PAGE_SETTINGS_PERMALINK_MAX_LENGTH,
  PAGE_SETTINGS_TITLE_MIN_LENGTH,
  PAGE_SETTINGS_TITLE_MAX_LENGTH,
} from "utils/validators"

export const PageSettingsSchema = (existingTitlesArray = []) =>
  Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .test(
        "Special characters found",
        'Title cannot contain any of the following special characters: ~%^*_+-./`;{}[]"<>',
        (value) => !specialCharactersRegexTest.test(value)
      )
      .min(
        PAGE_SETTINGS_TITLE_MIN_LENGTH,
        `Title must be longer than ${PAGE_SETTINGS_TITLE_MIN_LENGTH} characters`
      )
      .max(
        PAGE_SETTINGS_TITLE_MAX_LENGTH,
        `Title must be shorter than ${PAGE_SETTINGS_TITLE_MAX_LENGTH} characters`
      )
      .test(
        "Duplicate title",
        "Title is already in use. Please choose a different title.",
        (value) => !_.includes(existingTitlesArray, value)
      ),
    permalink: Yup.string().when("layout", (layout, schema) => {
      switch (layout) {
        case "file":
          return schema
        case "link":
          return schema.required("Permalink is required")
        default:
          return schema
            .required("Permalink is required")
            .min(
              PAGE_SETTINGS_PERMALINK_MIN_LENGTH,
              `Permalink must be longer than ${PAGE_SETTINGS_PERMALINK_MIN_LENGTH} characters`
            )
            .max(
              PAGE_SETTINGS_PERMALINK_MAX_LENGTH,
              `Permalink must be shorter than ${PAGE_SETTINGS_PERMALINK_MAX_LENGTH} characters`
            )
            .matches(
              permalinkRegexTest,
              "Permalink should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only"
            )
      }
    }),
    layout: Yup.string().oneOf(["file", "post", "link"]),
    date: Yup.date()
      .typeError("Date must be formatted as YYYY-MM-DD")
      .when("layout", (layout, schema) =>
        layout
          ? schema
              .required("Date is required")
              .test(
                "Date cannot be in the future",
                "Date cannot be in the future",
                (value) => new Date(value) <= new Date()
              )
          : schema
      ),
    file_url: Yup.string().when("layout", (layout, schema) =>
      layout === "file" ? schema.required("File url is required") : schema
    ),
  })
