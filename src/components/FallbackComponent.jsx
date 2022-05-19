import elementStyles from "styles/isomer-cms/Elements.module.scss"
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
        <button
          type="button"
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
