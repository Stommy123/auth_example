import { useState, useEffect } from 'react';
import { parseStringifiedJSON } from 'utils';
import { useRequestClient } from 'hooks';

const getUserFromStorage = _ => parseStringifiedJSON(sessionStorage.getItem('BASIC_USER'));
const getAuthTokenFromStorage = _ => sessionStorage.getItem('BASIC_TOKEN');

const useFirebase = _ => {
  const requestClient = useRequestClient(getAuthTokenFromStorage(), 'basic-authorization');
  const [currentUser, setCurrentUser] = useState(_ => getUserFromStorage() || null);

  const login = async credentials => {
    try {
      const { data } = await requestClient.post('/login', credentials);

      if (data.error || !data.success) {
        setCurrentUser(null);
        sessionStorage.removeItem('BASIC_TOKEN');
        sessionStorage.removeItem('BASIC_USER');
        throw new Error();
      }

      const userToSet = data.user;

      setCurrentUser(userToSet);
      sessionStorage.setItem('BASIC_USER', JSON.stringify(userToSet));
      sessionStorage.setItem('BASIC_TOKEN', data.token);
    } catch (err) {
      console.error('Could not log basic user in', err);
      alert('Could not locate user with provided email / password');
    }
  };

  const logout = async _ => {
    await requestClient.post('/logout');

    setCurrentUser(null);
    sessionStorage.removeItem('BASIC_TOKEN');
    sessionStorage.removeItem('BASIC_USER');
  };

  useEffect(_ => {
    const userInStorage = getUserFromStorage();
    if (!userInStorage) return;

    login(userInStorage);
  }, []);

  return {
    currentUser,
    login,
    logout,
  };
};

export default useFirebase;
