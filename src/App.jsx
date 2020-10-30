import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import axios from 'axios'

// Layouts
import Home from './layouts/Home';
import Sites from './layouts/Sites';
import Pages from './layouts/Pages';
import EditPage from './layouts/EditPage';
import CollectionPages from './layouts/CollectionPages';
import EditCollectionPage from './layouts/EditCollectionPage';
import Images from './layouts/Images';
import EditImage from './layouts/EditImage';
import Files from './layouts/Files';
import EditFile from './layouts/EditFile';
import EditHomepage from './layouts/EditHomepage';
import Resources from './layouts/Resources';
import Menus from './layouts/Menus';
import EditNav from './layouts/EditNav';
import Settings from './layouts/Settings';
import ProtectedRoute from './components/ProtectedRoute'

// Utils
const { doesHttpOnlyCookieExist } = require('./utils/cookieChecker')

// axios settings
axios.defaults.withCredentials = true

// Constants
const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env
const COOKIE_NAME = 'isomercms'

function App() {
  // Keep track of whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(doesHttpOnlyCookieExist(COOKIE_NAME))

  useLayoutEffect(() => {
    const cookieValidation = async () => {
      try {
        console.log('Validating cookie...')
        await axios.get(`${BACKEND_URL}/validate-cookie`)
        console.log('Successfully validated cookie!')

        // If response is received, set logged in state to be true
        setIsLoggedIn(true)
      } catch {
        console.log('Cookie invalid/does not exist.')
        await axios.get(`${BACKEND_URL}/auth/logout`)
        setIsLoggedIn(false)
      }
    }
    cookieValidation()
  }, [])

  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        return response
      },
      async function (error) {
        if (error.response && error.response.status === 401) {
          await axios.get(`${BACKEND_URL}/auth/logout`)
          setIsLoggedIn(false)
          console.log('User token has expired or does not exist')
        } else {
          console.log('An unknown error occurred: ')
          console.error(error)
        }
        return Promise.reject(error)
      }
    )
  })

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
        <Switch>
          <ProtectedRoute exact path="/" component={Home} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/collections/:collectionName/:fileName" component={EditCollectionPage} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/collections/:collectionName" component={CollectionPages} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/files/:fileName" component={EditFile} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/files" component={Files} isLoggedIn={isLoggedIn}/>
          <ProtectedRoute path="/sites/:siteName/images/:fileName" component={EditImage} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/images" component={Images} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/pages/:fileName" component={EditPage} isResourcePage={false} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/pages" component={Pages} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/homepage" component={EditHomepage} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/resources/:resourceName/:fileName" component={EditPage} isResourcePage={true} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/resources" component={Resources} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/menus/main-menu" component={EditNav} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/menus" component={Menus} isLoggedIn={isLoggedIn} />
          <ProtectedRoute path="/sites/:siteName/settings" component={Settings} isLoggedIn={isLoggedIn} />
          <ProtectedRoute exact path="/sites" component={Sites} isLoggedIn={isLoggedIn} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
