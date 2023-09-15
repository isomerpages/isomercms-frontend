import { DragDropContext } from "@hello-pangea/dnd"
import { Tag } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"
import _ from "lodash"

import { EditableContextProvider } from "contexts/EditableContext"

import { AnnouncementError } from "types/homepage"

import { Editable } from "../Editable"

import { AnnouncementBody } from "./AnnouncementBody"
import { AnnouncementSection } from "./AnnouncementSection"

const sectionEg = {
  announcements: {
    title: "Announcement Title",
    subtitle: "Announcement Subtitle",
    announcement_items: [
      {
        title: "Announcement Item Title",
        description: "Announcement Item Description",
        link: "Announcement Item Link",
      },
    ],
  },
}

const errorsEg = {
  title: "",
  subtitle: "",
  announcementItems: [] as AnnouncementError[],
  sections: [
    {
      announcements: {
        title: "f",
        subtitle: "f",
        announcement_items: [
          {
            title: "",
            description: "",
            link: "",
          },
        ],
      },
    },
  ],
}
const sectionIndex = 0

const announcementMeta = {
  title: "Components/Homepage/AnnouncementSection",
  component: AnnouncementSection,
  decorators: [
    (StoryFn) => {
      return (
        <DragDropContext onDragEnd={() => console.log("On Drag End")}>
          <Editable.Droppable editableId="announcement">
            <Editable.Accordion onChange={() => console.log("On Change")}>
              <Editable.EditableAccordionItem title="announcement">
                <EditableContextProvider
                  onDragEnd={() => console.log("Drag ended")}
                  onChange={() => console.log("Changed")}
                  onCreate={() => console.log("Created")}
                  onDelete={() => console.log("Deleted")}
                  onDisplay={() => console.log("Displayed")}
                >
                  <Editable.DraggableAccordionItem
                    index={sectionIndex}
                    tag={<Tag variant="subtle">Announcement</Tag>}
                    title={sectionEg.announcements.title || "New Announcement"}
                    isInvalid={_.some(
                      errorsEg.sections[sectionIndex].announcements
                    )}
                    draggableId={`section-${sectionIndex}-draggable`}
                  >
                    <StoryFn />
                  </Editable.DraggableAccordionItem>
                </EditableContextProvider>
              </Editable.EditableAccordionItem>
            </Editable.Accordion>
          </Editable.Droppable>
        </DragDropContext>
      )
    },
  ],
} as Meta<typeof AnnouncementSection>

// export const DefaultTemplate = () => {
//   const [title, setTitle] = React.useState("Announcement Title")
//   const [subtitle, setSubtitle] = React.useState("Announcement Subtitle")
//   const { onChange, onDelete } = useEditableContext()

//   return (
//     <AnnouncementSection
//       {...section.announcements}
//       title={section.announcements.title || "New announcement"}
//       subtitle={section.announcements.subtitle || "New subtitle "}
//       index={sectionIndex}
//       errors={errors.sections[sectionIndex].announcements}
//     >
//       <AnnouncementBody
//         {...section.announcements}
//         announcementItems={section.announcements.announcement_items}
//         errors={{
//           ...errors,
//         }}
//       />
//     </AnnouncementSection>
//   )
// }
const Template: StoryFn<typeof AnnouncementSection> = (args) => {
  return <AnnouncementSection {...args}>args.children</AnnouncementSection>
}

export const Default = Template.bind({})
Default.args = {
  ...sectionEg.announcements,
  index: sectionIndex,
  errors: { ...errorsEg },
  children: (
    <AnnouncementBody
      announcementItems={[]}
      errors={{
        announcementItems: [],
      }}
    />
  ),
}
export default announcementMeta
