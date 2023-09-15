import moment from "moment-timezone"
import { forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { AnnouncementsBlockSection } from "types/homepage"

type TemplateAnnouncementsSectionProps = Omit<
  AnnouncementsBlockSection,
  "announcement_items"
> & {
  announcementItems: AnnouncementsBlockSection["announcement_items"]
  sectionIndex: number
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
              "bp-container",
              "is-fluid",
              "m-0",
            ])}
          >
            <div className={editorStyles.row}>
              <div className={getClassNames(editorStyles, ["col", "is-full"])}>
                <>
                  {subtitle && (
                    <p
                      className={getClassNames(editorStyles, [
                        "eyebrow",
                        "is-uppercase",
                        "pb-4",
                        "has-text-centered",
                      ])}
                    >
                      {subtitle}
                    </p>
                  )}
                  {title && (
                    <h1
                      className={getClassNames(editorStyles, [
                        "has-text-secondary",
                        "pb-4",
                        "has-text-centered",
                      ])}
                    >
                      <b>{title}</b>
                    </h1>
                  )}

                  <hr
                    className={getClassNames(editorStyles, [
                      "my-8",
                      "announcements-divider",
                    ])}
                  />

                  {announcementItems &&
                    announcementItems.map((announcement, index) => {
                      return (
                        <>
                          <div
                            className={getClassNames(editorStyles, [
                              "row",
                              "is-desktop",
                            ])}
                          >
                            <div
                              className={getClassNames(editorStyles, [
                                "col",
                                "is-4-desktop",
                                "px-lg-6",
                                "mr-lg-6",
                              ])}
                            >
                              <h3
                                className={getClassNames(editorStyles, [
                                  "announcements-announcement-title",
                                  "mb-4",
                                ])}
                              >
                                <b>{announcement.title}</b>
                              </h3>
                              <p
                                className={
                                  editorStyles[
                                    "announcements-announcement-subtitle"
                                  ]
                                }
                              >
                                {moment(announcement.date, "DD/MM/YYYY").format(
                                  "DD MMMM YYYY"
                                )}
                              </p>
                            </div>
                            <div
                              className={getClassNames(editorStyles, [
                                "col",
                                "px-lg-6",
                              ])}
                            >
                              <p>{announcement.announcement}</p>
                              {announcement.link_text && announcement.link_url && (
                                <div className={editorStyles["mt-4"]}>
                                  <div
                                    className={
                                      editorStyles[
                                        "announcements-announcement-link"
                                      ]
                                    }
                                  >
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
                                "mt-8",
                                "mb-0",
                                "announcements-divider",
                              ])}
                            />
                          ) : (
                            <hr
                              className={getClassNames(editorStyles, [
                                "my-8",
                                "announcements-divider",
                              ])}
                            />
                          )}
                        </>
                      )
                    })}
                </>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
)
