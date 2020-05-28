import { Router as ExpressRouter } from 'express';
import Middleware from '../middleware';
import { getJoke, login, logout } from '../controllers';

const Router = ExpressRouter();

Router.get('/auth-0', Middleware.withAuth0, getJoke);

Router.get('/firebase', Middleware.withFirebaseAuth, getJoke);

Router.get('/basic', Middleware.withBasicAuth, getJoke);

Router.post('/login', login);

Router.post('/logout', logout);

export default Router;
