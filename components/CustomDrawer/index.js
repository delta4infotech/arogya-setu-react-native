import React, { useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/auth';

export default function CustomDrawerContent(props) {
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('profile nameee Drawer');
    console.log(profile);
  }, [profile.name]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 20, width: '100%' }}>
        <Image source={{ uri: profile.profilePicture }} style={{ height: 90, width: 90, borderRadius: 80 }} resizeMode='cover' />
      </View>

      <DrawerItemList {...props} />

      <Button onPress={() => dispatch(logout())} title='Logout' />
    </DrawerContentScrollView>
  );
}
