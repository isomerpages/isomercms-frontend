import * as Yup from "yup"
import {
  HERO_TITLE_MIN_LENGTH,
  HERO_TITLE_MAX_LENGTH,
  HERO_SUBTITLE_MIN_LENGTH,
  HERO_SUBTITLE_MAX_LENGTH,
} from "utils/validators"

import {
  HeroHighlightSchema,
  HeroDropdownSchema,
} from "components/homepage/HeroSection"

export const EditorHeroSchema = Yup.object().shape({
  hero: Yup.object()
    .shape({
      title: Yup.string()
        .min(
          HERO_TITLE_MIN_LENGTH,
          `Title must be longer than ${HERO_TITLE_MIN_LENGTH} characters`
        )
        .max(
          HERO_TITLE_MAX_LENGTH,
          `Title must be shorter than ${HERO_TITLE_MAX_LENGTH} characters`
        ),
      subtitle: Yup.string()
        .min(
          HERO_SUBTITLE_MIN_LENGTH,
          `Title must be longer than ${HERO_SUBTITLE_MIN_LENGTH} characters`
        )
        .max(
          HERO_SUBTITLE_MAX_LENGTH,
          `Title must be shorter than ${HERO_SUBTITLE_MAX_LENGTH} characters`
        ),
      background: Yup.string(),
      heroType: Yup.string(),
      options: Yup.array(),
      dropdown: HeroDropdownSchema,
    })
    .concat(HeroHighlightSchema),
})
