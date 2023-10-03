import { Ref, forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { AnnouncementsBlockSection } from "types/homepage"

type TemplateAnnouncementsSectionProps = Omit<
  AnnouncementsBlockSection,
  "announcement_items"
> & {
  announcementItems: AnnouncementsBlockSection["announcement_items"]
  sectionIndex: number
  announcementScrollRefs: Ref<HTMLDivElement>[]
}

export const TemplateAnnouncementsSection = forwardRef<
  HTMLDivElement,
  TemplateAnnouncementsSectionProps
>(
  (
    {
      title,
      subtitle,
      announcementItems,
      sectionIndex,
      announcementScrollRefs,
    }: TemplateAnnouncementsSectionProps,
    ref
  ) => {
    return (
      <div ref={ref}>
        <section
          className={getClassNames(editorStyles, [
            `bp-section`,
            sectionIndex % 2 === 1 ? "bg-newssection" : "",
            "px-14",
            "px-md-24",
            "py-24",
          ])}
        >
          <div
            className={getClassNames(editorStyles, [
              "announcements-section",
              "mx-auto",
              "is-flex",
            ])}
          >
            {subtitle && (
              <p
                className={getClassNames(editorStyles, [
                  "subtitle-2",
                  "eyebrow",
                  "is-uppercase",
                  "mb-2",
                  "has-text-centered",
                ])}
              >
                {subtitle}
              </p>
            )}
            {title && (
              <h1
                className={getClassNames(editorStyles, [
                  "h1",
                  "has-text-secondary",
                  "mb-12",
                  "has-text-centered",
                ])}
              >
                {title}
              </h1>
            )}

            <div
              className={getClassNames(editorStyles, ["row", "w-100", "m-0"])}
            >
              <div
                className={getClassNames(editorStyles, [
                  "col",
                  "is-full",
                  "p-0",
                ])}
              >
                <hr
                  className={getClassNames(editorStyles, [
                    "mb-2",
                    "mt-0",
                    "announcements-divider",
                  ])}
                />

                {announcementItems &&
                  announcementItems.map((announcement, index) => {
                    return (
                      <div ref={announcementScrollRefs[index]}>
                        <div
                          className={getClassNames(editorStyles, [
                            "row",
                            "is-desktop",
                            "px-0",
                            "py-6",
                            "py-lg-0",
                            "m-0",
                          ])}
                        >
                          <div
                            className={getClassNames(editorStyles, [
                              "col",
                              "is-4-desktop",
                              "p-0",
                              "p-lg-6",
                              "mb-6",
                              "mb-lg-0",
                              "mr-lg-6",
                            ])}
                          >
                            <h3
                              className={getClassNames(editorStyles, [
                                "h3",
                                "mb-2",
                                "mb-lg-4",
                              ])}
                            >
                              {announcement.title}
                            </h3>
                            <p className={editorStyles["subtitle-1"]}>
                              {announcement.date}
                            </p>
                          </div>
                          <div
                            className={getClassNames(editorStyles, [
                              "col",
                              "p-0",
                              "p-lg-6",
                            ])}
                          >
                            <p className={editorStyles["body-1"]}>
                              {announcement.announcement}
                            </p>
                            {announcement.link_text && announcement.link_url && (
                              <div
                                className={getClassNames(editorStyles, [
                                  "mt-6",
                                  "mt-lg-4",
                                ])}
                              >
                                <div className={editorStyles.link}>
                                  <span>{announcement.link_text}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {announcementItems &&
                        announcementItems.length === index + 1 ? (
                          <hr
                            className={getClassNames(editorStyles, [
                              "mt-2",
                              "mb-0",
                              "announcements-divider",
                            ])}
                          />
                        ) : (
                          <hr
                            className={getClassNames(editorStyles, [
                              "my-2",
                              "announcements-divider",
                            ])}
                          />
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
)
