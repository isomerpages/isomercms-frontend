import { ComponentMeta, ComponentStory } from "@storybook/react"
import { CollaboratorModal } from "components/CollaboratorModal/index"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_COLLABORATORS, MOCK_USER } from "mocks/constants"
import { handlers } from "mocks/handlers"
import {
  addContributorCollaborator,
  buildCollaboratorData,
  buildCollaboratorRoleData,
  buildLoginData,
} from "mocks/utils"
import { CollaboratorData } from "types/collaborators"

const collaboratorModalMeta = {
  title: "Components/CollaboratorModal",
  component: CollaboratorModal,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/:siteName/dashboard"]}>
          <Route path="/sites/:siteName/dashboard">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof CollaboratorModal>

const Template: ComponentStory<typeof CollaboratorModal> = CollaboratorModal

export const AdminMain = Template.bind({})
AdminMain.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildLoginData(MOCK_USER),
      buildCollaboratorData(({
        collaborators: [
          // Email override so that the modal can display the "(You)" text depending on
          // the LoggedInUser
          { ...MOCK_COLLABORATORS.ADMIN_2, email: MOCK_USER.email },
          MOCK_COLLABORATORS.ADMIN_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      } as unknown) as CollaboratorData),
      buildCollaboratorRoleData({ role: "ADMIN" }),
    ],
  },
}
AdminMain.args = {
  siteName: "default",
}

export const ContributorMain = Template.bind({})
ContributorMain.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildLoginData(MOCK_USER),
      buildCollaboratorData(({
        collaborators: [
          MOCK_COLLABORATORS.ADMIN_2,
          MOCK_COLLABORATORS.ADMIN_1,
          // Email override so that the modal can display the "(You)" text depending on
          // the LoggedInUser
          {
            ...MOCK_COLLABORATORS.CONTRIBUTOR_1,
            email: MOCK_USER.email,
            // Setting lastLoggedIn as now since that must be true
            // because the user is seeing this modal
            lastLoggedIn: new Date(),
          },
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      } as unknown) as CollaboratorData),
      buildCollaboratorRoleData({ role: "CONTRIBUTOR" }),
    ],
  },
}
ContributorMain.args = {
  siteName: "default",
}

export const AdminAddContributor = Template.bind({})
AdminAddContributor.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildLoginData(MOCK_USER),
      buildCollaboratorData(({
        collaborators: [
          // Email override so that the modal can display the "(You)" text depending on
          // the LoggedInUser
          { ...MOCK_COLLABORATORS.ADMIN_2, email: MOCK_USER.email },
          MOCK_COLLABORATORS.ADMIN_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      } as unknown) as CollaboratorData),
      buildCollaboratorRoleData({ role: "ADMIN" }),
      addContributorCollaborator(),
    ],
  },
}
AdminAddContributor.args = {
  siteName: "default",
}
export default collaboratorModalMeta
