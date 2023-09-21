import { Box, Center } from "@chakra-ui/react"
import type { Meta, StoryFn } from "@storybook/react"

import {
  HomepageAnnouncementsSampleImage,
  HomepageTextCardsSampleImage,
} from "assets/images"

import { AddSectionButton } from "./AddSectionButton"

const addSectionButtonMeta = {
  title: "Components/AddSectionButton",
  component: AddSectionButton,
  parameters: {
    docs: {
      story: {
        layout: "fullscreen",
      },
    },
  },
} as Meta<typeof AddSectionButton>

interface AddSectionButtonTemplateArgs {
  buttonText: string
  firstTitle: string
  firstSubtitle: string
  secondTitle: string
  secondSubtitle: string
  secondOverlayTitle: string
  secondOverlayDescription: string
  secondOverlayImage?: JSX.Element
  thirdTitle: string
  thirdSubtitle: string
  thirdOverlayTitle: string
  thirdOverlayDescription: string
  fourthTitle: string
  fourthSubtitle: string
  fourthOverlayTitle: string
  fourthOverlayDescription: string
  fourthOverlayImage?: JSX.Element
}

const Template: StoryFn<AddSectionButtonTemplateArgs> = ({
  buttonText,
  firstTitle,
  firstSubtitle,
  secondTitle,
  secondSubtitle,
  secondOverlayTitle,
  secondOverlayDescription,
  secondOverlayImage,
  thirdTitle,
  thirdSubtitle,
  thirdOverlayTitle,
  thirdOverlayDescription,
  fourthTitle,
  fourthSubtitle,
  fourthOverlayTitle,
  fourthOverlayDescription,
  fourthOverlayImage,
}: AddSectionButtonTemplateArgs) => {
  return (
    <Box height="50vh" width="450px">
      <Center
        height="40vh"
        bgColor="brand.secondary.100"
        my={3}
        borderRadius="0.5rem"
      >
        This space is for content.
      </Center>
      <AddSectionButton buttonText={buttonText}>
        <AddSectionButton.List>
          <AddSectionButton.Option
            title={firstTitle}
            subtitle={firstSubtitle}
          />
          <AddSectionButton.HelpOverlay
            title={secondOverlayTitle}
            description={secondOverlayDescription}
            image={secondOverlayImage}
          >
            <AddSectionButton.Option
              title={secondTitle}
              subtitle={secondSubtitle}
            />
          </AddSectionButton.HelpOverlay>
          <AddSectionButton.HelpOverlay
            title={thirdOverlayTitle}
            description={thirdOverlayDescription}
          >
            <AddSectionButton.Option
              title={thirdTitle}
              subtitle={thirdSubtitle}
            />
          </AddSectionButton.HelpOverlay>
          <AddSectionButton.HelpOverlay
            title={fourthOverlayTitle}
            description={fourthOverlayDescription}
            image={fourthOverlayImage}
          >
            <AddSectionButton.Option
              title={fourthTitle}
              subtitle={fourthSubtitle}
            />
          </AddSectionButton.HelpOverlay>
        </AddSectionButton.List>
      </AddSectionButton>
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {
  buttonText: "Add section",
  firstTitle: "Infopic",
  firstSubtitle: "Add an image and text",
  secondTitle: "Text cards",
  secondSubtitle: "Add up to 4 clickable cards with text",
  secondOverlayTitle: "Text cards",
  secondOverlayDescription:
    "Add clickable cards with bite-sized information to your homepage. You can link any page or external URL, such as blog posts, articles, and more.",
  secondOverlayImage: <HomepageTextCardsSampleImage />,
  thirdTitle: "Info-columns",
  thirdSubtitle: "Add snippets of text in 2- or 3-column layouts",
  thirdOverlayTitle: "Info-Columns",
  thirdOverlayDescription:
    "Add bite-sized snippets of text in a multi-column layout. These texts aren’t clickable. Perfect for showing informative text that describes your organisation.",
  fourthTitle: "Announcements",
  fourthSubtitle: "Add a list of announcements with dates",
  fourthOverlayTitle: "Announcements",
  fourthOverlayDescription:
    "Make exciting news from your organisation stand out by adding a list of announcements with dates on your homepage.",
  fourthOverlayImage: <HomepageAnnouncementsSampleImage />,
}

export default addSectionButtonMeta
