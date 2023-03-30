import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { SiteEditHeader } from "layouts/layouts/SiteEditLayout"

import { MOCK_ALL_NOTIFICATION_DATA } from "mocks/constants"
import {
  buildRecentNotificationData,
  buildAllNotificationData,
  buildGetStagingUrlData,
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
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof SiteEditHeader>

const Template: ComponentStory<typeof SiteEditHeader> = () => {
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

export default HeaderMeta
