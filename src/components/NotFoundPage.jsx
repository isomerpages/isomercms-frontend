import React, { useState } from "react";
import { Link } from 'react-router-dom';

import errorStyles from '../styles/isomer-cms/pages/Error.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const NotFoundPage = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)

  return (
    <>
      <div className={errorStyles.errorPageMain}>
        <img
          className={errorStyles.errorImage}
          alt={`Page Not Found Error Image`}
          src={`/404Error.svg`}
        />
        <div className={errorStyles.errorText}>
          The page you are looking for does not exist anymore.
          <br/> 
          Try refreshing your page when you return.
        </div>
        
        <Link to='/sites'>
          <button className={`${errorStyles.errorButton} ${elementStyles.blue}`}>
            Back to IsomerCMS
          </button>
        </Link>
      </div>
    </>
  )
}

export default NotFoundPage;
