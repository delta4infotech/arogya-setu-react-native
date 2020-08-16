import React, { useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Navigator from './navigator/Navigator';

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import AuthReducer from './store/auth';
import ProfileReducer from './store/profile';
import { ThemeManager } from './theme/ThemeManager';

import { initializeFirebase } from './firebase/initializeFirebase';

initializeFirebase();

console.disableYellowBox = true;

const reducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
});

const store = configureStore({ reducer });

export default function App() {
  return (
    <Provider store={store}>
      <ThemeManager>
        <Navigator />
      </ThemeManager>
    </Provider>
  );
}

const styles = StyleSheet.create({});
