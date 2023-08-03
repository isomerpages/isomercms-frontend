import { Breadcrumb } from "./Breadcrumb"
import { Card, CARD_THEME_KEY } from "./Card"
import { DISPLAY_CARD_THEME_KEY, DisplayCard } from "./DisplayCard"
import { Infobox } from "./Infobox"

// eslint-disable-next-line import/prefer-default-export
export const components = {
  [CARD_THEME_KEY]: Card,
  [DISPLAY_CARD_THEME_KEY]: DisplayCard,
  Breadcrumb,
  Infobox,
}
