import { useState, useEffect } from 'react';
import { getFirebaseUser, parseStringifiedJSON } from 'utils';
import { FirebaseAuth } from '../firebase';

const getFirebaseUserFromStorage = _ =>
  parseStringifiedJSON(sessionStorage.getItem('FIREBASE_USER'));

const useFirebase = _ => {
  const [currentUser, setCurrentUser] = useState(_ => getFirebaseUserFromStorage() || null);

  const login = async ({ email, password, isLoggedIn }) => {
    try {
      !isLoggedIn && (await FirebaseAuth.signInWithEmailAndPassword(email, password));

      const { currentUser, token } = await getFirebaseUser();

      setCurrentUser(currentUser);

      sessionStorage.setItem('FIREBASE_TOKEN', token);
      sessionStorage.setItem('FIREBASE_USER', currentUser);
    } catch (err) {
      console.error('Could not log firebase user in', err);
      alert('Could not locate user with provided email / password');
    }
  };

  const logout = async _ => {
    await FirebaseAuth.signOut();
    sessionStorage.removeItem('FIREBASE_TOKEN');
    sessionStorage.removeItem('FIREBASE_USER');
    setCurrentUser(null);
  };

  useEffect(_ => {
    const userInStorage = getFirebaseUserFromStorage();
    if (!userInStorage) return;

    login({ isLoggedIn: true });
  }, []);

  return {
    currentUser,
    login,
    logout,
  };
};

export default useFirebase;
