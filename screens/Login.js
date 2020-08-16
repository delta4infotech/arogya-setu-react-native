import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button, TouchableOpacity } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';

import { useTheme } from '../theme/ThemeManager';

import { login, logout } from '../store/auth';
import Layout from '../components/Layout';
import NavigationHeader from '../components/NavigationHeader';
import * as Google from 'expo-google-app-auth';

import GoogleLogin from '../components/Svg/loginWithGoogle';

export default function Home() {
  const [location, setLocation] = useState(null);

  const { mode, theme, toggle } = useTheme();

  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const onLogin = async () => {
    dispatch(login());
  };
  const onLogout = async () => {
    dispatch(logout());
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <TouchableOpacity onPress={onLogin} activeOpacity={0.7}>
        <GoogleLogin textColor={theme.primaryText} bgColor={theme.grey1} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
