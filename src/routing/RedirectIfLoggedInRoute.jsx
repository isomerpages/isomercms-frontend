import { Redirect, Route } from "react-router-dom"

// Import contexts
const { LoginConsumer } = require("contexts/LoginContext")

export default function RedirectIfLoggedInRoute({
  children,
  component: WrappedComponent,
  ...rest
}) {
  return (
    <LoginConsumer>
      {({ userId }) =>
        userId ? (
          <Redirect to="/sites" />
        ) : (
          children ||
          // eslint-disable-next-line react/jsx-props-no-spreading
          (WrappedComponent && <Route {...rest} component={WrappedComponent} />)
        )
      }
    </LoginConsumer>
  )
}
