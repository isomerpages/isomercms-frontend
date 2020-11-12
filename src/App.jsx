import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import axios from 'axios';

// Layouts
import AuthCallback from './layouts/AuthCallback'
import Home from './layouts/Home';
import Sites from './layouts/Sites';
import Workspace from './layouts/Workspace';
import EditPage from './layouts/EditPage';
import CategoryPages from './layouts/CategoryPages';
import Images from './layouts/Images';
import EditImage from './layouts/EditImage';
import Files from './layouts/Files';
import EditFile from './layouts/EditFile';
import EditHomepage from './layouts/EditHomepage';
import EditContactUs from './layouts/EditContactUs';
import Resources from './layouts/Resources';
import Menus from './layouts/Menus';
import EditNav from './layouts/EditNav';
import Settings from './layouts/Settings';
import ProtectedRoute from './components/ProtectedRoute'

// Import contexts
const { LoginContext } = require('./contexts/LoginContext')

// axios settings
axios.defaults.withCredentials = true

// Constants
const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env
const LOCAL_STORAGE_AUTH_STATE = 'isomercms_auth'

function App() {
  // Keep track of whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const authState = localStorage.getItem(LOCAL_STORAGE_AUTH_STATE)
    if (authState) return true
    return false
  })
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false)

  axios.interceptors.response.use(
    function (response) {
      return response
    },
    async function (error) {
      if (error.response && error.response.status === 401) {
        if (isLoggedIn) {
          setShouldBlockNavigation(true)
          console.log('User token has expired or does not exist')
        }
      } else {
        console.log('An unknown error occurred: ')
        console.error(error)
      }
      return Promise.reject(error)
    }
  )

  const setLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem(LOCAL_STORAGE_AUTH_STATE, true)
  }

  const setLogoutState = () => {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_STATE)
    setIsLoggedIn(false)
    setShouldBlockNavigation(false)
  }

  useEffect(() => {
    if (shouldBlockNavigation) {
      alert('Warning: your token has expired. Isomer will log you out now.')
      const logout = async () =>  {
        console.log('Logging out...')
        await axios.get(`${BACKEND_URL}/auth/logout`)
        setLogoutState()
      }
      logout()
    }
  }, [shouldBlockNavigation])

  useEffect(() => {
    if (!isLoggedIn) {
      setShouldBlockNavigation(false)
    }
  }, [isLoggedIn])

  const ProtectedRouteWithProps = (props) => {
    return <ProtectedRoute {...props} isLoggedIn={isLoggedIn} />
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
        <div>
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
            <LoginContext.Provider value={setLogoutState}>
              <Switch>
                  <ProtectedRouteWithProps exact path='/auth' component={AuthCallback} setLogin={setLogin} />
                  <ProtectedRouteWithProps exact path="/" component={Home} />
                  <ProtectedRouteWithProps path="/sites/:siteName/collections/:collectionName/:fileName" component={EditPage} isCollectionPage={true} isResourcePage={false} />
                  <ProtectedRouteWithProps path="/sites/:siteName/collections/:collectionName" component={CategoryPages} isResource={false}/>
                  <ProtectedRouteWithProps path="/sites/:siteName/files/:fileName" component={EditFile} />
                  <ProtectedRouteWithProps path="/sites/:siteName/files" component={Files} />
                  <ProtectedRouteWithProps path="/sites/:siteName/images/:fileName" component={EditImage} />
                  <ProtectedRouteWithProps path="/sites/:siteName/images" component={Images} />
                  <ProtectedRouteWithProps path="/sites/:siteName/pages/:fileName" component={EditPage} isCollectionPage={false} isResourcePage={false} />
                  <ProtectedRouteWithProps path="/sites/:siteName/workspace" component={Workspace} />
                  <ProtectedRouteWithProps path="/sites/:siteName/homepage" component={EditHomepage} />
                  <ProtectedRouteWithProps path="/sites/:siteName/contact-us" component={EditContactUs} />
                  <ProtectedRouteWithProps path="/sites/:siteName/resources/:resourceName/:fileName" component={EditPage} isCollectionPage={false} isResourcePage={true} />
                  <ProtectedRouteWithProps path="/sites/:siteName/resources/:collectionName" component={CategoryPages} isResource={true}/>
                  <ProtectedRouteWithProps path="/sites/:siteName/resources" component={Resources} />
                  <ProtectedRouteWithProps path="/sites/:siteName/menus/main-menu" component={EditNav} />
                  <ProtectedRouteWithProps path="/sites/:siteName/menus" component={Menus} />
                  <ProtectedRouteWithProps path="/sites/:siteName/settings" component={Settings} />
                  <ProtectedRouteWithProps exact path="/sites" component={Sites} />
                  <Route>
                    <Redirect to={ isLoggedIn ? '/sites' : '/' } />
                  </Route>
              </Switch>
            </LoginContext.Provider>
        </div>
    </Router>
  );
}

export default App;