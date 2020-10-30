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

// axios settings
axios.defaults.withCredentials = true

// Constants
const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env

function App() {
  // Keep track of whether user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)

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
          <ProtectedRoute
            exact
            path="/"
            component={Home}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
          />
          <Route path="/sites/:siteName/collections/:collectionName/:fileName" component={EditCollectionPage} />
          <Route path="/sites/:siteName/collections/:collectionName" component={CollectionPages} />
          {/* <Route path="/sites/:siteName/collections" component={Collections} /> */}
          <Route path="/sites/:siteName/files/:fileName" component={EditFile} />
          <Route path="/sites/:siteName/files" component={Files} />
          <Route path="/sites/:siteName/images/:fileName" component={EditImage} />
          <Route path="/sites/:siteName/images" component={Images} />
          <Route path="/sites/:siteName/pages/:fileName" render={(props) => (
            <EditPage {...props} isResourcePage={false} />
          )} />
          <Route path="/sites/:siteName/pages" component={Pages} />
          <Route path="/sites/:siteName/homepage" component={EditHomepage} />
          <Route path="/sites/:siteName/resources/:resourceName/:fileName" render={(props) => (
            <EditPage {...props} isResourcePage={true} />
          )} />
          <Route path="/sites/:siteName/resources" component={Resources} />
          {/* <Route path="/sites/:siteName/menus/footer" component={EditFooter} />  */}
          <Route path="/sites/:siteName/menus/main-menu" component={EditNav} />
          <Route path="/sites/:siteName/menus" component={Menus} />
          <Route path="/sites/:siteName/settings" component={Settings} />
          <Route path="/sites" component={Sites} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
