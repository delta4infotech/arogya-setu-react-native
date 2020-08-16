import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeManager';
import NavigationHeader from '../NavigationHeader';

import { useSelector, useDispatch } from 'react-redux';

import { useNavigation } from '@react-navigation/native';
import { fetchProfile } from '../../store/profile';

export default function Layout(props) {
  const { theme, mode } = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    console.log('asdasdasdasda', mode);
  }, [mode]);

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.paper }}>
      <StatusBar translucent={true} backgroundColor='rgba(0,0,0,0)' barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationHeader />
      {props.children}
    </View>
  );
}
