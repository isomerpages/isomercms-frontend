import _ from "lodash"
import { ForwardedRef, forwardRef } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { InfocolsSection } from "types/homepage"

interface TemplateTextCardsSectionProps extends InfocolsSection {
  sectionIndex: number
}

const TemplateInfocolsSection = forwardRef<
  HTMLDivElement,
  TemplateTextCardsSectionProps
>(
  (
    {
      title,
      subtitle,
      linktext,
      url,
      infoboxes,
      sectionIndex,
    }: TemplateTextCardsSectionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const getInfoBox = (infoboxTitle: string, infoboxDescription?: string) => {
      return (
        <div
          className={getClassNames(editorStyles, [
            "infocols-infobox-body",
            "is-flex",
            "p-6",
          ])}
        >
          <h3 className={editorStyles.h3}>{infoboxTitle}</h3>
          {infoboxDescription && (
            <p
              className={getClassNames(editorStyles, [
                "body-1",
                "infocols-infobox-description",
              ])}
            >
              {infoboxDescription}
            </p>
          )}
        </div>
      )
    }
    return (
      <section
        className={getClassNames(editorStyles, [
          "px-8",
          "px-sm-16",
          "px-md-24",
          "py-24",
          sectionIndex % 2 === 1 ? "bg-newssection" : "",
        ])}
        ref={ref}
      >
        <div className={editorStyles["infocols-container"]}>
          <div
            className={getClassNames(editorStyles, [
              "infocols-section",
              "is-flex",
            ])}
          >
            <div
              className={getClassNames(editorStyles, [
                "infocols-header",
                "is-flex",
              ])}
            >
              {subtitle && (
                <p className={editorStyles["subtitle-2"]}>{subtitle}</p>
              )}

              <h1
                className={getClassNames(editorStyles, [
                  "h1",
                  "has-text-secondary",
                  "has-text-centered",
                ])}
              >
                {title}
              </h1>
            </div>

            <div
              className={getClassNames(editorStyles, [
                "infocols-infobox-section-grid",
                "is-flex",
              ])}
            >
              {infoboxes.length === 4
                ? _.chunk(infoboxes, 2).map((infoboxGroup) => {
                    return (
                      <div
                        className={getClassNames(editorStyles, [
                          "infocols-infobox-section",
                          "has-text-left",
                          "is-flex",
                          infoboxes.length > 2 ? "space-between" : "", // This specifically helps to make 3 infocols wrap nicely to 2 rows for md-xl screens
                        ])}
                      >
                        {infoboxGroup.map((infobox) => {
                          return getInfoBox(infobox.title, infobox.description)
                        })}
                      </div>
                    )
                  })
                : infoboxes.map((infobox) => {
                    return (
                      <div
                        className={getClassNames(editorStyles, [
                          "infocols-infobox-section",
                          "has-text-left",
                          "is-flex",
                          infoboxes.length > 2 ? "space-between" : "", // This specifically helps to make 3 infocols wrap nicely to 2 rows for md-xl screens
                        ])}
                      >
                        {getInfoBox(infobox.title, infobox.description)}
                      </div>
                    )
                  })}
            </div>
            {linktext && url && (
              <span
                className={getClassNames(editorStyles, [
                  "bp-sec-button",
                  "infocols-footer",
                  "is-flex",
                ])}
              >
                <span
                  className={getClassNames(editorStyles, [
                    "infocols-linktext",
                    "mr-3",
                  ])}
                >
                  {linktext}
                </span>
                <i
                  className={getClassNames(editorStyles, [
                    "sgds-icon",
                    "sgds-icon-arrow-right",
                    "is-size-4",
                    "infocols-link-icon",
                  ])}
                  aria-hidden="true"
                />
              </span>
            )}
          </div>
        </div>
      </section>
    )
  }
)

export default TemplateInfocolsSection
