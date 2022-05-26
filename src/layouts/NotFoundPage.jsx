import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

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
          <Button mt="2rem">Back to IsomerCMS</Button>
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
