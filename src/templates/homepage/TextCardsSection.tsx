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
          "textcards-section",
          sectionIndex % 2 === 1 ? "bg-newssection" : "",
          "is-flex",
          "px-24",
          "py-16",
        ])}
        ref={ref}
      >
        <p
          className={getClassNames(editorStyles, [
            "textcards-subtitle",
            "pb-2",
          ])}
        >
          {subtitle}
        </p>
        <h1
          className={getClassNames(editorStyles, [
            "textcards-title",
            "has-text-secondary",
            "pb-4",
          ])}
        >
          {title}
        </h1>
        <p
          className={getClassNames(editorStyles, [
            "textcards-description",
            "pb-12",
          ])}
        >
          {description}
        </p>
        <div
          className={getClassNames(editorStyles, [
            "textcards-card-section",
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
                  <h3 className={editorStyles["textcards-card-title"]}>
                    {card.title}
                  </h3>
                  <p className={editorStyles["textcards-card-description"]}>
                    {card.description}
                  </p>
                  <p className={editorStyles["textcards-card-url"]}>
                    {card.linktext}
                  </p>
                </div>
              </>
            ))}
        </div>
      </section>
    )
  }
)

export default TemplateTextCardsSection
