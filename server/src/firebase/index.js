import firebase from 'firebase';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'fir-tutorial-a8292.firebaseapp.com',
  databaseURL: 'https://fir-tutorial-a8292.firebaseio.com',
  projectId: 'fir-tutorial-a8292',
  storageBucket: 'fir-tutorial-a8292.appspot.com',
  messagingSenderId: '67469922153',
  appId: '1:67469922153:web:9cca2e26e09485d4',
};

export const FirebaseApp = firebase.initializeApp(firebaseConfig);

export const FirebaseAuth = FirebaseApp.auth();
