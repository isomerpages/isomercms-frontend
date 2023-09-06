export const RESOURCES_SECTION = {
  title: "Resources",
  subtitle: "Add a preview and link to your Resource Room",
  button: "",
  id: "resources",
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
