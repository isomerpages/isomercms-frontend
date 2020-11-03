import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom';

const AuthCallback = ({ setLogin }) => {
    const [shouldRedirectToSites, setShouldRedirectToSites] = useState(false)
    useEffect(() => {
        setLogin()
        setShouldRedirectToSites(true)
    })

    if (shouldRedirectToSites) return <Redirect to="/sites" />
    return ''
}

export default AuthCallback