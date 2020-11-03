import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom';

const AuthCallback = ({ setLogin }) => {
    useEffect(() => {
        setLogin()
    })
    return <Redirect to="/sites" />
}

export default AuthCallback