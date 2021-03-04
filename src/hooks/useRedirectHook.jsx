import React, { useEffect, useState } from "react"
import { Redirect, useHistory } from "react-router-dom"

const useRedirectHook = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [redirectComponentState, setRedirectComponentState] = useState({})
  const history = useHistory()

  useEffect(() => {
    if (shouldRedirect) history.push({
      pathname: redirectUrl,
      state: redirectComponentState
    })
  }, [shouldRedirect])

  return { shouldRedirect, setShouldRedirect, setRedirectUrl, setRedirectComponentState }
}

export default useRedirectHook;