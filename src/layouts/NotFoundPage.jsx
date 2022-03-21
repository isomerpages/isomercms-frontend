import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import errorStyles from "styles/isomer-cms/pages/Error.module.scss"

const NotFoundPage = ({ match }) => {
  const { siteName } = match?.params
  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <img
          className={errorStyles.errorImage}
          alt="Page Not Found Error"
          src="/404Error.svg"
        />
        <div className={errorStyles.errorText}>
          The page you are looking for does not exist anymore.
          <br />
          Try refreshing your page when you return.
        </div>

        <Link to={siteName ? `/sites/${siteName}/workspace` : "/sites"}>
          <button
            type="button"
            className={`${errorStyles.errorButton} ${elementStyles.blue}`}
          >
            Back to IsomerCMS
          </button>
        </Link>
      </div>
    </>
  )
}

export default NotFoundPage

NotFoundPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
