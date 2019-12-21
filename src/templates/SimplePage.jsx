import React from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from './pageComponents/Breadcrumb';

// This following template was taken from the 'Simple Page'
const SimplePage = ({ chunk, title }) => (
  <html lang="en" className="has-navbar-fixed-top-widescreen js flexbox flexboxlegacy canvas canvastext webgl no-touch geolocation postmessage websqldatabase indexeddb hashchange history draganddrop websockets rgba hsla multiplebgs backgroundsize borderimage borderradius boxshadow textshadow opacity cssanimations csscolumns cssgradients cssreflections csstransforms csstransforms3d csstransitions fontface generatedcontent video audio localstorage sessionstorage webworkers applicationcache svg inlinesvg smil svgclippaths wf-opensans-n4-active wf-active">
    <head>
      <meta charSet="utf8" />
      <meta name="viewport" content="width=device-width, user-scalable=yes, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <link rel="stylesheet" href="https://d33wubrfki0l68.cloudfront.net/bundles/be1e50e8b565ca5d9185efbfc642d4c0c72a486f.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:400,600" crossOrigin="anonymous" />
      <script async="" src="https://www.google-analytics.com/analytics.js"></script><script async="" src="https://assets.wogaa.sg/snowplow/2.10.2/sp.js" />
      <style data-styled="" data-styled-version="4.2.0" />
      <style data-styled="" data-styled-version="4.2.0" />
      <script src="//assets.adobedtm.com/launch-ENaf340d988e354d18ba897b99e3538f23.min.js" async="" />
    </head>
    <body>
      <div>
        <Breadcrumb title={title} />
        <section className="bp-section">
          <div className="bp-container content padding--top--lg padding--bottom--xl">
            <div className="row">
              <div className="col is-8 is-offset-1-desktop is-12-touch print-content" style={{ left: '80px' }}>
                <div className="content" dangerouslySetInnerHTML={{ __html: chunk }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </body>
  </html>
);

SimplePage.propTypes = {
  chunk: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default SimplePage;
