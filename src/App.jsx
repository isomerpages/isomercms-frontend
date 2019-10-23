import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from './layouts/Home';
import Sites from './layouts/Sites';
import Pages from './layouts/Pages';
import EditPage from './layouts/EditPage';
import Collections from './layouts/Collections';
import CollectionPages from './layouts/CollectionPages';
import EditCollectionPage from './layouts/EditCollectionPage';
import Images from './layouts/Images';
import EditImage from './layouts/EditImage';
import Files from './layouts/Files';
import EditFile from './layouts/EditFile';
import EditHomepage from './layouts/EditHomepage';
// import Menus from './layouts/Menus';
// import EditNav from './layouts/EditNav';
// import EditFooter from './layouts/EditFooter';

function App() {
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
          <Route exact path="/" component={Home} />
          <Route path="/sites/:siteName/collections/:collectionName/:fileName" component={EditCollectionPage} />
          <Route path="/sites/:siteName/collections/:collectionName" component={CollectionPages} />
          <Route path="/sites/:siteName/collections" component={Collections} />
          <Route path="/sites/:siteName/files/:fileName" component={EditFile} />
          <Route path="/sites/:siteName/files" component={Files} />
          <Route path="/sites/:siteName/images/:fileName" component={EditImage} />
          <Route path="/sites/:siteName/images" component={Images} />
          <Route path="/sites/:siteName/pages/:fileName" component={EditPage} />
          <Route path="/sites/:siteName/pages" component={Pages} />
          <Route path="/sites/:siteName/homepage" component={EditHomepage} />
          {/* <Route path="/sites/:siteName/menus/footer" component={EditFooter} />
          <Route path="/sites/:siteName/menus/navigation" component={EditNav} />
          <Route path="/sites/:siteName/menus" component={Menus} /> */}
          <Route path="/sites" component={Sites} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
