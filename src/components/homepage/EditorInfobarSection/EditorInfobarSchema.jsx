import * as Yup from "yup"

import {
  INFOBAR_TITLE_MIN_LENGTH,
  INFOBAR_TITLE_MAX_LENGTH,
  INFOBAR_SUBTITLE_MIN_LENGTH,
  INFOBAR_SUBTITLE_MAX_LENGTH,
  INFOBAR_DESCRIPTION_MIN_LENGTH,
  INFOBAR_DESCRIPTION_MAX_LENGTH,
  INFOBAR_BUTTON_MIN_LENGTH,
  INFOBAR_BUTTON_MAX_LENGTH,
} from "utils/validators"

export const EditorInfobarSchema = Yup.object().shape({
  infobar: Yup.object().shape({
    title: Yup.string()
      .min(
        INFOBAR_TITLE_MIN_LENGTH,
        `Title must be longer than ${INFOBAR_TITLE_MIN_LENGTH} characters`
      )
      .max(
        INFOBAR_TITLE_MAX_LENGTH,
        `Title must be shorter than ${INFOBAR_TITLE_MAX_LENGTH} characters`
      ),
    subtitle: Yup.string()
      .min(
        INFOBAR_SUBTITLE_MIN_LENGTH,
        `Subtitle must be longer than ${INFOBAR_SUBTITLE_MIN_LENGTH} characters`
      )
      .max(
        INFOBAR_SUBTITLE_MAX_LENGTH,
        `Subtitle must be shorter than ${INFOBAR_SUBTITLE_MAX_LENGTH} characters`
      ),
    description: Yup.string()
      .min(
        INFOBAR_DESCRIPTION_MIN_LENGTH,
        `Description must be longer than ${INFOBAR_DESCRIPTION_MIN_LENGTH} characters`
      )
      .max(
        INFOBAR_DESCRIPTION_MAX_LENGTH,
        `Description must be shorter than ${INFOBAR_DESCRIPTION_MAX_LENGTH} characters`
      ),
    button: Yup.string()
      .min(
        INFOBAR_BUTTON_MIN_LENGTH,
        `Button text must be longer than ${INFOBAR_BUTTON_MIN_LENGTH} characters`
      )
      .max(
        INFOBAR_BUTTON_MAX_LENGTH,
        `Button text must be shorter than ${INFOBAR_BUTTON_MAX_LENGTH} characters`
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
  }),
})
