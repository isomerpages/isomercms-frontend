import React, { useContext, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

// Import contexts
const { LoginContext } = require('../contexts/LoginContext')

const AuthCallback = () => {
    const { setLogin, isLoggedIn } = useContext(LoginContext)

    useEffect(() => {
        if (!isLoggedIn) setLogin()
    }, [isLoggedIn])

    if (isLoggedIn) return <Redirect to="/sites" />
    return ''
}

export default AuthCallback