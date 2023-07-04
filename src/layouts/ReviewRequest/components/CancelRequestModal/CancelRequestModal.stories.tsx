import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { CancelRequestModal } from "./CancelRequestModal"

const modalMeta = {
  title: "Components/ReviewRequest/Cancel Request Modal",
  component: CancelRequestModal,
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/review/1"]}>
          <Route path="/sites/:siteName/review/:reviewId">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof CancelRequestModal>

const Template: StoryFn<Record<string, never>> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <CancelRequestModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
