import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import axios from 'axios';

// Import contexts
import { LoginProvider } from '@contexts/LoginContext'

// Styles
import elementStyles from '@styles/isomer-cms/Elements.module.scss';

// Import route selector
import { RouteSelector } from '@routing/RouteSelector'

import 'react-toastify/dist/ReactToastify.css';

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
)

// react-query client
const queryClient = new QueryClient();

export const App = () => {
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_SITE_COLORS)
  }, [])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <QueryClientProvider client={queryClient}>
          <ToastContainer hideProgressBar position='top-center' closeButton={ToastCloseButton} className={elementStyles.toastContainer}/>
          <LoginProvider>
            <RouteSelector />
          </LoginProvider>
        </QueryClientProvider>
    </Router>
  )
}

export default App