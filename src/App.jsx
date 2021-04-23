import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import axios from 'axios';
import * as Sentry from "@sentry/react";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Home from './layouts/Home';
import Sites from './layouts/Sites';
import Workspace from './layouts/Workspace';
import Folders from './layouts/Folders';
import EditPage from './layouts/EditPage';
import CategoryPages from './layouts/CategoryPages';
import Images from './layouts/Images';
import EditImage from './layouts/EditImage';
import Files from './layouts/Files';
import EditFile from './layouts/EditFile';
import EditHomepage from './layouts/EditHomepage';
import EditContactUs from './layouts/EditContactUs';
import Resources from './layouts/Resources';
import EditNavBar from './layouts/EditNavBar'
import Settings from './layouts/Settings';
import NotFoundPage from './components/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'
import FallbackComponent from './components/FallbackComponent'

// Styles
import elementStyles from './styles/isomer-cms/Elements.module.scss';

// Import contexts
const { LoginProvider } = require('./contexts/LoginContext');

// axios settings
axios.defaults.withCredentials = true

// Constants
const LOCAL_STORAGE_SITE_COLORS = 'isomercms_colors'

const ToastCloseButton = ({ closeToast }) => (
  <span style={{
    display: "inline-flex",
    alignItems: "center"
  }}>
    <i
      className="bx bx-x bx-sm"
      onClick={closeToast}
    />
  </span>
);

// react-query client
const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_SITE_COLORS)
  }, [])

  const ProtectedRouteWithProps = (props) => {
    return (
      <Sentry.ErrorBoundary fallback={FallbackComponent}>
        <ProtectedRoute {...props} />
      </Sentry.ErrorBoundary>
    )
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <QueryClientProvider client={queryClient}>
          <ToastContainer hideProgressBar={true} position='top-center' closeButton={ToastCloseButton} className={elementStyles.toastContainer}/>
          <div>
            {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
              <LoginProvider>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <ProtectedRouteWithProps exact path="/sites/:siteName/folder/:folderName/subfolder/:subfolderName/:fileName" component={EditPage} isCollectionPage={true} isResourcePage={false} />
                    <ProtectedRouteWithProps exact path="/sites/:siteName/folder/:folderName/:fileName" component={EditPage} isCollectionPage={true} isResourcePage={false} />
                    <ProtectedRouteWithProps exact path="/sites/:siteName/folder/:folderName" component={Folders} />
                    <ProtectedRouteWithProps exact path="/sites/:siteName/folder/:folderName/subfolder/:subfolderName" component={Folders} />
                    <ProtectedRouteWithProps exact path="/sites/:siteName/navbar" component={EditNavBar} />
                    <ProtectedRouteWithProps path="/sites/:siteName/files/:fileName" component={EditFile} />
                    <ProtectedRouteWithProps path="/sites/:siteName/files" component={Files} />
                    <ProtectedRouteWithProps path="/sites/:siteName/images/:customPath" component={Images} />
                    <ProtectedRouteWithProps path="/sites/:siteName/images" component={Images} />
                    <ProtectedRouteWithProps path="/sites/:siteName/pages/:fileName" component={EditPage} isCollectionPage={false} isResourcePage={false} />
                    <ProtectedRouteWithProps path="/sites/:siteName/workspace" component={Workspace} />
                    <ProtectedRouteWithProps path="/sites/:siteName/homepage" component={EditHomepage} />
                    <ProtectedRouteWithProps path="/sites/:siteName/contact-us" component={EditContactUs} />
                    <ProtectedRouteWithProps path="/sites/:siteName/resources/:resourceName/:fileName" component={EditPage} isCollectionPage={false} isResourcePage={true} />
                    <ProtectedRouteWithProps path="/sites/:siteName/resources/:collectionName" component={CategoryPages} isResource={true}/>
                    <ProtectedRouteWithProps path="/sites/:siteName/resources" component={Resources} />
                    <ProtectedRouteWithProps path="/sites/:siteName/navbar" component={EditNavBar} />
                    <ProtectedRouteWithProps path="/sites/:siteName/settings" component={Settings} />
                    <ProtectedRouteWithProps exact path="/sites" component={Sites} />
                    <ProtectedRouteWithProps path="/" component={NotFoundPage}/>
                </Switch>
              </LoginProvider>
          </div>
        </QueryClientProvider>
    </Router>
  );
}

export default App;