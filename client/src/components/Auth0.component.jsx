import React, { useState } from 'react';
import { useAuth0, useRequestClient } from 'hooks';
import { GetJoke } from 'components';

const getAuth0Token = _ => sessionStorage.getItem('AUTH0_TOKEN');

const Auth0Login = ({ login }) => (
  <div className='auth-0-login wrapper'>
    <h1>Login with Auth0</h1>
    <button onClick={login}>Login!</button>
  </div>
);

const Auth0 = _ => {
  const [joke, setJoke] = useState('');
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const requestClient = useRequestClient(getAuth0Token(), 'authorization');

  if (!isAuthenticated || !user) {
    return <Auth0Login login={loginWithRedirect} />;
  }

  const getJoke = async _ => {
    try {
      const { data } = await requestClient.get('/auth-0');

      if (!data.joke) {
        throw new Error();
      }

      setJoke(data.joke);
    } catch (err) {
      console.error('could not get joke', err);
      alert('Unauthorized!');
    }
  };

  return (
    <div className='auth-0 wrapper'>
      <h1>Logged in as {user.nickname}</h1>
      <button onClick={logout}>Logout</button>
      <GetJoke joke={joke} getJoke={getJoke} />
    </div>
  );
};

export default Auth0;
