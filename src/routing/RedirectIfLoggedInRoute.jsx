import { Redirect, Route } from "react-router-dom"

// Import contexts
const { useLoginContext } = require("contexts/LoginContext")

export default function RedirectIfLoggedInRoute({
  children,
  unauthedComponent: WrappedComponent,
  ...rest
}) {
  const { displayedName } = useLoginContext()
  return displayedName ? (
    <Redirect to="/sites" />
  ) : (
    children ||
      (WrappedComponent && <Route {...rest} component={WrappedComponent} />)
  )
}
