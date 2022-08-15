import { Redirect, Route } from "react-router-dom"

// Import contexts
const { useLoginContext } = require("contexts/LoginContext")

export default function RedirectIfLoggedInRoute({
  children,
  component: WrappedComponent,
  ...rest
}) {
  const { accountName } = useLoginContext()
  return accountName ? (
    <Redirect to="/sites" />
  ) : (
    children ||
      // eslint-disable-next-line react/jsx-props-no-spreading
      (WrappedComponent && <Route {...rest} component={WrappedComponent} />)
  )
}
