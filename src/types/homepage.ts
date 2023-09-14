import type { IterableElement } from "type-fest"

export type DropdownOption = {
  title: string
  url: string
}

export interface DropdownSection {
  title: string
  options: DropdownOption[]
}

export type HighlightOption = {
  title: string
  description: string
  url: string
}

interface BaseHeroSection {
  background: string
  subtitle: string
  title: string
}

export interface DropdownHeroSection extends BaseHeroSection {
  dropdown: DropdownSection
}

export interface HighlightHeroSection extends BaseHeroSection {
  button: string
  url: string
  // eslint-disable-next-line camelcase
  key_highlights: HighlightOption[]
}

export type HeroSection = DropdownHeroSection | HighlightHeroSection

export interface InfobarSection {
  title?: string
  subtitle?: string
  description?: string
  button?: string
  url?: string
}

export interface InfopicSection {
  title?: string
  subtitle?: string
  description?: string
  button?: string
  url?: string
  image?: string
  alt?: string
}

export interface ResourcesSection {
  title?: string
  subtitle?: string
  button?: string
}

export interface AnnouncementsSection {
  title?: string
  subtitle?: string
  announcement_items?: Array<{
    title?: string
    date?: string
    announcement?: string
    link_text?: string
    link_url?: string
  }>
}

export interface HomepageDto {
  content: {
    frontMatter: {
      layout: "homepage"
      title: string
      description?: string
      permalink: string
      notification?: string
      image?: string
      sections: (
        | HeroSection
        | InfobarSection
        | InfopicSection
        | ResourcesSection
        | AnnouncementsSection
      )[]
    }
    pageBody?: string
  }
  sha: string
}

export type EditorHomepageElement = "section" | "dropdownelem" | "highlight"
export type PossibleEditorSections = IterableElement<
  | EditorHomepageState["frontMatter"]["sections"]
  | EditorHeroDropdownSection["dropdown"]["options"]
>

export type HomepageEditorHeroSection =
  | EditorHeroDropdownSection
  | EditorHeroHighlightsSection

export type HeroFrontmatterSection = { hero: HomepageEditorHeroSection }
export type ResourcesFrontmatterSection = { resources: ResourcesSection }

export type InfopicFrontmatterSection = {
  infopic: InfopicSection
}

export type InfobarFrontmatterSection = {
  infobar: InfobarSection
}

export type AnnouncementsFrontmatterSection = {
  announcements: AnnouncementsSection
}

export type EditorHomepageFrontmatterSection =
  | HeroFrontmatterSection
  | ResourcesFrontmatterSection
  | InfopicFrontmatterSection
  | InfobarFrontmatterSection
  | AnnouncementsFrontmatterSection

export const EditorHomepageFrontmatterSection = {
  isHero: (
    section: EditorHomepageFrontmatterSection
  ): section is HeroFrontmatterSection =>
    !!(section as HeroFrontmatterSection).hero,
  isResources: (
    section: EditorHomepageFrontmatterSection
  ): section is ResourcesFrontmatterSection =>
    !!(section as ResourcesFrontmatterSection).resources,
  isInfopic: (
    section: EditorHomepageFrontmatterSection
  ): section is InfopicFrontmatterSection =>
    !!(section as InfopicFrontmatterSection).infopic,
  isInfobar: (
    section: EditorHomepageFrontmatterSection
  ): section is InfobarFrontmatterSection =>
    !!(section as InfobarFrontmatterSection).infobar,
  isAnnouncements: (
    section: EditorHomepageFrontmatterSection
  ): section is AnnouncementsFrontmatterSection =>
    !!(section as AnnouncementsFrontmatterSection).announcements,
}

export interface EditorHomepageState {
  frontMatter: Omit<HomepageDto["content"]["frontMatter"], "sections"> & {
    sections: EditorHomepageFrontmatterSection[]
  }
  errors: {
    sections: unknown[]
    dropdownElems: unknown[]
    highlights: unknown[]
  }
  displaySections: unknown[]
  displayDropdownElems: unknown[]
  displayHighlights: unknown[]
}

export interface EditorHeroDropdownSection {
  dropdown: {
    options: Partial<DropdownOption>[]
  }
}

export interface EditorHeroHighlightsSection {
  key_highlights: []
}
