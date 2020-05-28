import React from 'react';
import { Auth0, BasicAuth, FirebaseAuth } from '../components';

const AppRoot = _ => (
  <div className='app-container'>
    <Auth0 />
    <BasicAuth />
    <FirebaseAuth />
  </div>
);

export default AppRoot;
