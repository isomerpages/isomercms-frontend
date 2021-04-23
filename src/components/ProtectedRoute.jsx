import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import axios from 'axios'

// Import contexts
const { useLoginContext } = require('../contexts/LoginContext')

// axios settings
axios.defaults.withCredentials = true

const ProtectedRoute = ({ children, component: WrappedComponent, ...rest }) => {
  const { userId } = useLoginContext()
  console.log(`protected route ${userId} ${window.location.href}`)
  const renderRoute = (props) => (
    userId ? (
      children || WrappedComponent && <WrappedComponent {...props} />
    ) : (
      <Redirect to="/" /> 
    )
  )

  return <Route {...rest} render={renderRoute} />
}

export default ProtectedRoute;