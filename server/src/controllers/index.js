import jwt from 'jwt-simple';
import axios from 'axios';
import dotenv from 'dotenv';
import { mockUser, wrappedErrorMessage, wrappedSuccessResponse } from '../utils';

dotenv.config();

export const getJoke = async (_, res) => {
  const { data } = await axios.get('https://api.icndb.com/jokes/random');
  res.send({ joke: data.value.joke });
};

export const login = (req, res) => {
  const { password } = req.body;

  if (password !== mockUser.password) return res.send(wrappedErrorMessage('Wrong password'));

  req.session.currentUser = mockUser;

  const jwtToken = jwt.encode(JSON.stringify(mockUser), process.env.JWT_SECRET);

  res.send(wrappedSuccessResponse({ user: mockUser, token: `Bearer ${jwtToken}` }));
};

export const logout = (req, res) => {
  req.session.destroy();

  res.send(wrappedSuccessResponse({ user: null }));
};
