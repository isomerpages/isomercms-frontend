import { ForwardedRef, forwardRef, RefObject } from "react"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import { getClassNames } from "templates/utils/stylingUtils"

import { TextcardsSection } from "types/homepage"

interface TemplateTextCardsSectionProps extends TextcardsSection {
  sectionIndex: number
}

const TemplateTextCardsSection = forwardRef<
  HTMLDivElement,
  TemplateTextCardsSectionProps
>(
  (
    {
      title,
      subtitle,
      description,
      cards,
      sectionIndex,
    }: TemplateTextCardsSectionProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
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
        <div
          className={getClassNames(editorStyles, [
            "textcards-section",
            "is-flex",
          ])}
        >
          <p className={getClassNames(editorStyles, ["subtitle-2", "pb-4"])}>
            {subtitle}
          </p>
          <h1
            className={getClassNames(editorStyles, [
              "h1",
              "has-text-secondary",
              "has-text-centered",
              "pb-4",
            ])}
          >
            {title}
          </h1>
          <p
            className={getClassNames(editorStyles, [
              "body-1",
              "has-text-centered",
              "pb-12",
            ])}
          >
            {description}
          </p>
          <div
            className={getClassNames(editorStyles, [
              "textcards-card-section",
              "has-text-left",
              "is-flex",
            ])}
          >
            {!!cards &&
              cards.map((card) => (
                <>
                  <div
                    className={getClassNames(editorStyles, [
                      "textcards-card-body",
                      "is-flex",
                      "p-6",
                    ])}
                  >
                    <h3 className={editorStyles.h3}>{card.title}</h3>
                    <p
                      className={getClassNames(editorStyles, [
                        "body-1",
                        "textcards-card-description",
                      ])}
                    >
                      {card.description}
                    </p>
                    <p className={editorStyles.link}>{card.linktext}</p>
                  </div>
                </>
              ))}
          </div>
        </div>
      </section>
    )
  }
)

export default TemplateTextCardsSection
