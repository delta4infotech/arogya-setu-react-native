import { createSlice } from '@reduxjs/toolkit';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

const slice = createSlice({
  name: 'auth',
  initialState: {
    firstName: '',
    lastName: '',
    name: '',
    email: '',
    uid: null,
    profilePicture: '',
    loading: false,
    error: null,
  },
  reducers: {
    fetchProfileStart: (state, actions) => {
      state.loading = true;
    },
    fetchProfileSuccess: (state, actions) => {
      console.log(actions);
      state.firstName = actions.payload.firstName;
      state.lastName = actions.payload.lastName;
      state.name = actions.payload.name;
      state.email = actions.payload.email;
      state.uid = actions.payload.uid;
      state.profilePicture = actions.payload.profilePicture;
      state.loading = false;
      state.error = null;
    },
    fetchProfileFail: (state, actions) => {
      state.error = actions.payload.error ? actions.payload.error : null;
      state.loading = false;
    },
  },
});

const { fetchProfileStart, fetchProfileSuccess, fetchProfileFail } = slice.actions;

//Actions

export const fetchProfile = () => (dispatch) => {
  dispatch(fetchProfileStart());

  const user = firebase.auth().currentUser;

  console.log('Firebase current user');
  if (user) {
    dispatch(fetchProfileSuccess({ name: user.displayName, uid: user.uid, email: user.email, profilePicture: user.photoURL, firstName: '', lastName: '' }));
  }

  dispatch(fetchProfileFail({ error: 'No user found' }));
};

export const checkLogin = () => (dispatch) => {
  console.log('ppppppppppp');
  dispatch(loginStart());
  firebase.auth().onAuthStateChanged((user) => {
    console.log('Check Login User------------------', user);
    if (user) {
      dispatch(loginSuccess({ authenticated: true }));
    } else {
      dispatch(loginFail({}));
    }
  });
};

export default slice.reducer;
