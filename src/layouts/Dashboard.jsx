import { Button } from "@opengovsg/design-system-react"
import { CollaboratorModal } from "components/CollaboratorModal/index"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import errorStyles from "styles/isomer-cms/pages/Error.module.scss"

const Dashboard = ({ match }) => {
  const { siteName } = match.params
  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <div className={errorStyles.errorText}>
          Dashboard
          <br />
          This is a temporary page that will be updated later.
        </div>

        <Link to="/sites">
          <Button mt="2rem">All sites</Button>
        </Link>

        <Link to={`/sites/${siteName}/workspace`}>
          <Button mt="2rem">Workspace</Button>
        </Link>
      </div>

      <CollaboratorModal siteName={siteName} />
    </>
  )
}

export default Dashboard

Dashboard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
}
