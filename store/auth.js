import { createSlice } from '@reduxjs/toolkit';
import * as Google from 'expo-google-app-auth';
import * as firebase from 'firebase';

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      token: null,
      idToken: null,
      refreshToken: null,
      uid: null,
    },
    authenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    loginStart: (state, actions) => {
      state.loading = true;
    },
    loginSuccess: (state, actions) => {
      state.user.token = actions.payload.accessToken ? actions.payload.accessToken : state.user.token;
      state.user.idToken = actions.payload.idToken ? actions.payload.idToken : state.user.idToken;
      state.user.refreshToken = actions.payload.refreshToken ? actions.payload.refreshToken : state.user.refreshToken;
      state.user.uid = actions.payload.uid ? actions.payload.uid : state.user.uid;
      state.authenticated = actions.payload.authenticated || actions.payload.accessToken || actions.payload.idToken ? true : false;
      state.loading = false;
      state.error = null;
    },
    setUid: (state, actions) => {
      state.user.uid = actions.payload.uid;
    },
    loginFail: (state, actions) => {
      state.error = actions.payload.error ? actions.payload.error : null;
      state.loading = false;
    },
    logoutSuccess: (state, actions) => {
      state.user = {
        token: null,
        idToken: null,
        refreshToken: null,
        uid: null,
      };
      state.authenticated = false;
      state.loading = false;
    },
  },
});

const { loginStart, loginSuccess, logoutSuccess, loginFail, setUid } = slice.actions;

//Actions

export const login = () => (dispatch) => {
  dispatch(loginStart());

  Google.logInAsync({
    androidClientId: '<your clid id>',
    scopes: ['profile', 'email'],
  })
    .then((res) => {
      if (res.type === 'success') {
        dispatch(loginSuccess({ accessToken: res.accessToken, idToken: res.idToken, refreshToken: res.refreshToken }));
        onSignIn(res);
      } else {
        dispatch(loginFail({}));
      }
    })
    .catch((err) => {
      console.log('Auth eerror', err);
      dispatch(loginFail({}));
    });
};

const onSignIn = (googleUser) => {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(function (firebaseUser) {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      var credential = firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken);
      // Sign in with credential from the Google user.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((res) => {
          console.log('Firebase Signin ---------------------', res);
          setUid({ uid: res.user.uid });
          firebase
            .database()
            .ref('/users/' + res.user.uid)
            .set({
              email: res.user.email,
              firstName: res.additionalUserInfo.profile.given_name,
              lastName: res.additionalUserInfo.profile.family_name,
              profilePicture: res.additionalUserInfo.profile.picture,
            });
        })
        .catch(function (error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
};

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID && providerData[i].uid === googleUser.user.id) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

export const logout = () => (dispatch) => {
  firebase.auth().signOut();
  dispatch(logoutSuccess());
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
