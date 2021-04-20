import React, { useContext, useEffect, useState } from 'react'
import { Redirect, Route } from 'react-router-dom'
import axios from 'axios'

// Import layouts
import Home from '../layouts/Home';

// Import contexts
const { LoginContext } = require('../contexts/LoginContext')

// Constants
const authContextString = '#isomercms'
const userIdKey = 'userId'

// axios settings
axios.defaults.withCredentials = true

const ProtectedRoute = ({ component: WrappedComponent, ...rest }) => {
    const { isLoggedIn } = useContext(LoginContext)
    const [pageNotFound, setPageNotFound] = useState()
    const { siteName } = rest.computedMatch?.params
    
    useEffect(() => {
        let _isMounted = true
        const fetchData = async () => {
            try {
                await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}`)
                if (_isMounted) setPageNotFound(false)
            } catch (e) {
                if (_isMounted) setPageNotFound(true)
            }
        }
        if (siteName) {
            fetchData()
        } else {
            if (_isMounted) setPageNotFound(false)
        }

        return () => { _isMounted = false } 
    }, [siteName])

    return (
        (pageNotFound !== undefined) &&
        <Route {...rest} render={
            props => {
                if (rest.location.pathname === '/auth') {
                    const [ hash, userId ] = rest.location.hash.split('-')
                    if (hash === authContextString) {
                        localStorage.setItem(userIdKey, userId)
                        return <WrappedComponent {...rest} {...props} isLoggedIn={isLoggedIn} />
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

                            // Clear state
                            window.history.pushState({}, document.title)

                            // Logging out using sign out button
                            return <Home {...rest} {...props} />
                        }

                        // If logged in, and requesting `/`, but not from logout button
                        return <Redirect to="/sites" />
                    }

                    if (pageNotFound) {
                        // User attempting to access a site that doesn't exist
                        return <Redirect to="/not-found" />
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