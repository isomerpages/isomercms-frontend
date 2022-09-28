import { Breadcrumb } from "./Breadcrumb"
import { Card, CARD_THEME_KEY } from "./Card"
import { InlineMessage } from "./InlineMessage"
import { Tabs } from "./Tabs"

// eslint-disable-next-line import/prefer-default-export
export const components = {
  [CARD_THEME_KEY]: Card,
  Tabs,
  Breadcrumb,
  InlineMessage,
}
