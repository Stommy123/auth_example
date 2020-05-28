import jwt from 'jwt-simple';
import jwtExpress from 'express-jwt';
import jwksRSA from 'jwks-rsa';
import dotenv from 'dotenv';
import { wrappedErrorMessage, parseStringifiedJSON, getFirebaseUser, getToken } from '../utils';

dotenv.config();

const withAuth0 = jwtExpress({
  secret: jwksRSA.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithm: ['RS256'],
});

const withFirebaseAuth = async (req, res, next) => {
  try {
    const authToken = getToken(req.headers['firebase-authorization']);

    const { token: firebaseToken } = await getFirebaseUser();

    if (authToken !== firebaseToken) throw new Error('UNAUTHENTICATED');

    next();
  } catch {
    res.send(wrappedErrorMessage('WITH_AUTH_ERROR', err));
  }
};

const withBasicAuth = (req, res, next) => {
  try {
    const token = getToken(req.headers['basic-authorization']);
    const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
    const parsedUserDataFromToken = parseStringifiedJSON(decodedToken, {});

    const { id } = req.session.currentUser || {};

    const isCurrentUser = id === parsedUserDataFromToken.id;

    if (!isCurrentUser) throw new Error('UNAUTHENTICATED');

    next();
  } catch (err) {
    res.send(wrappedErrorMessage('WITH_AUTH_ERROR', err));
  }
};

const middleware = { withBasicAuth, withAuth0, withFirebaseAuth };

export default middleware;
