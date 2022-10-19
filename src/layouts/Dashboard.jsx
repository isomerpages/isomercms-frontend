import { useDisclosure, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { CollaboratorModal } from "components/CollaboratorModal/index"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

import errorStyles from "styles/isomer-cms/pages/Error.module.scss"

const Dashboard = ({ match }) => {
  const { siteName } = match.params
  const props = useDisclosure()
  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <VStack spacing="2rem">
          <div className={errorStyles.errorText}>
            Dashboard
            <br />
            This is a temporary page that will be updated later.
          </div>
          <Link to="/sites">
            <Button>All sites</Button>
          </Link>

          <Link to={`/sites/${siteName}/workspace`}>
            <Button>Workspace</Button>
          </Link>
          <Button onClick={props.onOpen}>Open collaborators modal</Button>
        </VStack>
      </div>
      <CollaboratorModal siteName={siteName} {...props} />
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
