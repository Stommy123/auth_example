import React, { useState } from 'react';
import { useBasicAuth, useRequestClient } from 'hooks';
import { LoginForm, GetJoke } from 'components';

const getAuthTokenFromStorage = _ => sessionStorage.getItem('BASIC_TOKEN');

const BasicAuth = _ => {
  const [joke, setJoke] = useState('');
  const { currentUser, login, logout } = useBasicAuth();
  const requestClient = useRequestClient(getAuthTokenFromStorage(), 'basic-authorization');

  if (!currentUser) {
    return <LoginForm type='Basic' onSubmit={login} />;
  }

  const getJoke = async _ => {
    try {
      const { data } = await requestClient.get('/basic');

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
    <div className='basic-auth wrapper'>
      <h1>Logged in as {currentUser.name}</h1>
      <button onClick={logout}>Logout</button>
      <GetJoke joke={joke} getJoke={getJoke} />
    </div>
  );
};

export default BasicAuth;
