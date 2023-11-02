import { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { DirtyFieldContextProvider } from "contexts/DirtyFieldContext"

import { SiteEditHeader } from "layouts/layouts/SiteEditLayout"

import { MOCK_ALL_NOTIFICATION_DATA } from "mocks/constants"
import {
  buildRecentNotificationData,
  buildAllNotificationData,
  buildGetStagingUrlData,
  buildGetStagingBuildStatusData,
} from "mocks/utils"

import { handlers } from "../../mocks/handlers"

const HeaderMeta = {
  title: "Components/Header",
  component: SiteEditHeader,
  parameters: {
    chromatic: {
      delay: 500,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/header"]}>
          <Route path="/sites/:siteName/header">
            <DirtyFieldContextProvider>
              <Story />
            </DirtyFieldContextProvider>
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof SiteEditHeader>

const Template: StoryFn<typeof SiteEditHeader> = () => {
  return <SiteEditHeader />
}

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildGetStagingUrlData({ stagingUrl: "google.com" }),
    ],
  },
}

export const LoadingAll = Template.bind({})
LoadingAll.parameters = {
  msw: {
    handlers: [buildAllNotificationData([], "infinite"), ...handlers],
  },
}

export const NoNotifications = Template.bind({})
NoNotifications.parameters = {
  msw: {
    handlers: [
      buildRecentNotificationData([]),
      buildAllNotificationData([]),
      ...handlers,
    ],
  },
}

export const ManyNotifications = Template.bind({})
ManyNotifications.parameters = {
  msw: {
    handlers: [
      buildAllNotificationData([
        ...MOCK_ALL_NOTIFICATION_DATA,
        ...MOCK_ALL_NOTIFICATION_DATA,
      ]),
      ...handlers,
    ],
  },
}

export const BuildingStagingSite = Template.bind({})
BuildingStagingSite.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildGetStagingBuildStatusData({
        status: "PENDING",
      }),
    ],
  },
}

export const SuccessStagingBuild = Template.bind({})
SuccessStagingBuild.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildGetStagingBuildStatusData({
        status: "READY",
      }),
    ],
  },
}

export const ErrorStagingBuild = Template.bind({})
ErrorStagingBuild.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildGetStagingBuildStatusData({
        status: "ERROR",
      }),
    ],
  },
}

export default HeaderMeta
