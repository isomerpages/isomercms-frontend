import { Button, useDisclosure } from "@chakra-ui/react"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { CollaboratorModal } from "components/CollaboratorModal/index"

import { MOCK_COLLABORATORS, MOCK_USER } from "mocks/constants"
import { handlers } from "mocks/handlers"
import {
  buildCollaboratorData,
  buildCollaboratorRoleData,
  buildContributor,
  buildLoginData,
  buildRemoveContributor,
} from "mocks/utils"

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

// TODO!: add stories for the submodals
// the sub modals won't show up on chromatic when changes are made at present.
const Template: ComponentStory<typeof CollaboratorModal> = () => {
  const props = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={props.onOpen}>Open collaborators</Button>
      <CollaboratorModal {...props} />
    </>
  )
}

export const AdminMain = Template.bind({})
AdminMain.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildRemoveContributor(null),
      buildLoginData(MOCK_USER),
      buildCollaboratorData({
        collaborators: [
          // Email override so that the modal can display the "(You)" text depending on
          // the LoggedInUser
          { ...MOCK_COLLABORATORS.ADMIN_2, email: MOCK_USER.email },
          MOCK_COLLABORATORS.ADMIN_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      }),
      buildCollaboratorRoleData({ role: "ADMIN" }),
      buildContributor(),
    ],
  },
}

export const ContributorMain = Template.bind({})
ContributorMain.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildLoginData(MOCK_USER),
      buildCollaboratorData({
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
            lastLoggedIn: new Date().toString(),
          },
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      }),
      buildCollaboratorRoleData({ role: "CONTRIBUTOR" }),
    ],
  },
}

export const AdminAddContributor = Template.bind({})
AdminAddContributor.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildLoginData(MOCK_USER),
      buildRemoveContributor(null),
      buildCollaboratorData({
        collaborators: [
          // Email override so that the modal can display the "(You)" text depending on
          // the LoggedInUser
          { ...MOCK_COLLABORATORS.ADMIN_2, email: MOCK_USER.email },
          MOCK_COLLABORATORS.ADMIN_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_1,
          MOCK_COLLABORATORS.CONTRIBUTOR_2,
        ],
      }),
      buildCollaboratorRoleData({ role: "ADMIN" }),
      buildContributor(true),
    ],
  },
}
export default collaboratorModalMeta
