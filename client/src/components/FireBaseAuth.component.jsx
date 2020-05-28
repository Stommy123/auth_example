import React, { useState } from 'react';
import { useFirebaseAuth, useRequestClient } from 'hooks';
import { parseStringifiedJSON } from 'utils';
import { LoginForm, GetJoke } from '.';

const getFirebaseTokenFromStorage = _ =>
  parseStringifiedJSON(sessionStorage.getItem('FIREBASE_TOKEN'));

const FirebaseAuth = _ => {
  const [joke, setJoke] = useState('');
  const { currentUser, login, logout } = useFirebaseAuth();
  const requestClient = useRequestClient(getFirebaseTokenFromStorage(), 'firebase-authorization');

  if (!currentUser) {
    return <LoginForm type='Firebase' onSubmit={login} />;
  }

  const getJoke = async _ => {
    try {
      const { data } = await requestClient.get('/firebase');
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
    <div className='firebase-auth wrapper'>
      <h1>Logged in as {currentUser.email}</h1>
      <button onClick={logout}>Logout</button>
      <GetJoke joke={joke} getJoke={getJoke} />
    </div>
  );
};

export default FirebaseAuth;
