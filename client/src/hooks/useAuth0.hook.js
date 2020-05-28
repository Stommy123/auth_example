import { useState, useEffect } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

const onRedirectCallback = _ =>
  window.history.replaceState({}, document.title, window.location.pathname);

const useAuth0 = _ => {
  const [isAuthenticated, setIsAuthenticated] = useState();
  const [user, setUser] = useState(null);
  const [auth0Client, setAuth0Client] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(_ => {
    (async _ => {
      const auth0Client = await createAuth0Client({
        domain: process.env.REACT_APP_AUTH0_DOMAIN,
        client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        onRedirectCallback,
      });
      setAuth0Client(auth0Client);

      if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
        const { appState } = await auth0Client.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated = await auth0Client.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const [user, token] = await Promise.all([
          auth0Client.getUser(),
          auth0Client.getTokenSilently(),
        ]);

        sessionStorage.setItem('AUTH0_TOKEN', `Bearer ${token}`);
        setUser(user);
      }

      setLoading(false);
    })();
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async _ => {
    setLoading(true);
    await auth0Client.handleRedirectCallback();
    const user = await auth0Client.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = async (...options) => {
    sessionStorage.removeItem('AUTH0_TOKEN');
    await auth0Client.logout(...options);
  };

  return {
    isAuthenticated,
    user,
    loading,
    popupOpen,
    loginWithPopup,
    handleRedirectCallback,
    logout,
    getIdTokenClaims: (...options) => auth0Client.getIdTokenClaims(...options),
    loginWithRedirect: (...options) => auth0Client.loginWithRedirect(...options),
    getTokenSilently: (...options) => auth0Client.getTokenSilently(...options),
    getTokenWithPopup: (...options) => auth0Client.getTokenWithPopup(...options),
  };
};

export default useAuth0;
