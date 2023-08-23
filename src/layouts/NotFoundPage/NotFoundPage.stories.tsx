import type { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { NotFoundPage } from "./NotFoundPage"

const NotFoundPageMeta = {
  title: "pages/NotFound",
  component: NotFoundPage,
} as Meta<typeof NotFoundPage>

const Template: StoryFn<typeof NotFoundPage> = NotFoundPage

export const WithinSite = Template.bind({})
WithinSite.decorators = [
  (Story) => {
    return (
      <MemoryRouter initialEntries={["/sites/storybook/notfound"]}>
        <Route path="/sites/:siteName/notfound">
          <Story />
        </Route>
      </MemoryRouter>
    )
  },
]

export const Generic = Template.bind({})
Generic.decorators = [
  (Story) => {
    return (
      <MemoryRouter initialEntries={["/notfound"]}>
        <Route path="/notfound">
          <Story />
        </Route>
      </MemoryRouter>
    )
  },
]

export default NotFoundPageMeta
