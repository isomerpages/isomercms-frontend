import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom';

const AuthCallback = ({ setLogin, isLoggedIn }) => {
    useEffect(() => {
        setLogin()
    })

    if (isLoggedIn) return <Redirect to="/sites" />
    return ''
}

export default AuthCallback