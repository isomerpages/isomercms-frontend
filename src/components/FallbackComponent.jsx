import { Button } from "@opengovsg/design-system-react"

import errorStyles from "styles/isomer-cms/pages/Error.module.scss"

function FallbackComponent({ error }) {
  console.log(error)

  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <img
          className={errorStyles.errorImage}
          alt="Generic Error"
          src="/genericError.svg"
        />
        <div className={errorStyles.errorText}>
          Whoops, something went wrong.
          <br />
          Click below to return to IsomerCMS.
        </div>
        <Button onClick={() => window.location.reload()} mt="2rem">
          Back to IsomerCMS
        </Button>
      </div>
    </>
  )
}

export default FallbackComponent
