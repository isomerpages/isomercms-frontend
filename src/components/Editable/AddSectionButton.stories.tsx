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
} as Meta<typeof AddSectionButton>

interface AddSectionButtonOptions {
  title: string
  subtitle: string
  overlayTitle?: string
  overlayDescription?: string
  overlayImage?: JSX.Element
}

interface AddSectionButtonTemplateArgs {
  buttonText: string
  options: AddSectionButtonOptions[]
}

const Template: StoryFn<AddSectionButtonTemplateArgs> = ({
  buttonText,
  options,
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
          {options.map((option) => {
            if (option.overlayTitle && option.overlayDescription) {
              return (
                <AddSectionButton.HelpOverlay
                  title={option.overlayTitle}
                  description={option.overlayDescription}
                  image={option.overlayImage}
                >
                  <AddSectionButton.Option
                    title={option.title}
                    subtitle={option.subtitle}
                  />
                </AddSectionButton.HelpOverlay>
              )
            }

            return (
              <AddSectionButton.Option
                title={option.title}
                subtitle={option.subtitle}
              />
            )
          })}
        </AddSectionButton.List>
      </AddSectionButton>
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {
  buttonText: "Add section",
  options: [
    {
      title: "Infopic",
      subtitle: "Add an image and text",
    },
    {
      title: "Text cards",
      subtitle: "Add up to 4 clickable cards with text",
      overlayTitle: "Text cards",
      overlayDescription:
        "Add clickable cards with bite-sized information to your homepage. You can link any page or external URL, such as blog posts, articles, and more.",
      overlayImage: <HomepageTextCardsSampleImage />,
    },
    {
      title: "Info-columns",
      subtitle: "Add snippets of text in 2- or 3-column layouts",
      overlayTitle: "Info-Columns",
      overlayDescription:
        "Add bite-sized snippets of text in a multi-column layout. These texts aren’t clickable. Perfect for showing informative text that describes your organisation.",
    },
    {
      title: "Announcements",
      subtitle: "Add a list of announcements with dates",
      overlayTitle: "Announcements",
      overlayDescription:
        "Make exciting news from your organisation stand out by adding a list of announcements with dates on your homepage.",
      overlayImage: <HomepageAnnouncementsSampleImage />,
    },
  ],
}

export default addSectionButtonMeta
