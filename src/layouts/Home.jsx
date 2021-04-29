import React from 'react';
import uuid from 'uuid';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const UUID = uuid.v4();

export default function Home() {
  return (
    <div className={elementStyles.loginDiv}>
      <div>
        <img className={elementStyles.loginImage} src={`${process.env.PUBLIC_URL}/img/logo.svg`} alt="Isomer CMS logo" />
        <button
          type="button"
          onClick={() => {
            window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&state=${UUID}&scope=repo`
          }}
          className={`${elementStyles.green} ${elementStyles.loginButton}`}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  )
}
