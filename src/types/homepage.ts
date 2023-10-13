import type { IterableElement, SetOptional } from "type-fest"

import { HERO_LAYOUTS } from "constants/homepage"

import { SectionAlignment, SectionBackgroundColor, SectionSize } from "./hero"

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

export type AnnouncementOption = {
  title: string
  date: string
  announcement: string
  link_text: string
  link_url: string
}

export type AnnouncementError = AnnouncementOption

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

export interface AnnouncementsBlockSection {
  title?: string
  subtitle?: string
  announcement_items: AnnouncementOption[]
}
export interface TextCardItem {
  title: string
  description?: string
  linktext: string
  url: string
}

export interface TextcardsSection {
  title: string
  subtitle?: string
  description?: string
  cards: TextCardItem[]
}

export interface InfoBox {
  title: string
  description?: string
}
export interface InfoColsSection {
  title: string
  subtitle?: string
  linktext?: string
  url?: string
  infoBoxes: InfoBox[]
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
        | AnnouncementsBlockSection
        | TextcardsSection
        | InfoColsSection
      )[]
    }
    pageBody?: string
  }
  sha: string
}

export type EditorHomepageElement =
  | "section"
  | "dropdownelem"
  | "highlight"
  | "announcement"
  | `textCardItem-${number}`
  | `infoColInfoBox-${number}`

export type PossibleEditorSections = IterableElement<
  | EditorHomepageState["frontMatter"]["sections"]
  | EditorHeroDropdownSection["dropdown"]["options"]
>

export type HeroBannerLayouts = typeof HERO_LAYOUTS[keyof typeof HERO_LAYOUTS]["value"]

export type HomepageEditorHeroSection = EditorHeroDropdownSection &
  EditorHeroHighlightsSection & {
    variant: HeroBannerLayouts
    alignment: SectionAlignment
    size: SectionSize
    backgroundColor: SectionBackgroundColor
  }

export type HeroFrontmatterSection = { hero: HomepageEditorHeroSection }
export type ResourcesFrontmatterSection = { resources: ResourcesSection }

export type InfopicFrontmatterSection = {
  infopic: InfopicSection
}

export type InfobarFrontmatterSection = {
  infobar: InfobarSection
}

export type AnnouncementsFrontmatterSection = {
  announcements: AnnouncementsBlockSection
}

export interface EditortextCardItemsSection {
  cards: []
}

export interface EditorTextcardSection extends EditortextCardItemsSection {
  title: string
  subtitle: string
  description: string
}

export type TextcardFrontmatterSection = {
  textcards: EditorTextcardSection
}

export interface EditorInfoColInfoBoxSection {
  infoboxes: []
}

export interface EditorInfoColsSection extends EditorInfoColInfoBoxSection {
  title: string
  subtitle: string
  linktext: string
  url: string
}

export type InfoColsFrontmatterSection = {
  infocols: EditorInfoColsSection
}

export type EditorHomepageFrontmatterSection =
  | HeroFrontmatterSection
  | ResourcesFrontmatterSection
  | InfopicFrontmatterSection
  | InfobarFrontmatterSection
  | AnnouncementsFrontmatterSection
  | TextcardFrontmatterSection
  | InfoColsFrontmatterSection

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
  isTextcard: (
    section: EditorHomepageFrontmatterSection
  ): section is TextcardFrontmatterSection =>
    !!(section as TextcardFrontmatterSection).textcards,
  isInfocols: (
    section: EditorHomepageFrontmatterSection
  ): section is InfoColsFrontmatterSection =>
    !!(section as InfoColsFrontmatterSection).infocols,
}

export interface EditorHomepageState {
  frontMatter: Omit<HomepageDto["content"]["frontMatter"], "sections"> & {
    sections: EditorHomepageFrontmatterSection[]
  }
  errors: {
    sections: unknown[]
    dropdownElems: unknown[]
    highlights: unknown[]
    announcementItems: unknown[]
    textcards: unknown[][]
    infocols: unknown[][]
  }
  displaySections: unknown[]
  displayDropdownElems: unknown[]
  displayHighlights: unknown[]
  displayAnnouncementItems: unknown[]
}

export interface EditorHeroDropdownSection {
  dropdown: {
    title: string
    options: SetOptional<DropdownOption, "url">[]
  }
}

export interface EditorHeroHighlightsSection {
  key_highlights: []
}
