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
      .min(
        PAGE_SETTINGS_TITLE_MIN_LENGTH,
        `Title must be longer than ${PAGE_SETTINGS_TITLE_MIN_LENGTH} characters`
      )
      .max(
        PAGE_SETTINGS_TITLE_MAX_LENGTH,
        `Title must be shorter than ${PAGE_SETTINGS_TITLE_MAX_LENGTH} characters`
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
    permalink: Yup.string()
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
      ),
  })
