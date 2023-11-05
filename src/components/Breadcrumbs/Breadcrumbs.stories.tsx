import type { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { Breadcrumbs } from "./Breadcrumbs"

const breakcrumbsMeta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  decorators: [
    (Story) => {
      return (
        <MemoryRouter
          initialEntries={[
            "/sites/storybook/media/images/mediaDirectory/images",
          ]}
        >
          <Route path="/sites/:siteName/media/:mediaRoom/mediaDirectory/:mediaDirectoryName">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof Breadcrumbs>

const breadcrumbsTemplate: StoryFn<typeof Breadcrumbs> = (props) => {
  return <Breadcrumbs {...props} />
}

export const Default = breadcrumbsTemplate.bind({})

Default.args = {
  items: [
    { title: "images", url: "#" },
    {
      title: "nested-album",
      url: "#",
    },
    {
      title: "level-3",
      url: "#",
    },
  ],
}

export const Truncated = breadcrumbsTemplate.bind({})

Truncated.args = {
  items: [
    { title: "images", url: "#" },
    {
      title: "nested-album",
      url: "#",
    },
    {
      title: "level-3",
      url: "#",
    },
    {
      title: "level-4",
      url: "#",
    },
  ],
}

export const NotLinked = breadcrumbsTemplate.bind({})

NotLinked.args = {
  items: [
    { title: "images", url: "#" },
    {
      title: "nested-album",
      url: "#",
    },
    {
      title: "level-3",
      url: "#",
    },
    {
      title: "level-4",
      url: "#",
    },
  ],
  maxBreadcrumbsLength: 4,
  spacing: "0rem",
  textStyle: "body-2",
  isLinked: false,
  isLastChildUnderlined: true,
}

export default breakcrumbsMeta
