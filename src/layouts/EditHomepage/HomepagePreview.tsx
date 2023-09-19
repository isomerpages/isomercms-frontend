// NOTE: Below eslint disable is inherited from our legacy code :(
/* eslint-disable react/no-array-index-key */
import { Ref, useState } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { TemplateAnnouncementsSection } from "templates/homepage/AnnouncementsSection"
import { TemplateHeroSection } from "templates/homepage/HeroSection"
import TemplateInfobarSection from "templates/homepage/InfobarSection"
import TemplateInfopicLeftSection from "templates/homepage/InfopicLeftSection"
import TemplateInfopicRightSection from "templates/homepage/InfopicRightSection"
import TemplateResourcesSection from "templates/homepage/ResourcesSection"
import TextCardsSection from "templates/homepage/TextCardsSection"
import { getClassNames } from "templates/utils/stylingUtils"

import {
  EditorHomepageFrontmatterSection,
  EditorHomepageState,
  InfopicFrontmatterSection,
} from "types/homepage"

const isLeftInfoPic = (
  sectionIndex: number,
  frontMatter: EditorHomepageState["frontMatter"]
): boolean => {
  // If the previous section in the list was not an infopic section
  // or if the previous section was a right infopic section, return true
  return (
    !(frontMatter.sections[sectionIndex - 1] as InfopicFrontmatterSection)
      .infopic || !isLeftInfoPic(sectionIndex - 1, frontMatter)
  )
}

interface HomepagePreviewProps {
  frontMatter: EditorHomepageState["frontMatter"]
  scrollRefs: Ref<unknown>[]
}
export const HomepagePreview = ({
  frontMatter,
  scrollRefs,
}: HomepagePreviewProps) => {
  const [dropdownIsActive, setDropdownIsActive] = useState(false)

  const toggleDropdown = () => setDropdownIsActive((prevState) => !prevState)

  return (
    <div className={editorStyles.homepageEditorMain}>
      {/* Isomer Template Pane */}
      {/* Notification */}
      {frontMatter.notification && (
        <div
          id="notification-bar"
          className={getClassNames(editorStyles, [
            "bp-notification",
            "is-marginless",
            "bg-secondary",
          ])}
        >
          <div className={editorStyles["bp-container"]}>
            <div className={editorStyles.row}>
              <div className={editorStyles.col}>
                <div
                  className={getClassNames(editorStyles, [
                    "field",
                    "has-addons",
                    "bp-notification-flex",
                  ])}
                >
                  <div
                    className={getClassNames(editorStyles, [
                      "control",
                      "has-text-centered",
                      "has-text-white",
                    ])}
                  >
                    <h6>{frontMatter.notification}</h6>
                  </div>
                  <div
                    className={getClassNames(editorStyles, [
                      "button",
                      "has-text-white",
                    ])}
                  >
                    <span
                      className={getClassNames(editorStyles, [
                        "sgds-icon",
                        "sgds-icon-cross",
                      ])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Template preview section */}
      {frontMatter.sections.map((section, sectionIndex) => (
        <>
          {/* Hero section */}
          {EditorHomepageFrontmatterSection.isHero(section) && (
            <>
              <TemplateHeroSection
                key={`section-${sectionIndex}`}
                hero={section.hero}
                dropdownIsActive={dropdownIsActive}
                toggleDropdown={toggleDropdown}
                ref={scrollRefs[sectionIndex] as Ref<HTMLDivElement>}
                variant={section.hero.variant}
              />
            </>
          )}
          {/* Resources section */}
          {EditorHomepageFrontmatterSection.isResources(section) && (
            <>
              <TemplateResourcesSection
                key={`section-${sectionIndex}`}
                title={section.resources.title}
                subtitle={section.resources.subtitle}
                button={section.resources.button}
                sectionIndex={sectionIndex}
                ref={scrollRefs[sectionIndex]}
              />
            </>
          )}
          {/* Infobar section */}
          {EditorHomepageFrontmatterSection.isInfobar(section) && (
            <>
              <TemplateInfobarSection
                key={`section-${sectionIndex}`}
                title={section.infobar.title}
                subtitle={section.infobar.subtitle}
                description={section.infobar.description}
                button={section.infobar.button}
                sectionIndex={sectionIndex}
                ref={scrollRefs[sectionIndex]}
              />
            </>
          )}
          {/* Infopic section */}
          {EditorHomepageFrontmatterSection.isInfopic(section) && (
            <>
              {isLeftInfoPic(sectionIndex, frontMatter) ? (
                <TemplateInfopicLeftSection
                  key={`section-${sectionIndex}`}
                  title={section.infopic.title}
                  subtitle={section.infopic.subtitle}
                  description={section.infopic.description}
                  imageUrl={section.infopic.image}
                  imageAlt={section.infopic.alt}
                  button={section.infopic.button}
                  sectionIndex={sectionIndex}
                  ref={scrollRefs[sectionIndex]}
                />
              ) : (
                <TemplateInfopicRightSection
                  key={`section-${sectionIndex}`}
                  title={section.infopic.title}
                  subtitle={section.infopic.subtitle}
                  description={section.infopic.description}
                  imageUrl={section.infopic.image}
                  imageAlt={section.infopic.alt}
                  button={section.infopic.button}
                  sectionIndex={sectionIndex}
                  ref={scrollRefs[sectionIndex]}
                />
              )}
            </>
          )}
          {/* Announcements section */}
          {EditorHomepageFrontmatterSection.isAnnouncements(section) && (
            <>
              <TemplateAnnouncementsSection
                key={`section-${sectionIndex}`}
                title={section.announcements.title}
                subtitle={section.announcements.subtitle}
                announcementItems={section.announcements.announcement_items}
                sectionIndex={sectionIndex}
                ref={scrollRefs[sectionIndex] as Ref<HTMLDivElement>}
              />
            </>
          )}
          {/* Textcard section */}
          {EditorHomepageFrontmatterSection.isTextcard(section) && (
            <>
              <TextCardsSection
                key={`section-${sectionIndex}`}
                title={section.textcards.title}
                subtitle={section.textcards.subtitle}
                description={section.textcards.description}
                cards={section.textcards.cards}
              />
            </>
          )}
        </>
      ))}
    </div>
  )
}
