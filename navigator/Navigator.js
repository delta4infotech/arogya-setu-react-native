import React, { useEffect } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/Home';
import MapScreen from '../screens/Map';
import MarkMap from '../screens/MarkArea';
import DemoScreen from '../screens/Demo';
import MapBoxScreen from '../screens/MapBox';
import LoginScreen from '../screens/Login';
import AuthLoading from '../components/AuthLoading';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeManager';
import { checkLogin } from '../store/auth';

import CustomDrawer from '../components/CustomDrawer';

import { useSelector, useDispatch } from 'react-redux';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MapNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Map' component={MapScreen} />
      <Stack.Screen name='MarkMap' component={MarkMap} />
    </Stack.Navigator>
  );
}

export default function Navigator() {
  const { mode } = useTheme();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkLogin());

    console.log('use Effect', auth);
  }, [auth.user.token]);

  let screens;

  if (auth.loading) {
    screens = (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='AuthLoading' component={AuthLoading} />
      </Stack.Navigator>
    );
  } else {
    if (auth.authenticated) {
      screens = (
        <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <CustomDrawer {...props} />}>
          <Drawer.Screen name='Map' component={MapScreen} />
          <Drawer.Screen name='MapBox' component={MapBoxScreen} />
        </Drawer.Navigator>
      );
    } else {
      screens = (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen} />
        </Stack.Navigator>
      );
    }
  }

  return (
    <NavigationContainer theme={mode === 'dark' ? DarkTheme : DefaultTheme}>
      <Drawer.Navigator initialRouteName='Home' drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen name='Map' component={MapNavigator} />
        <Drawer.Screen name='MapBox' component={MapBoxScreen} />
        <Drawer.Screen name='Demo' component={DemoScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
