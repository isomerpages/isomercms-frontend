import moment from "moment"

export const RESOURCES_SECTION = {
  title: "Resources",
  subtitle: "Add a preview and link to your Resource Room",
  id: "resources",
} as const

export type AnnouncementSectionType = {
  readonly title: string
  readonly date: string
  readonly announcement: string
  readonly link_text: string
  readonly link_url: string
}

export const getDefaultAnnouncementSection = (): AnnouncementSectionType => {
  return {
    title: "New Announcement",
    date: moment(
      new Date()
        .toLocaleString("en-SG", {
          timeZone: "Asia/Singapore",
        })
        .slice(0, "dd/mm/yyyy".length),
      "DD/MM/YYYY"
    ).format("DD MMMM YYYY"),
    announcement: "Announcement content",
    link_text: "",
    link_url: "",
  }
}
export const ANNOUNCEMENT_BLOCK = {
  title: "Announcements",
  id: "announcements",
  subtitle: "Add a list of announcements with dates",
  announcement_items: [] as AnnouncementSectionType[],
} as const

export const INFOBAR_SECTION = {
  title: "Infobar",
  subtitle: "Add informational text",
  id: "infobar",
  description: "Infobar description",
  button: "Button Text",
  url: "",
} as const

export const INFOPIC_SECTION = {
  title: "Infopic",
  subtitle: "Add an image and text",
  id: "infopic",
  description: "Infopic description",
  button: "Button Text",
  url: "", // No default value so that no broken link is created
  image: "", // Always blank since the image modal handles this
  alt: "Image alt text",
} as const

export const KEY_HIGHLIGHT_SECTION = {
  title: "Key Highlight Title",
  description: "Key Highlight description",
  url: "", // No default value so that no broken link is created
} as const

export const DROPDOWN_ELEMENT_SECTION = {
  title: "Hero Dropdown Element Title",
  url: "", // No default value so that no broken link is created
} as const

export const DROPDOWN_SECTION = {
  title: "Hero Dropdown Title",
  options: [],
} as const

export const TEXTCARDS_BLOCK_SECTION = {
  title: "Text Cards",
  subtitle: "Add informational text",
  id: "textcards",
  description: "Text card description",
} as const

export const TEXTCARDS_ITEM_SECTION = {
  title: "Card",
  description: "Card description",
  linktext: "Learn more",
  url: "", // No default value so that no broken link is created
} as const

export const DEFAULT_NUMBER_OF_TEXTCARD_ITEMS = 3

export const INFOCOLS_BLOCK_SECTION = {
  title: "Info-columns",
  subtitle: "Add snippets of text in columns",
  id: "infocols",
  linktext: "Learn more",
  url: "", // No default value so that no broken link is created
  infoboxes: [],
} as const

export const INFOCOLS_INFOBOX_SECTION = {
  title: "Infobox",
  description: "Infobox description",
} as const

export const DEFAULT_NUMBER_OF_INFOCOL_INFOBOXES = 3
