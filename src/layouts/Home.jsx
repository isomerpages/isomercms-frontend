import React from 'react';
import uuid from 'uuid';
import { Link } from "react-router-dom";

const UUID = uuid.v4()

export default function Home() {
  return (
    <div>
      <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&state=${UUID}&scope=public_repo`}>Sign in with GitHub</a>
    </div>
  );
}