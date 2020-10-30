import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const ProtectedRoute = ({ component: WrappedComponent, isLoggedIn, setIsLoggedIn, ...rest }) => {
    return (
      <Route {...rest} render={
        props => {
          if (isLoggedIn) {
            console.log('User is logged in', rest.location.pathname)
            // If logged in, and user attempts to navigate to the login page through the URL instead of the sign out button
            // we will render the Alerts page instead. The user will still be able to logout using the sign out button since
            // it clears the cookie
            if (rest.location.pathname === '/') {
              if (rest.location.state?.isFromSignOutButton) {
                console.log('Logging out using sign out button')
                setIsLoggedIn(false)
                // Logging out using sign out button
                return <WrappedComponent {...rest} {...props} setIsLoggedIn={setIsLoggedIn} />
              }
  
              console.log('Trying to log out using URL')
              // Preventing logout since the sign out button was not used
              return (
                <Redirect to={
                  {
                    pathname: '/sites',
                  }}
                />
              )
            }
  
            return <WrappedComponent {...rest} {...props} />
          }
  
          console.log('User is not logged in at', rest.location.pathname)
          // Render login component when not logged in
          if (rest.location.pathname === '/') {
            return <WrappedComponent {...rest} {...props} setIsLoggedIn={setIsLoggedIn} />
          }
  
          // Redirect all URLs to Login component when not logged in
          return (
            <Redirect to={
              {
                pathname: '/',
              }}
            />
          )
        }
      } />
    )
  }
  
  export default ProtectedRoute;
  
  