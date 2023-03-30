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
      // eslint-disable-next-line react/jsx-props-no-spreading
      (WrappedComponent && <Route {...rest} component={WrappedComponent} />)
  )
}
