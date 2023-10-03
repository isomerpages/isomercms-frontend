// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import {
  SectionAlignment,
  SectionBackgroundColor,
  SectionSize,
} from "types/hero"
import { EditorHeroDropdownSection } from "types/homepage"

import { HeroInfoboxDesktop } from "./HeroInfoboxDesktop"
import { HeroInfoboxMobile } from "./HeroInfoboxMobile"

interface HeroSideLayoutProps {
  alignment: SectionAlignment
  size: SectionSize
  url?: string
  button?: string
  subtitle?: string
  title: string
  backgroundColor: SectionBackgroundColor
  dropdownIsActive: boolean
  toggleDropdown: () => void
  dropdown?: EditorHeroDropdownSection["dropdown"]
}
export const HeroSideLayout = ({
  alignment = "left",
  size = "md",
  url,
  title,
  subtitle,
  button,
  backgroundColor = "white",
  dropdownIsActive,
  toggleDropdown,
  dropdown,
}: HeroSideLayoutProps) => {
  return (
    <div className={getClassNames(editorStyles, ["bp-hero-body"])}>
      {/* desktop view - done using css media queries */}
      <div className={getClassNames(editorStyles, ["is-hidden-mobile"])}>
        <HeroInfoboxDesktop
          variant="side"
          alignment={alignment}
          size={size}
          url={url}
          button={button}
          title={title}
          subtitle={subtitle}
          backgroundColor={backgroundColor}
          dropdownIsActive={dropdownIsActive}
          toggleDropdown={toggleDropdown}
          dropdown={dropdown}
        />
      </div>

      {/* mobile view - done using css media queries */}
      <div className={getClassNames(editorStyles, ["is-hidden-tablet"])}>
        <HeroInfoboxMobile
          dropdownIsActive={dropdownIsActive}
          toggleDropdown={toggleDropdown}
          dropdown={dropdown}
          url={url}
          button={button}
          title={title}
          backgroundColor={backgroundColor}
        />
      </div>
    </div>
  )
}
