import type { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_MEDIA_ITEM_DATA,
  MOCK_MEDIA_ITEM_ONE,
  MOCK_MEDIA_SUBDIRECTORY_DATA,
} from "mocks/constants"
import { handlers } from "mocks/handlers"
import {
  buildMediaFileData,
  buildMediaFolderFilesData,
  buildMediaFolderSubdirectoriesData,
} from "mocks/utils"

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
} as Meta<typeof Media>

const Template: StoryFn<typeof Media> = Media

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderFilesData(MOCK_MEDIA_ITEM_DATA),
      buildMediaFolderSubdirectoriesData(MOCK_MEDIA_SUBDIRECTORY_DATA),
      buildMediaFileData(MOCK_MEDIA_ITEM_ONE),
    ],
  },
}

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderFilesData({ files: [], total: 0 }),
      buildMediaFolderSubdirectoriesData({ directories: [] }),
    ],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderFilesData({ files: [], total: 0 }, "infinite"),
      buildMediaFolderSubdirectoriesData({ directories: [] }, "infinite"),
    ],
  },
}

export default MediaMeta
