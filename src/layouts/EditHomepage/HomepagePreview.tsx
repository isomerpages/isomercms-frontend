// NOTE: Below eslint disable is inherited from our legacy code :(
/* eslint-disable react/no-array-index-key */
import _ from "lodash"
import { Ref, useState } from "react"
import { useParams } from "react-router-dom"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import TemplateHeroSection from "templates/homepage/HeroSection"
import TemplateInfobarSection from "templates/homepage/InfobarSection"
import TemplateInfopicLeftSection from "templates/homepage/InfopicLeftSection"
import TemplateInfopicRightSection from "templates/homepage/InfopicRightSection"
import TemplateResourcesSection from "templates/homepage/ResourcesSection"
import { getClassNames } from "templates/utils/stylingUtils"

import {
  EditorHomepageFrontmatterSection,
  EditorHomepageState,
  InfopicFrontmatterSection,
} from "types/homepage"

import {
  INFOBAR_SECTION,
  INFOPIC_SECTION,
  RESOURCES_SECTION,
} from "./constants"

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
  const { siteName } = useParams<{ siteName: string }>()
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
                ref={scrollRefs[sectionIndex]}
              />
            </>
          )}
          {/* Resources section */}
          {EditorHomepageFrontmatterSection.isResources(section) && (
            <>
              <TemplateResourcesSection
                key={`section-${sectionIndex}`}
                {...RESOURCES_SECTION}
                {..._.pickBy(section.resources)}
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
                {...INFOBAR_SECTION}
                {..._.pickBy(section.infobar)}
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
                  {...INFOPIC_SECTION}
                  {..._.pickBy(section.infopic)}
                  sectionIndex={sectionIndex}
                  ref={scrollRefs[sectionIndex]}
                />
              ) : (
                <TemplateInfopicRightSection
                  key={`section-${sectionIndex}`}
                  {...INFOPIC_SECTION}
                  {..._.pickBy(section.infopic)}
                  sectionIndex={sectionIndex}
                  ref={scrollRefs[sectionIndex]}
                />
              )}
            </>
          )}
        </>
      ))}
    </div>
  )
}
