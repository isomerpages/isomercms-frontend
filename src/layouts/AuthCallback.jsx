import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom';

const AuthCallback = ({ setLogin, isLoggedIn }) => {
    useEffect(() => {
        if (!isLoggedIn) setLogin()
    }, [isLoggedIn])

    if (isLoggedIn) return <Redirect to="/sites" />
    return ''
}

export default AuthCallback