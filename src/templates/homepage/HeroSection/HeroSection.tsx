// NOTE: jsx-ally is disabled for this file as the output of this
// should match jekyll output as closely as possible.
// As jekyll outputs an <a /> tag like so, this behaviour is preserved here.
/* eslint-disable jsx-a11y/anchor-is-valid */

import { forwardRef } from "react"

import { useFetchPreviewMedia } from "hooks/useFetchPreviewMedia"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import {
  SectionAlignment,
  SectionBackgroundColor,
  SectionSize,
} from "types/hero"
import { EditorHeroDropdownSection, HeroBannerLayouts } from "types/homepage"

import { HeroCenteredLayout } from "./HeroCenteredLayout"
import { HeroImageOnlyLayout } from "./HeroImageOnlyLayout"
import { HeroSideLayout } from "./HeroSideLayout"

/* eslint
  react/no-array-index-key: 0
 */

interface KeyHighlightElemProps {
  title?: string
  description?: string
}

const KeyHighlightElem = ({ title, description }: KeyHighlightElemProps) => (
  <>
    {title || description ? (
      <div className={getClassNames(editorStyles, ["col"])}>
        <div className={editorStyles["is-highlight"]}>
          {/* Title */}
          {title ? (
            <p
              className={getClassNames(editorStyles, [
                "has-text-weight-semibold",
                "has-text-white",
                "key-highlight-title",
                "is-uppercase",
                "padding--top--xs",
              ])}
            >
              {title}
            </p>
          ) : null}
          {/* Description */}
          {description ? (
            <p
              className={getClassNames(editorStyles, [
                "has-text-white-trans",
                "padding--bottom--sm",
              ])}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    ) : null}
  </>
)
interface KeyHighlightsProps {
  highlights: KeyHighlightElemProps[]
}
const KeyHighlights = ({ highlights }: KeyHighlightsProps) => (
  <section
    id={editorStyles["key-highlights"]}
    className={getClassNames(editorStyles, ["bp-section", "is-paddingless"])}
  >
    <div
      id="key-highlights"
      className={getClassNames(editorStyles, ["bp-container"])}
    >
      <div
        className={getClassNames(editorStyles, [
          "row",
          "is-gapless",
          "has-text-centered",
        ])}
      >
        {highlights.map(({ title, description }, idx) => (
          <KeyHighlightElem
            title={title}
            description={description}
            key={`${title}-${idx}`}
          />
        ))}
      </div>
    </div>
  </section>
)

interface TemplateHeroSectionProps {
  hero: {
    background?: string
    title?: string
    subtitle?: string
    button?: string
    dropdown: EditorHeroDropdownSection["dropdown"]
    // eslint-disable-next-line camelcase
    key_highlights: {
      title?: string
      description?: string
    }[]
    alignment: SectionAlignment
    size: SectionSize
    backgroundColor: SectionBackgroundColor
  }
  dropdownIsActive: boolean
  toggleDropdown: () => void
  variant: HeroBannerLayouts
}

export const TemplateHeroSection = forwardRef<
  HTMLDivElement,
  TemplateHeroSectionProps
>(
  (
    {
      hero,
      dropdownIsActive,
      toggleDropdown,
      variant,
    }: TemplateHeroSectionProps,
    ref
  ) => {
    const loadedImageURL = useFetchPreviewMedia(hero.background)

    const heroStyle = {
      // See j08691's answer at https://stackoverflow.com/questions/21388712/background-size-doesnt-work
      background: `url(${loadedImageURL}) no-repeat center center/cover`,
    }
    return (
      <div ref={ref}>
        {/* Main hero banner */}
        <section
          className={getClassNames(editorStyles, ["bp-hero", "bg-hero"])}
          style={heroStyle}
        >
          {variant === "center" && (
            <HeroCenteredLayout
              hero={hero}
              dropdownIsActive={dropdownIsActive}
              toggleDropdown={toggleDropdown}
            />
          )}
          {variant === "image" && <HeroImageOnlyLayout />}
          {variant === "side" && (
            <HeroSideLayout
              {...hero}
              title={hero.title || ""}
              dropdownIsActive={dropdownIsActive}
              toggleDropdown={toggleDropdown}
            />
          )}
        </section>
        {/* Key highlights */}
        {!hero.dropdown && hero.key_highlights ? (
          <KeyHighlights highlights={hero.key_highlights} />
        ) : null}
      </div>
    )
  }
)
