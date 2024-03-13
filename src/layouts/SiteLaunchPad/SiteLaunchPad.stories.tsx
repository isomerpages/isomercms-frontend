import { Meta } from "@storybook/react"
import type { StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { SiteLaunchProvider } from "contexts/SiteLaunchContext"

import {
  MOCK_FAILURE_LAUNCHED_SITE_LAUNCH_DTO,
  MOCK_LAUNCHING_SITE_LAUNCH_DTO,
  MOCK_NON_WWW_LAUNCHING_SITE_LAUNCH_DTO,
  MOCK_SUCCESS_LAUNCHED_SITE_LAUNCH_DTO,
  MOCK_WWW_LAUNCHING_SITE_LAUNCH_DTO,
} from "mocks/constants"
import { buildSiteLaunchDto } from "mocks/utils"
import { SiteLaunchBEStatus, SiteLaunchFEStatus } from "types/siteLaunch"

import { SiteLaunchPad } from "./SiteLaunchPad"

const SiteLaunchPadMeta = {
  title: "Pages/SiteLaunchPad",
  component: SiteLaunchPad,
  parameters: {
    msw: {
      handlers: {
        siteLaunchStatusProps: buildSiteLaunchDto({
          siteLaunchStatus: SiteLaunchBEStatus.NotLaunched,
        }),
      },
    },
  },
  decorators: [
    (StoryFn) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/siteLaunchPad"]}>
          <Route path="/sites/:siteName/siteLaunchPad">
            <SiteLaunchProvider>
              <StoryFn />
            </SiteLaunchProvider>
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof SiteLaunchPad>

const Template: StoryFn<typeof SiteLaunchPad> = (args) => (
  <SiteLaunchPad {...args} />
)

// NOTE: This is just a mock, so no need actual functions
const siteLaunchPadArgs = {
  pageNumber: 1,
}

export const Default = Template.bind({})
Default.args = siteLaunchPadArgs

export const siteLaunchDisclaimer = Template.bind({})

siteLaunchDisclaimer.args = {
  ...siteLaunchPadArgs,
  pageNumber: 1,
}

export const siteLaunchInfoGathering = Template.bind({})

siteLaunchInfoGathering.args = {
  ...siteLaunchPadArgs,
  pageNumber: 2,
}

export const siteLaunchRiskAcceptance = Template.bind({})

siteLaunchRiskAcceptance.args = {
  ...siteLaunchPadArgs,
  pageNumber: 3,
}

export const siteLaunchChecklistOldDomain = Template.bind({})

siteLaunchChecklistOldDomain.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}

siteLaunchChecklistOldDomain.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialStepNumber={0}
        initialSiteLaunchStatus={SiteLaunchFEStatus.ChecklistTasksPending}
        isNewDomain={false}
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const siteLaunchChecklistNewDomain = Template.bind({})

siteLaunchChecklistNewDomain.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}

siteLaunchChecklistNewDomain.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialStepNumber={0}
        initialSiteLaunchStatus={SiteLaunchFEStatus.ChecklistTasksPending}
        isNewDomain
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const NewDomainNonWwwDnsRecords = Template.bind({})

NewDomainNonWwwDnsRecords.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}
NewDomainNonWwwDnsRecords.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_NON_WWW_LAUNCHING_SITE_LAUNCH_DTO
      ),
    },
  },
}

NewDomainNonWwwDnsRecords.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialSiteLaunchStatus={SiteLaunchFEStatus.Loading}
        isNewDomain
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const NewDomainWwwDnsRecords = Template.bind({})

NewDomainWwwDnsRecords.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}
NewDomainWwwDnsRecords.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_WWW_LAUNCHING_SITE_LAUNCH_DTO
      ),
    },
  },
}

NewDomainWwwDnsRecords.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialSiteLaunchStatus={SiteLaunchFEStatus.Loading}
        isNewDomain
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const OldDomainWwwDnsRecords = Template.bind({})

OldDomainWwwDnsRecords.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}
OldDomainWwwDnsRecords.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_WWW_LAUNCHING_SITE_LAUNCH_DTO
      ),
    },
  },
}

OldDomainWwwDnsRecords.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialSiteLaunchStatus={SiteLaunchFEStatus.Loading}
        isNewDomain={false}
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const OldDomainNonWwwDnsRecords = Template.bind({})

OldDomainNonWwwDnsRecords.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}
OldDomainNonWwwDnsRecords.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_NON_WWW_LAUNCHING_SITE_LAUNCH_DTO
      ),
    },
  },
}

OldDomainNonWwwDnsRecords.decorators = [
  (Story) => {
    return (
      <SiteLaunchProvider
        initialSiteLaunchStatus={SiteLaunchFEStatus.Loading}
        isNewDomain={false}
      >
        <Story />
      </SiteLaunchProvider>
    )
  },
]

export const siteLaunchPendingState = Template.bind({})

siteLaunchPendingState.args = {
  ...siteLaunchPadArgs,
  pageNumber: 5,
}
siteLaunchPendingState.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(MOCK_LAUNCHING_SITE_LAUNCH_DTO),
    },
  },
}

export const siteLaunchSuccessState = Template.bind({})

siteLaunchSuccessState.args = {
  ...siteLaunchPadArgs,
  pageNumber: 5,
}
siteLaunchSuccessState.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_SUCCESS_LAUNCHED_SITE_LAUNCH_DTO
      ),
    },
  },
}

export const siteLaunchFailureState = Template.bind({})

siteLaunchFailureState.args = {
  ...siteLaunchPadArgs,
  pageNumber: 5,
}
siteLaunchFailureState.parameters = {
  msw: {
    handlers: {
      siteLaunchStatusProps: buildSiteLaunchDto(
        MOCK_FAILURE_LAUNCHED_SITE_LAUNCH_DTO
      ),
    },
  },
}

export default SiteLaunchPadMeta
