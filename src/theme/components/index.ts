import { Attachment } from "./Attachment"
import { Breadcrumb } from "./Breadcrumb"
import { Card, CARD_THEME_KEY } from "./Card"
import { Checkbox } from "./Checkbox"
import { DISPLAY_CARD_THEME_KEY, DisplayCard } from "./DisplayCard"
import { Infobox } from "./Infobox"
import { Rating } from "./Rating"

// eslint-disable-next-line import/prefer-default-export
export const components = {
  [CARD_THEME_KEY]: Card,
  [DISPLAY_CARD_THEME_KEY]: DisplayCard,
  Checkbox,
  Breadcrumb,
  Infobox,
  Attachment,
  Rating,
}
