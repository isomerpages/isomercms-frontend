import elementStyles from "styles/isomer-cms/Elements.module.scss"
import React, { useState } from "react"

export const CardContainer = ({ cardTitle, children, isError, onClose }) => {
  const [shouldDisplay, setShouldDisplay] = useState(false)

  return (
    <div
      className={`${elementStyles.card} ${
        !shouldDisplay && isError ? elementStyles.error : ""
      }`}
    >
      <div className={elementStyles.cardHeader}>
        <h2>{cardTitle}</h2>
        <button
          className="pl-3"
          type="button"
          onClick={() => {
            setShouldDisplay(!shouldDisplay)
            if (shouldDisplay && onClose) onClose()
          }}
        >
          <i
            className={`bx ${
              shouldDisplay ? "bx-chevron-down" : "bx-chevron-right"
            }`}
          />
        </button>
      </div>
      {shouldDisplay && <>{children}</>}
    </div>
  )
}
