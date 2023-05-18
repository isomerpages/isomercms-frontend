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
  images?: string
  alt?: string
}

export interface ResourcesSection {
  title?: string
  subtitle?: string
  button?: string
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
      )[]
    }
    pageBody?: string
  }
  sha: string
}
