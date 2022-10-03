import { Breadcrumb } from "./Breadcrumb"
import { Card, CARD_THEME_KEY } from "./Card"
import { DISPLAY_CARD_THEME_KEY, DisplayCard } from "./DisplayCard"
import { InlineMessage } from "./InlineMessage"
import { Tabs } from "./Tabs"

// eslint-disable-next-line import/prefer-default-export
export const components = {
  [CARD_THEME_KEY]: Card,
  [DISPLAY_CARD_THEME_KEY]: DisplayCard,
  Tabs,
  Breadcrumb,
  InlineMessage,
}
