import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_MEDIA_DATA } from "mocks/constants"
import { buildMediaData } from "mocks/utils"

import { Media } from "./Media"

const MediaMeta = {
  title: "Pages/Media",
  component: Media,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
  },
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
} as ComponentMeta<typeof Media>

const Template: ComponentStory<typeof Media> = Media

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: { media: buildMediaData(MOCK_MEDIA_DATA) },
  },
}

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: { media: buildMediaData([]) },
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: { media: buildMediaData([], "infinite") },
  },
}

export default MediaMeta
