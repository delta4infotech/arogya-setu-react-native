import * as firebase from 'firebase';
import { firebaseConfig } from './firebaseConfig';

export const initializeFirebase = () => {
  try {
    firebase.initializeApp(firebaseConfig);
  } catch (err) {}
};
