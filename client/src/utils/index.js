import { FirebaseAuth } from '../firebase';

export const isUndefined = item => item === undefined;

export const isNull = item => item === null;

export const isNil = item => isUndefined(item) || isNull(item);

export const isArray = item => Array.isArray(item);

export const isObject = item => !!(typeof item === 'object' && !isArray(item) && item);

export const isEmpty = item => {
  if (item && item.hasOwnProperty('length')) return !item.length;
  if (isObject(item)) return !Object.keys(item).length;
  return isNil(item);
};

export const cloneDeep = item => JSON.parse(JSON.stringify(item));

export const nullifyEmptyValues = obj =>
  Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (!isEmpty(value)) acc[key] = value;

    return acc;
  }, {});

export const parseStringifiedJSON = (item, defaultValue) => {
  try {
    return JSON.parse(item);
  } catch {
    return isUndefined(defaultValue) ? item : defaultValue;
  }
};

export const noop = _ => ({});

export const regexString = (str = '') => new RegExp(str.trim(), 'i');

export const resolveUser = _ =>
  new Promise((resolve, reject) => FirebaseAuth.onAuthStateChanged(user => resolve(user), reject));

export const getFirebaseUser = async _ => {
  try {
    const currentUser = await resolveUser();
    if (!currentUser) return {};
    const token = await currentUser.getIdToken();
    return { token, currentUser };
  } catch (err) {
    console.log('error logging firebase user in', err);
    return {};
  }
};

export const getToken = (authHeaders = '') => authHeaders.split('Bearer ')[1];

export const mockUser = {
  id: 'abc123',
  email: 'tommy@tommy.com',
  name: 'Tommy',
  password: 'password',
};
