import React from 'react'
import { Redirect, Route } from 'react-router-dom'

// Import layouts
import Home from '../layouts/Home';

// Constants
const authContextString = '#isomercms'

const ProtectedRoute = ({ component: WrappedComponent, isLoggedIn, ...rest }) => {
    return (
        <Route {...rest} render={
            props => {
                if (rest.location.pathname === '/auth') {
                    if (rest.location.search === authContextString) {
                        console.log('Redirecting to sites...')
                        window.history.pushState({}, document.title, '/auth')
                        return <WrappedComponent {...rest} {...props} />
                    }
                    return <Redirect to="/" />
                }

                if (isLoggedIn) {
                    console.log('User is logged in', rest.location.pathname)
                    // If logged in, and user attempts to navigate to the login page through the URL instead of the sign out button
                    // we will render the Sites page instead. The user will still be able to logout using the log out button since
                    // it clears the cookie
                    if (rest.location.pathname === '/') {
                        if (rest.location.state?.isFromSignOutButton) {
                            console.log('Accessing the / path using the log out button')

                            // Logging out using sign out button
                            return <Home {...rest} {...props} />
                        }

                        // According to route logic in App.jsx, WrappedComponent is a redirect to /sites
                        // when a user is logged in and searches for the '/' path
                    }

                    return <WrappedComponent {...rest} {...props} />
                }

                console.log('User is not logged in at', rest.location.pathname)
                // Render login component if not logged in
                if (rest.location.pathname === '/') {
                    return <Home {...rest} {...props} />
                }

                // Redirect all URLs to Login component when not logged in
                return <Redirect to={{ pathname: '/' }} />
            }
        } />
    )
}

export default ProtectedRoute;