import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import './styles/index.scss';
import 'sgds-govtech/css/sgds.css';
import App from './App';

if (process.env.ENV !== 'dev') {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [
          new Integrations.BrowserTracing(),
        ],
    
        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,
    });
}

ReactDOM.render(<App />, document.getElementById('root'));
