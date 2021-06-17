import React from "react"

import errorStyles from "../styles/isomer-cms/pages/Error.module.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

function FallbackComponent({ error }) {
  console.log(error)

  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <img
          className={errorStyles.errorImage}
          alt="Generic Error Image"
          src="/genericError.svg"
        />
        <div className={errorStyles.errorText}>
          Whoops, something went wrong.
          <br />
          Click below to return to IsomerCMS.
        </div>
        <button
          className={`${errorStyles.errorButton} ${elementStyles.blue}`}
          onClick={() => window.location.reload()}
        >
          Back to IsomerCMS
        </button>
      </div>
    </>
  )
}

export default FallbackComponent
